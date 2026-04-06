from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class DoseScheduleItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    dose_id: str = Field(index=True, unique=True)
    patient_id: str = Field(index=True, foreign_key="patient.id")
    schedule_id: str = Field(index=True)
    review_id: Optional[str] = Field(default=None, index=True)
    source_document_id: Optional[str] = Field(default=None, index=True)
    medicine_id: Optional[str] = None
    medicine_name: str
    dosage: str
    time_label: str
    period: str
    food_note: str
    note: str
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
