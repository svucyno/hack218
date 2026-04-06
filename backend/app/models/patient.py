from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Patient(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    preferred_language: str = Field(default="en")
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class CaregiverContact(SQLModel, table=True):
    id: str = Field(primary_key=True)
    patient_id: str = Field(index=True, foreign_key="patient.id")
    name: str
    relationship: str = Field(default="Family")
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
