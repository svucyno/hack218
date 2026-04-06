from __future__ import annotations

from copy import deepcopy
from datetime import datetime
import json
from pathlib import Path
import re
from typing import Iterable
from uuid import uuid4

from sqlmodel import Session, delete, select

from backend.app.core.config import settings
from backend.app.db.init_db import DEFAULT_PATIENT_ID
from backend.app.models import DoseActivityLog, DoseScheduleItem, Patient, ReviewedMedicine, UploadedDocument
from backend.app.schemas.dose import DoseStatusUpdateResponse
from backend.app.schemas.medication import NormalizedMedicine, ReviewMedicineInput, ReviewMedicinesResponse
from backend.app.schemas.patient import PatientTodayResponse, RecentActivityItem
from backend.app.schemas.schedule import DoseStatus, GenerateScheduleResponse, ScheduleDose
from backend.app.schemas.upload import UploadResponse
from backend.app.services.schedule_service import build_caregiver_status, build_doses_from_medicines, get_next_reminder, group_doses, summarize_adherence


MOCK_EXTRACTED_TEXT = """
Discharge summary:
1. Pantoprazole 40 mg once daily before breakfast for 7 days
2. Amoxicillin 500 mg morning and night after food for 5 days
3. Aspirin 75 mg after lunch continue daily
4. Metformin one tablet after dinner timing unclear
""".strip()

MOCK_DETECTED_LINES = [
    "Pantoprazole 40 mg once daily before breakfast for 7 days",
    "Amoxicillin 500 mg twice daily after food for 5 days",
    "Aspirin 75 mg after lunch continue daily",
    "Metformin one tablet after dinner timing unclear",
]

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


def _serialize_list(values: Iterable[str]) -> str:
    return json.dumps(list(values))


def _deserialize_list(value: str) -> list[str]:
    return list(json.loads(value)) if value else []


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


def _latest_reviewed_medicines(session: Session, patient_id: str) -> list[NormalizedMedicine]:
    review_rows = session.exec(
        select(ReviewedMedicine)
        .where(ReviewedMedicine.patient_id == patient_id)
        .order_by(ReviewedMedicine.created_at.desc(), ReviewedMedicine.id.desc())
    ).all()
    if not review_rows:
        return deepcopy(DEFAULT_REVIEWED_MEDICINES)

    latest_review_id = review_rows[0].review_id
    medicines = session.exec(
        select(ReviewedMedicine)
        .where(ReviewedMedicine.patient_id == patient_id, ReviewedMedicine.review_id == latest_review_id)
        .order_by(ReviewedMedicine.id.asc())
    ).all()
    return [
        NormalizedMedicine(
            medicine_id=medicine.medicine_id,
            name=medicine.name,
            dosage=medicine.dosage,
            frequency=medicine.frequency,
            timing=_deserialize_list(medicine.timing_json),
            food_note=medicine.food_note,
            duration_days=medicine.duration_days,
            status=medicine.status,
        )
        for medicine in medicines
    ]


def _load_schedule_rows(session: Session, patient_id: str) -> list[DoseScheduleItem]:
    return session.exec(
        select(DoseScheduleItem)
        .where(DoseScheduleItem.patient_id == patient_id)
        .order_by(DoseScheduleItem.id.asc())
    ).all()


def _build_schedule_response_from_rows(rows: list[DoseScheduleItem], schedule_id: str | None = None) -> GenerateScheduleResponse:
    doses = [_to_schedule_dose(row) for row in rows]
    return GenerateScheduleResponse(
        schedule_id=schedule_id or (rows[0].schedule_id if rows else f"sch_{uuid4().hex[:8]}"),
        groups=group_doses(doses),
        adherence_summary=summarize_adherence(doses),
    )


def _build_patient_today_from_rows(session: Session, patient: Patient, rows: list[DoseScheduleItem]) -> PatientTodayResponse:
    doses = [_to_schedule_dose(row) for row in rows]
    adherence_summary = summarize_adherence(doses)
    caregiver_status = build_caregiver_status(adherence_summary)

    recent_logs = session.exec(
        select(DoseActivityLog)
        .where(DoseActivityLog.patient_id == patient.id)
        .order_by(DoseActivityLog.created_at.desc(), DoseActivityLog.id.desc())
    ).all()
    recent_activity = [_to_recent_activity(log) for log in recent_logs[:5]]

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
    if _load_schedule_rows(session, patient_id):
        return
    generate_schedule_response(session, medicines=_latest_reviewed_medicines(session, patient_id), patient_id=patient_id)


def save_uploaded_document(
    session: Session,
    *,
    filename: str,
    document_type: str,
    file_bytes: bytes,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> UploadResponse:
    document_id = f"doc_{uuid4().hex[:8]}"
    uploads_dir = Path(settings.uploads_dir)
    uploads_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{document_id}_{Path(filename).name}"
    saved_path = uploads_dir / safe_name
    saved_path.write_bytes(file_bytes)

    document = UploadedDocument(
        id=document_id,
        patient_id=patient_id,
        filename=filename,
        document_type=document_type,
        file_path=str(saved_path),
        extracted_text=MOCK_EXTRACTED_TEXT,
        detected_lines_json=_serialize_list(MOCK_DETECTED_LINES),
        warnings_json=_serialize_list(["One line may need manual review"]),
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
    )


def review_medicines_response(
    session: Session,
    medicines: list[ReviewMedicineInput],
    patient_id: str = DEFAULT_PATIENT_ID,
) -> ReviewMedicinesResponse:
    normalized: list[NormalizedMedicine] = []
    warnings: list[str] = []
    latest_document = session.exec(
        select(UploadedDocument)
        .where(UploadedDocument.patient_id == patient_id)
        .order_by(UploadedDocument.created_at.desc())
    ).first()
    review_id = f"rev_{uuid4().hex[:8]}"

    for index, medicine in enumerate(medicines):
        if medicine.removed:
            continue

        if medicine.warnings:
            warnings.extend([f"{medicine.name}: {warning.value}" for warning in medicine.warnings])

        normalized_medicine = NormalizedMedicine(
            medicine_id=f"med_{index + 1:03d}",
            name=medicine.name,
            dosage=medicine.dosage or "500 mg",
            frequency=_normalize_frequency(medicine.frequency),
            timing=_normalize_timing(medicine.timing),
            food_note=medicine.food_timing.lower().replace(" ", "_"),
            duration_days=_extract_duration_days(medicine.duration),
            status="confirmed" if medicine.confirmed or medicine.edited else "review_needed",
        )
        normalized.append(normalized_medicine)
        session.add(
            ReviewedMedicine(
                review_id=review_id,
                patient_id=patient_id,
                source_document_id=latest_document.id if latest_document else None,
                medicine_id=normalized_medicine.medicine_id,
                name=normalized_medicine.name,
                dosage=normalized_medicine.dosage,
                frequency=normalized_medicine.frequency,
                timing_json=_serialize_list(normalized_medicine.timing),
                food_note=normalized_medicine.food_note,
                duration_days=normalized_medicine.duration_days,
                status=normalized_medicine.status,
            )
        )

    if not normalized:
        normalized = deepcopy(DEFAULT_REVIEWED_MEDICINES)
        for medicine in normalized:
            session.add(
                ReviewedMedicine(
                    review_id=review_id,
                    patient_id=patient_id,
                    source_document_id=latest_document.id if latest_document else None,
                    medicine_id=medicine.medicine_id,
                    name=medicine.name,
                    dosage=medicine.dosage,
                    frequency=medicine.frequency,
                    timing_json=_serialize_list(medicine.timing),
                    food_note=medicine.food_note,
                    duration_days=medicine.duration_days,
                    status=medicine.status,
                )
            )

    _persist_activity(
        session,
        patient_id=patient_id,
        title="Medicines reviewed",
        detail=f"{len(normalized)} medicines prepared for schedule generation",
        time_label="Now",
        activity_type="review",
    )
    session.commit()

    return ReviewMedicinesResponse(review_id=review_id, medicines=normalized, warnings=warnings[:3])


def generate_schedule_response(
    session: Session,
    medicines: list[NormalizedMedicine] | None = None,
    patient_id: str = DEFAULT_PATIENT_ID,
) -> GenerateScheduleResponse:
    normalized_medicines = medicines or _latest_reviewed_medicines(session, patient_id)
    schedule_id = f"sch_{uuid4().hex[:8]}"
    doses = build_doses_from_medicines(normalized_medicines)

    session.exec(delete(DoseScheduleItem).where(DoseScheduleItem.patient_id == patient_id))
    for dose in doses:
        session.add(
            DoseScheduleItem(
                dose_id=dose.dose_id,
                patient_id=patient_id,
                schedule_id=schedule_id,
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
        detail=f"{len(doses)} doses generated for today",
        time_label="Now",
        activity_type="schedule",
    )
    session.commit()

    rows = _load_schedule_rows(session, patient_id)
    return _build_schedule_response_from_rows(rows, schedule_id)


def get_patient_today_response(session: Session, patient_id: str = DEFAULT_PATIENT_ID) -> PatientTodayResponse:
    patient = session.exec(select(Patient).where(Patient.id == patient_id)).first()
    if patient is None:
        patient = Patient(id=patient_id, name="Lakshmi Devi", preferred_language="en")
        session.add(patient)
        session.commit()
        session.refresh(patient)

    _ensure_default_schedule(session, patient_id)
    rows = _load_schedule_rows(session, patient_id)
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
        dose_row = session.exec(
            select(DoseScheduleItem).where(DoseScheduleItem.patient_id == patient_id).order_by(DoseScheduleItem.id.asc())
        ).first()
    if dose_row is None:
        raise ValueError("No dose available")

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

    patient_today = get_patient_today_response(session, patient_id)
    if patient_today.caregiver_status.active:
        _persist_activity(
            session,
            patient_id=patient_id,
            title="Caregiver attention",
            detail=patient_today.caregiver_status.reason,
            time_label="Now",
            activity_type="caregiver",
            dose_id=dose_row.dose_id,
        )
        session.commit()
        patient_today = get_patient_today_response(session, patient_id)

    rows = _load_schedule_rows(session, patient_id)
    updated_dose = next((_to_schedule_dose(row) for row in rows if row.dose_id == dose_row.dose_id), _to_schedule_dose(rows[0]))

    return DoseStatusUpdateResponse(
        dose_id=updated_dose.dose_id,
        updated_dose=updated_dose,
        adherence_summary=patient_today.adherence_summary,
        caregiver_status=patient_today.caregiver_status,
        next_reminder=patient_today.next_reminder,
        recent_activity=patient_today.recent_activity,
        groups=_build_schedule_response_from_rows(rows).groups,
    )
