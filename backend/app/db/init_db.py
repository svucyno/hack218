from pathlib import Path

from sqlmodel import Session, SQLModel, select

from backend.app.core.config import settings
from backend.app.db.session import engine
from backend.app.models import CaregiverContact, Patient

DEFAULT_PATIENT_ID = "patient_001"


def init_db() -> None:
    Path(settings.uploads_dir).mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.create_all(engine)

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
