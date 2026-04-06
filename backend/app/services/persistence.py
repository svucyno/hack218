from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from pathlib import Path
import json
import re
from typing import Iterable
from uuid import uuid4

from fastapi import HTTPException
from sqlmodel import Session, select

from backend.app.core.config import settings
from backend.app.db.init_db import DEFAULT_PATIENT_ID
from backend.app.models import DoseActivityLog, DoseScheduleItem, Patient, ReviewedMedicine, UploadedDocument
from backend.app.schemas.dose import DoseStatusUpdateResponse
from backend.app.schemas.medication import NormalizedMedicine, ReviewMedicinesRequest, ReviewMedicinesResponse
from backend.app.schemas.patient import CaregiverStatus, PatientTodayResponse, RecentActivityItem
from backend.app.schemas.retrieval import DocumentDetailResponse, DocumentReviewResponse, ScheduleDetailResponse
from backend.app.schemas.schedule import AdherenceSummary, DoseStatus, GenerateScheduleRequest, GenerateScheduleResponse, ScheduleDose
from backend.app.schemas.upload import MedicineCandidate, UploadResponse
from backend.app.services.ocr_service import UnsupportedDocumentTypeError, extract_document_text, validate_document_extension
from backend.app.services.parser_service import parse_medicine_candidates
from backend.app.services.schedule_service import build_caregiver_status, build_doses_from_medicines, get_next_reminder, group_doses, summarize_adherence


DEFAULT_REVIEWED_MEDICINES = [
    NormalizedMedicine(
        medicine_id="med_001",
        name="Pantoprazole",
        dosage="40 mg",
        frequency="once_daily",
        timing=["7:30 AM"],
        food_note="before_breakfast",
        duration_days=7,
        status="confirmed",
    ),
    NormalizedMedicine(
        medicine_id="med_002",
        name="Amoxicillin",
        dosage="500 mg",
        frequency="twice_daily",
        timing=["8:00 AM", "8:00 PM"],
        food_note="after_food",
        duration_days=5,
        status="confirmed",
    ),
    NormalizedMedicine(
        medicine_id="med_003",
        name="Aspirin",
        dosage="75 mg",
        frequency="once_daily",
        timing=["1:00 PM"],
        food_note="after_lunch",
        duration_days=None,
        status="confirmed",
    ),
]


def _serialize(value: object) -> str:
    return json.dumps(value)


def _serialize_list(values: Iterable[str]) -> str:
    return json.dumps(list(values))


def _deserialize_list(value: str) -> list[str]:
    return list(json.loads(value)) if value else []


def _deserialize_candidates(value: str) -> list[MedicineCandidate]:
    if not value:
        return []
    return [MedicineCandidate.model_validate(item) for item in json.loads(value)]


def _extract_duration_days(duration_text: str) -> int | None:
    match = re.search(r"(\d+)", duration_text)
    return int(match.group(1)) if match else None


def _normalize_frequency(frequency_text: str) -> str:
    normalized = frequency_text.strip().lower().replace(" ", "_")
    return normalized or "once_daily"


def _normalize_timing(timing_text: str) -> list[str]:
    if " and " in timing_text:
        return [part.strip() for part in timing_text.split(" and ") if part.strip()]
    if timing_text:
        return [timing_text.strip()]
    return ["8:00 AM"]


def _to_schedule_dose(row: DoseScheduleItem) -> ScheduleDose:
    return ScheduleDose(
        dose_id=row.dose_id,
        medicine_name=row.medicine_name,
        dosage=row.dosage,
        time_label=row.time_label,
        period=row.period,
        food_note=row.food_note,
        note=row.note,
        status=row.status,
    )


def _to_recent_activity(row: DoseActivityLog) -> RecentActivityItem:
    return RecentActivityItem(
        activity_id=row.activity_id,
        title=row.title,
        detail=row.detail,
        time_label=row.time_label,
        type=row.type,
    )


def _to_normalized_medicine(row: ReviewedMedicine) -> NormalizedMedicine:
    return NormalizedMedicine(
        medicine_id=row.medicine_id,
        name=row.name,
        dosage=row.dosage,
        frequency=row.frequency,
        timing=_deserialize_list(row.timing_json),
        food_note=row.food_note,
        duration_days=row.duration_days,
        status=row.status,
    )


def _persist_activity(
    session: Session,
    *,
    patient_id: str,
    title: str,
    detail: str,
    time_label: str,
    activity_type: str,
    dose_id: str | None = None,
) -> None:
    session.add(
        DoseActivityLog(
            activity_id=f"act_{uuid4().hex[:10]}",
            patient_id=patient_id,
            dose_id=dose_id,
            title=title,
            detail=detail,
            time_label=time_label,
            type=activity_type,
        )
    )


def _latest_document(session: Session, patient_id: str) -> UploadedDocument | None:
    return session.exec(
        select(UploadedDocument)
        .where(UploadedDocument.patient_id == patient_id)
        .order_by(UploadedDocument.created_at.desc(), UploadedDocument.id.desc())
    ).first()


def _get_document_or_raise(session: Session, document_id: str, patient_id: str) -> UploadedDocument:
    document = session.exec(
        select(UploadedDocument).where(
            UploadedDocument.id == document_id,
            UploadedDocument.patient_id == patient_id,
        )
    ).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    return document


def _resolve_document_for_review(session: Session, document_id: str | None, patient_id: str) -> UploadedDocument:
    if document_id:
        return _get_document_or_raise(session, document_id, patient_id)

    latest_document = _latest_document(session, patient_id)
    if latest_document is None:
        raise HTTPException(status_code=400, detail="No uploaded document found. Upload a document before review.")
    return latest_document


def _latest_review_id_for_document(session: Session, patient_id: str, document_id: str) -> str | None:
    latest_row = session.exec(
        select(ReviewedMedicine)
        .where(
            ReviewedMedicine.patient_id == patient_id,
            ReviewedMedicine.source_document_id == document_id,
        )
        .order_by(ReviewedMedicine.created_at.desc(), ReviewedMedicine.id.desc())
    ).first()
    return latest_row.review_id if latest_row else None


def _load_review_rows(
    session: Session,
    *,
    patient_id: str,
    document_id: str,
    review_id: str | None = None,
    include_removed: bool = True,
) -> tuple[list[ReviewedMedicine], str | None]:
    resolved_review_id = review_id or _latest_review_id_for_document(session, patient_id, document_id)
    if resolved_review_id is None:
        return [], None

    rows = session.exec(
        select(ReviewedMedicine)
        .where(
            ReviewedMedicine.patient_id == patient_id,
            ReviewedMedicine.source_document_id == document_id,
            ReviewedMedicine.review_id == resolved_review_id,
        )
        .order_by(ReviewedMedicine.id.asc())
    ).all()

    if not include_removed:
        rows = [row for row in rows if not row.removed]

    return rows, resolved_review_id


def _aggregate_review_warnings(rows: list[ReviewedMedicine]) -> list[str]:
    warnings: list[str] = []
    for row in rows:
        for warning in _deserialize_list(row.warnings_json):
            warnings.append(f"{row.name}: {warning}")
    return list(dict.fromkeys(warnings))[:5]


def _reviewed_rows_to_medicines(rows: list[ReviewedMedicine]) -> list[NormalizedMedicine]:
    return [_to_normalized_medicine(row) for row in rows if not row.removed]


def _latest_reviewed_medicines(session: Session, patient_id: str) -> list[NormalizedMedicine]:
    latest_document = _latest_document(session, patient_id)
    if latest_document is None:
        return deepcopy(DEFAULT_REVIEWED_MEDICINES)

    rows, _ = _load_review_rows(
        session,
        patient_id=patient_id,
        document_id=latest_document.id,
        include_removed=False,
    )
    return _reviewed_rows_to_medicines(rows) if rows else deepcopy(DEFAULT_REVIEWED_MEDICINES)


def _latest_schedule_id_for_patient(session: Session, patient_id: str) -> str | None:
    latest_row = session.exec(
        select(DoseScheduleItem)
        .where(DoseScheduleItem.patient_id == patient_id)
        .order_by(DoseScheduleItem.created_at.desc(), DoseScheduleItem.id.desc())
    ).first()
    return latest_row.schedule_id if latest_row else None


def _latest_schedule_id_for_document(session: Session, patient_id: str, document_id: str) -> str | None:
    latest_row = session.exec(
        select(DoseScheduleItem)
        .where(
            DoseScheduleItem.patient_id == patient_id,
            DoseScheduleItem.source_document_id == document_id,
        )
        .order_by(DoseScheduleItem.created_at.desc(), DoseScheduleItem.id.desc())
    ).first()
    return latest_row.schedule_id if latest_row else None


def _load_schedule_rows(
    session: Session,
    *,
    patient_id: str,
    schedule_id: str | None = None,
    document_id: str | None = None,
) -> tuple[list[DoseScheduleItem], str | None]:
    resolved_schedule_id = schedule_id
    if resolved_schedule_id is None and document_id is not None:
        resolved_schedule_id = _latest_schedule_id_for_document(session, patient_id, document_id)
    if resolved_schedule_id is None:
        resolved_schedule_id = _latest_schedule_id_for_patient(session, patient_id)
    if resolved_schedule_id is None:
        return [], None

    rows = session.exec(
        select(DoseScheduleItem)
        .where(
            DoseScheduleItem.patient_id == patient_id,
            DoseScheduleItem.schedule_id == resolved_schedule_id,
        )
        .order_by(DoseScheduleItem.id.asc())
    ).all()
    return rows, resolved_schedule_id


def _get_schedule_rows_or_raise(session: Session, schedule_id: str, patient_id: str) -> list[DoseScheduleItem]:
    rows = session.exec(
        select(DoseScheduleItem)
        .where(
            DoseScheduleItem.patient_id == patient_id,
            DoseScheduleItem.schedule_id == schedule_id,
        )
        .order_by(DoseScheduleItem.id.asc())
    ).all()
    if not rows:
        raise HTTPException(status_code=404, detail="Schedule not found.")
    return rows


def _build_schedule_response_from_rows(
    rows: list[DoseScheduleItem],
    schedule_id: str | None = None,
    document_id: str | None = None,
    review_id: str | None = None,
) -> GenerateScheduleResponse:
    doses = [_to_schedule_dose(row) for row in rows]
    first_row = rows[0] if rows else None
    return GenerateScheduleResponse(
        schedule_id=schedule_id or (first_row.schedule_id if first_row else f"sch_{uuid4().hex[:8]}"),
        document_id=document_id or (first_row.source_document_id if first_row else None),
        review_id=review_id or (first_row.review_id if first_row else None),
        groups=group_doses(doses),
        adherence_summary=summarize_adherence(doses),
    )


def _build_schedule_detail_response(rows: list[DoseScheduleItem]) -> ScheduleDetailResponse:
    base = _build_schedule_response_from_rows(rows)
    return ScheduleDetailResponse(
        schedule_id=base.schedule_id,
        document_id=base.document_id,
        review_id=base.review_id,
        groups=base.groups,
        adherence_summary=base.adherence_summary,
        patient_id=rows[0].patient_id,
    )


def _latest_recent_activity(session: Session, patient_id: str, limit: int = 5) -> list[RecentActivityItem]:
    recent_logs = session.exec(
        select(DoseActivityLog)
        .where(DoseActivityLog.patient_id == patient_id)
        .order_by(DoseActivityLog.created_at.desc(), DoseActivityLog.id.desc())
    ).all()
    return [_to_recent_activity(log) for log in recent_logs[:limit]]


def _build_patient_today_from_rows(session: Session, patient: Patient, rows: list[DoseScheduleItem]) -> PatientTodayResponse:
    doses = [_to_schedule_dose(row) for row in rows]
    adherence_summary = summarize_adherence(doses)
    caregiver_status = build_caregiver_status(adherence_summary)
    recent_activity = _latest_recent_activity(session, patient.id)

    if caregiver_status.active and not any(item.type == "caregiver" for item in recent_activity):
        recent_activity.insert(
            0,
            RecentActivityItem(
                activity_id=f"caregiver_{uuid4().hex[:8]}",
                title="Caregiver attention",
                detail=caregiver_status.reason,
                time_label="Now",
                type="caregiver",
            ),
        )

    return PatientTodayResponse(
        patient_id=patient.id,
        patient_name=patient.name,
        next_reminder=get_next_reminder(doses),
        adherence_summary=adherence_summary,
        caregiver_status=caregiver_status,
        recent_activity=recent_activity[:5],
        active_schedule=doses,
    )


def _ensure_default_schedule(session: Session, patient_id: str = DEFAULT_PATIENT_ID) -> None:
    rows, _ = _load_schedule_rows(session, patient_id=patient_id)
    if rows:
        return
    generate_schedule_response(session, payload=None, patient_id=patient_id, medicines_override=_latest_reviewed_medicines(session, patient_id))


def _resolve_document_for_schedule(
    session: Session,
    *,
    patient_id: str,
    document_id: str | None,
    review_id: str | None,
) -> UploadedDocument | None:
    if document_id:
        return _get_document_or_raise(session, document_id, patient_id)

    if review_id:
        review_row = session.exec(
            select(ReviewedMedicine)
            .where(
                ReviewedMedicine.patient_id == patient_id,
                ReviewedMedicine.review_id == review_id,
            )
            .order_by(ReviewedMedicine.created_at.desc(), ReviewedMedicine.id.desc())
        ).first()
        if review_row is None or not review_row.source_document_id:
            raise HTTPException(status_code=404, detail="Review not found for schedule generation.")
        return _get_document_or_raise(session, review_row.source_document_id, patient_id)

    return _latest_document(session, patient_id)


def save_uploaded_document(
    session: Session,
    *,
    filename: str,
    document_type: str,
    file_bytes: bytes,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> UploadResponse:
    try:
        validate_document_extension(filename)
    except UnsupportedDocumentTypeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    document_id = f"doc_{uuid4().hex[:8]}"
    uploads_dir = Path(settings.uploads_dir)
    uploads_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{document_id}_{Path(filename).name}"
    saved_path = uploads_dir / safe_name
    saved_path.write_bytes(file_bytes)

    try:
        ocr_result = extract_document_text(saved_path)
    except UnsupportedDocumentTypeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="OCR processing failed. Please try a clear PDF or image document.") from exc

    medicine_candidates = parse_medicine_candidates(ocr_result.detected_lines, ocr_result.extracted_text)
    warnings = list(ocr_result.warnings)
    if not medicine_candidates:
        warnings.append("No structured medicine candidates could be parsed. Please review the OCR text manually.")
    elif any(candidate.warnings for candidate in medicine_candidates):
        warnings.append("Some medicine candidates need manual review before schedule generation.")
    warnings = list(dict.fromkeys(warnings))

    document = UploadedDocument(
        id=document_id,
        patient_id=patient_id,
        filename=filename,
        document_type=document_type,
        file_path=str(saved_path),
        extracted_text=ocr_result.extracted_text,
        detected_lines_json=_serialize_list(ocr_result.detected_lines),
        warnings_json=_serialize_list(warnings),
        medicine_candidates_json=_serialize([candidate.__dict__ for candidate in medicine_candidates]),
    )
    session.add(document)
    _persist_activity(
        session,
        patient_id=patient_id,
        title="Document uploaded",
        detail=f"{filename} added for review",
        time_label="Now",
        activity_type="upload",
    )
    session.commit()

    return UploadResponse(
        document_id=document.id,
        filename=document.filename,
        document_type=document.document_type,
        extracted_text=document.extracted_text,
        detected_lines=_deserialize_list(document.detected_lines_json),
        warnings=_deserialize_list(document.warnings_json),
        medicine_candidates=_deserialize_candidates(document.medicine_candidates_json),
    )


def get_document_response(
    session: Session,
    document_id: str,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> DocumentDetailResponse:
    document = _get_document_or_raise(session, document_id, patient_id)
    return DocumentDetailResponse(
        document_id=document.id,
        patient_id=document.patient_id,
        filename=document.filename,
        document_type=document.document_type,
        extracted_text=document.extracted_text,
        detected_lines=_deserialize_list(document.detected_lines_json),
        warnings=_deserialize_list(document.warnings_json),
        medicine_candidates=_deserialize_candidates(document.medicine_candidates_json),
        latest_review_id=_latest_review_id_for_document(session, patient_id, document.id),
        latest_schedule_id=_latest_schedule_id_for_document(session, patient_id, document.id),
        created_at=document.created_at,
    )


def get_document_review_response(
    session: Session,
    document_id: str,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> DocumentReviewResponse:
    _get_document_or_raise(session, document_id, patient_id)
    rows, review_id = _load_review_rows(
        session,
        patient_id=patient_id,
        document_id=document_id,
        include_removed=False,
    )
    if not rows or review_id is None:
        raise HTTPException(status_code=404, detail="Review not found for this document.")

    return DocumentReviewResponse(
        document_id=document_id,
        review_id=review_id,
        medicines=_reviewed_rows_to_medicines(rows),
        warnings=_aggregate_review_warnings(rows),
    )


def get_document_schedule_response(
    session: Session,
    document_id: str,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> ScheduleDetailResponse:
    _get_document_or_raise(session, document_id, patient_id)
    rows, _ = _load_schedule_rows(session, patient_id=patient_id, document_id=document_id)
    if not rows:
        raise HTTPException(status_code=404, detail="Schedule not found for this document.")
    return _build_schedule_detail_response(rows)


def get_schedule_by_id_response(
    session: Session,
    schedule_id: str,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> ScheduleDetailResponse:
    rows = _get_schedule_rows_or_raise(session, schedule_id, patient_id)
    return _build_schedule_detail_response(rows)


def review_medicines_response(
    session: Session,
    payload: ReviewMedicinesRequest,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> ReviewMedicinesResponse:
    if not payload.medicines:
        raise HTTPException(status_code=400, detail="No reviewed medicines were provided.")

    document = _resolve_document_for_review(session, payload.document_id, patient_id)
    review_id = f"rev_{uuid4().hex[:8]}"
    normalized: list[NormalizedMedicine] = []
    warnings: list[str] = []

    for index, medicine in enumerate(payload.medicines):
        warning_values = [warning.value for warning in medicine.warnings]
        if warning_values:
            warnings.extend([f"{medicine.name}: {warning}" for warning in warning_values])

        status = "removed" if medicine.removed else "confirmed" if medicine.confirmed or medicine.edited else "review_needed"
        normalized_medicine = NormalizedMedicine(
            medicine_id=f"med_{index + 1:03d}",
            name=medicine.name,
            dosage=medicine.dosage or "500 mg",
            frequency=_normalize_frequency(medicine.frequency),
            timing=_normalize_timing(medicine.timing),
            food_note=medicine.food_timing.lower().replace(" ", "_") or "after_food",
            duration_days=_extract_duration_days(medicine.duration),
            status=status,
        )

        session.add(
            ReviewedMedicine(
                review_id=review_id,
                patient_id=patient_id,
                source_document_id=document.id,
                review_input_id=medicine.id,
                medicine_id=normalized_medicine.medicine_id,
                name=normalized_medicine.name,
                dosage=normalized_medicine.dosage,
                frequency=normalized_medicine.frequency,
                timing_json=_serialize_list(normalized_medicine.timing),
                food_note=normalized_medicine.food_note,
                duration_days=normalized_medicine.duration_days,
                confirmed=medicine.confirmed,
                removed=medicine.removed,
                edited=medicine.edited,
                warnings_json=_serialize_list(warning_values),
                status=normalized_medicine.status,
            )
        )

        if not medicine.removed:
            normalized.append(normalized_medicine)

    _persist_activity(
        session,
        patient_id=patient_id,
        title="Medicines reviewed",
        detail=f"Review saved for document {document.id}",
        time_label="Now",
        activity_type="review",
    )
    session.commit()

    return ReviewMedicinesResponse(
        review_id=review_id,
        document_id=document.id,
        medicines=normalized,
        warnings=list(dict.fromkeys(warnings))[:5],
    )


def generate_schedule_response(
    session: Session,
    payload: GenerateScheduleRequest | None = None,
    patient_id: str = DEFAULT_PATIENT_ID,
    medicines_override: list[NormalizedMedicine] | None = None,
) -> GenerateScheduleResponse:
    payload = payload or GenerateScheduleRequest()
    resolved_document_id: str | None = payload.document_id
    resolved_review_id: str | None = payload.review_id

    if medicines_override is not None:
        normalized_medicines = medicines_override
    else:
        document = _resolve_document_for_schedule(
            session,
            patient_id=patient_id,
            document_id=payload.document_id,
            review_id=payload.review_id,
        )
        if document is None:
            raise HTTPException(status_code=400, detail="No uploaded document found for schedule generation.")

        resolved_document_id = document.id
        review_rows, resolved_review_id = _load_review_rows(
            session,
            patient_id=patient_id,
            document_id=document.id,
            review_id=payload.review_id,
            include_removed=False,
        )
        if not review_rows:
            raise HTTPException(
                status_code=400,
                detail="No reviewed medicines found for this document. Submit /api/medicines/review first.",
            )
        normalized_medicines = _reviewed_rows_to_medicines(review_rows)

    schedule_id = f"sch_{uuid4().hex[:8]}"
    doses = build_doses_from_medicines(normalized_medicines)

    for dose in doses:
        stored_dose_id = f"{schedule_id}-{dose.dose_id}"
        session.add(
            DoseScheduleItem(
                dose_id=stored_dose_id,
                patient_id=patient_id,
                schedule_id=schedule_id,
                review_id=resolved_review_id,
                source_document_id=resolved_document_id,
                medicine_id=dose.dose_id.split("-dose-")[0],
                medicine_name=dose.medicine_name,
                dosage=dose.dosage,
                time_label=dose.time_label,
                period=dose.period.value,
                food_note=dose.food_note,
                note=dose.note,
                status=dose.status.value,
                updated_at=datetime.utcnow(),
            )
        )

    _persist_activity(
        session,
        patient_id=patient_id,
        title="Schedule ready",
        detail=f"Schedule {schedule_id} generated for {resolved_document_id or 'current review'}",
        time_label="Now",
        activity_type="schedule",
    )
    session.commit()

    rows = _get_schedule_rows_or_raise(session, schedule_id, patient_id)
    return _build_schedule_response_from_rows(rows, schedule_id, resolved_document_id, resolved_review_id)


def get_patient_today_response(session: Session, patient_id: str = DEFAULT_PATIENT_ID) -> PatientTodayResponse:
    patient = session.exec(select(Patient).where(Patient.id == patient_id)).first()
    if patient is None:
        patient = Patient(id=patient_id, name="Lakshmi Devi", preferred_language="en")
        session.add(patient)
        session.commit()
        session.refresh(patient)

    _ensure_default_schedule(session, patient_id)
    rows, _ = _load_schedule_rows(session, patient_id=patient_id)
    return _build_patient_today_from_rows(session, patient, rows)


def update_dose_status_response(
    session: Session,
    *,
    dose_id: str,
    status: DoseStatus,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> DoseStatusUpdateResponse:
    _ensure_default_schedule(session, patient_id)
    dose_row = session.exec(select(DoseScheduleItem).where(DoseScheduleItem.dose_id == dose_id)).first()
    if dose_row is None:
        raise HTTPException(status_code=404, detail="Dose not found.")

    dose_row.status = status.value
    dose_row.updated_at = datetime.utcnow()
    _persist_activity(
        session,
        patient_id=patient_id,
        dose_id=dose_row.dose_id,
        title=f"{dose_row.medicine_name} {status.value}",
        detail=f"{dose_row.time_label} · {dose_row.food_note}",
        time_label=dose_row.time_label,
        activity_type=status.value,
    )
    session.add(dose_row)
    session.commit()

    schedule_rows = _get_schedule_rows_or_raise(session, dose_row.schedule_id, patient_id)
    schedule_doses = [_to_schedule_dose(row) for row in schedule_rows]
    adherence_summary = summarize_adherence(schedule_doses)
    caregiver_status = build_caregiver_status(adherence_summary)
    next_reminder = get_next_reminder(schedule_doses)

    if caregiver_status.active:
        _persist_activity(
            session,
            patient_id=patient_id,
            title="Caregiver attention",
            detail=caregiver_status.reason,
            time_label="Now",
            activity_type="caregiver",
            dose_id=dose_row.dose_id,
        )
        session.commit()

    recent_activity = _latest_recent_activity(session, patient_id)
    updated_dose = next((_to_schedule_dose(row) for row in schedule_rows if row.dose_id == dose_row.dose_id), _to_schedule_dose(schedule_rows[0]))

    return DoseStatusUpdateResponse(
        dose_id=updated_dose.dose_id,
        updated_dose=updated_dose,
        adherence_summary=adherence_summary,
        caregiver_status=caregiver_status,
        next_reminder=next_reminder,
        recent_activity=recent_activity,
        groups=_build_schedule_response_from_rows(schedule_rows).groups,
    )

