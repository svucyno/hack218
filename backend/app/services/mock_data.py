from copy import deepcopy
import re

from backend.app.schemas.dose import DoseStatusUpdateResponse
from backend.app.schemas.medication import NormalizedMedicine, ReviewMedicineInput, ReviewMedicinesResponse
from backend.app.schemas.patient import PatientTodayResponse
from backend.app.schemas.schedule import DoseStatus, GenerateScheduleResponse, ScheduleDose
from backend.app.schemas.upload import UploadResponse
from backend.app.services.schedule_service import build_caregiver_status, build_doses_from_medicines, build_recent_activity, get_next_reminder, group_doses, summarize_adherence


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


def build_upload_response(filename: str, document_type: str) -> UploadResponse:
    return UploadResponse(
        document_id="doc_001",
        filename=filename,
        document_type=document_type,
        extracted_text=MOCK_EXTRACTED_TEXT,
        detected_lines=MOCK_DETECTED_LINES,
        warnings=["One line may need manual review"],
    )


def build_review_response(medicines: list[ReviewMedicineInput]) -> ReviewMedicinesResponse:
    normalized: list[NormalizedMedicine] = []
    warnings: list[str] = []

    for index, medicine in enumerate(medicines):
        if medicine.removed:
            continue

        if medicine.warnings:
            warnings.extend([f"{medicine.name}: {warning.value}" for warning in medicine.warnings])

        normalized.append(
            NormalizedMedicine(
                medicine_id=f"med_{index + 1:03d}",
                name=medicine.name,
                dosage=medicine.dosage or "500 mg",
                frequency=_normalize_frequency(medicine.frequency),
                timing=_normalize_timing(medicine.timing),
                food_note=medicine.food_timing.lower().replace(" ", "_"),
                duration_days=_extract_duration_days(medicine.duration),
                status="confirmed" if medicine.confirmed or medicine.edited else "review_needed",
            )
        )

    if not normalized:
        normalized = deepcopy(DEFAULT_REVIEWED_MEDICINES)

    return ReviewMedicinesResponse(
        review_id="rev_001",
        medicines=normalized,
        warnings=warnings[:3],
    )


def build_schedule_response(medicines: list[NormalizedMedicine] | None = None) -> GenerateScheduleResponse:
    normalized_medicines = medicines or deepcopy(DEFAULT_REVIEWED_MEDICINES)
    doses = build_doses_from_medicines(normalized_medicines)
    groups = group_doses(doses)
    summary = summarize_adherence(doses)

    return GenerateScheduleResponse(
        schedule_id="sch_001",
        groups=groups,
        adherence_summary=summary,
    )


def _base_schedule_doses() -> list[ScheduleDose]:
    schedule = build_schedule_response()
    doses = schedule.groups.morning + schedule.groups.afternoon + schedule.groups.night
    if len(doses) > 0:
        doses[0].status = DoseStatus.taken
    if len(doses) > 1:
        doses[1].status = DoseStatus.pending
    if len(doses) > 2:
        doses[2].status = DoseStatus.unconfirmed
    if len(doses) > 3:
        doses[3].status = DoseStatus.unconfirmed
    return doses


def build_patient_today_response() -> PatientTodayResponse:
    doses = _base_schedule_doses()
    summary = summarize_adherence(doses)
    caregiver_status = build_caregiver_status(summary)

    return PatientTodayResponse(
        patient_id="patient_001",
        patient_name="Lakshmi Devi",
        next_reminder=get_next_reminder(doses),
        adherence_summary=summary,
        caregiver_status=caregiver_status,
        recent_activity=build_recent_activity(doses, caregiver_status),
        active_schedule=doses,
    )


def build_dose_status_update_response(dose_id: str, status: DoseStatus) -> DoseStatusUpdateResponse:
    doses = _base_schedule_doses()

    updated_dose = next((dose for dose in doses if dose.dose_id == dose_id), None)
    if updated_dose is None and doses:
        updated_dose = doses[0]
    if updated_dose is None:
        raise ValueError("No mocked dose available")

    updated_dose.status = status
    summary = summarize_adherence(doses)
    caregiver_status = build_caregiver_status(summary)

    return DoseStatusUpdateResponse(
        dose_id=updated_dose.dose_id,
        updated_dose=updated_dose,
        adherence_summary=summary,
        caregiver_status=caregiver_status,
        next_reminder=get_next_reminder(doses),
        recent_activity=build_recent_activity(doses, caregiver_status),
        groups=group_doses(doses),
    )
