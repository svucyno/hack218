from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel


class UploadedDocument(SQLModel, table=True):
    id: str = Field(primary_key=True)
    patient_id: str = Field(index=True, foreign_key="patient.id")
    filename: str
    document_type: str
    file_path: Optional[str] = None
    extracted_text: str = Field(default="", sa_column=Column(Text, nullable=False))
    detected_lines_json: str = Field(default="[]", sa_column=Column(Text, nullable=False))
    warnings_json: str = Field(default="[]", sa_column=Column(Text, nullable=False))
    medicine_candidates_json: str = Field(default="[]", sa_column=Column(Text, nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
