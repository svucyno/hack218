from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class DoseActivityLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    activity_id: str = Field(index=True, unique=True)
    patient_id: str = Field(index=True, foreign_key="patient.id")
    dose_id: Optional[str] = Field(default=None, index=True)
    title: str
    detail: str
    time_label: str
    type: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
