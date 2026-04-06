from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel


class ReviewedMedicine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    review_id: str = Field(index=True)
    patient_id: str = Field(index=True, foreign_key="patient.id")
    source_document_id: Optional[str] = Field(default=None, foreign_key="uploadeddocument.id")
    review_input_id: Optional[str] = None
    medicine_id: str = Field(index=True)
    name: str
    dosage: str
    frequency: str
    timing_json: str = Field(default="[]", sa_column=Column(Text, nullable=False))
    food_note: str
    duration_days: Optional[int] = None
    confirmed: bool = Field(default=False)
    removed: bool = Field(default=False)
    edited: bool = Field(default=False)
    warnings_json: str = Field(default="[]", sa_column=Column(Text, nullable=False))
    status: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
