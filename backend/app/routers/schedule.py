from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.schedule import GenerateScheduleRequest, GenerateScheduleResponse
from backend.app.services.persistence import generate_schedule_response


router = APIRouter(tags=["schedule"])


@router.post("/schedule/generate", response_model=GenerateScheduleResponse)
def generate_schedule(
    payload: GenerateScheduleRequest,
    session: Session = Depends(get_session),
) -> GenerateScheduleResponse:
    return generate_schedule_response(session, payload.medicines)
