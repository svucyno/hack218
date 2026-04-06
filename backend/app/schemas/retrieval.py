from datetime import datetime

from pydantic import BaseModel

from backend.app.schemas.medication import NormalizedMedicine
from backend.app.schemas.schedule import GenerateScheduleResponse
from backend.app.schemas.upload import MedicineCandidate


class DocumentDetailResponse(BaseModel):
    document_id: str
    patient_id: str
    filename: str
    document_type: str
    extracted_text: str
    detected_lines: list[str]
    warnings: list[str]
    medicine_candidates: list[MedicineCandidate]
    latest_review_id: str | None
    latest_schedule_id: str | None
    created_at: datetime


class DocumentReviewResponse(BaseModel):
    document_id: str
    review_id: str
    medicines: list[NormalizedMedicine]
    warnings: list[str]


class ScheduleDetailResponse(GenerateScheduleResponse):
    patient_id: str
