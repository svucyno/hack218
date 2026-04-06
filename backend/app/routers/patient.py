from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.patient import PatientTodayResponse
from backend.app.services.persistence import get_patient_today_response


router = APIRouter(tags=["patient"])


@router.get("/patient/today", response_model=PatientTodayResponse)
def get_patient_today(session: Session = Depends(get_session)) -> PatientTodayResponse:
    return get_patient_today_response(session)
