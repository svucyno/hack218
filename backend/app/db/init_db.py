from pathlib import Path

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, select

from backend.app.core.config import settings
from backend.app.db.session import engine
from backend.app.models import CaregiverContact, Patient

DEFAULT_PATIENT_ID = "patient_001"


def _ensure_column(table_name: str, column_name: str, definition_sql: str) -> None:
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())
    if table_name not in table_names:
        return

    columns = {column["name"] for column in inspector.get_columns(table_name)}
    if column_name in columns:
        return

    with engine.begin() as connection:
        connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition_sql}"))


def _ensure_sqlite_compat_columns() -> None:
    _ensure_column("uploadeddocument", "medicine_candidates_json", "TEXT NOT NULL DEFAULT '[]'")
    _ensure_column("reviewedmedicine", "review_input_id", "TEXT")
    _ensure_column("reviewedmedicine", "confirmed", "BOOLEAN NOT NULL DEFAULT 0")
    _ensure_column("reviewedmedicine", "removed", "BOOLEAN NOT NULL DEFAULT 0")
    _ensure_column("reviewedmedicine", "edited", "BOOLEAN NOT NULL DEFAULT 0")
    _ensure_column("reviewedmedicine", "warnings_json", "TEXT NOT NULL DEFAULT '[]'")
    _ensure_column("dosescheduleitem", "review_id", "TEXT")
    _ensure_column("dosescheduleitem", "source_document_id", "TEXT")


def init_db() -> None:
    Path(settings.uploads_dir).mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.create_all(engine)
    _ensure_sqlite_compat_columns()

    with Session(engine) as session:
        patient = session.exec(select(Patient).where(Patient.id == DEFAULT_PATIENT_ID)).first()
        if patient is None:
            patient = Patient(id=DEFAULT_PATIENT_ID, name="Lakshmi Devi", preferred_language="en")
            session.add(patient)

        caregiver = session.exec(
            select(CaregiverContact).where(CaregiverContact.patient_id == DEFAULT_PATIENT_ID)
        ).first()
        if caregiver is None:
            session.add(
                CaregiverContact(
                    id="caregiver_001",
                    patient_id=DEFAULT_PATIENT_ID,
                    name="Anita Devi",
                    relationship="Daughter",
                    phone="+91 98765 43210",
                )
            )

        session.commit()
