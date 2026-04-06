from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.retrieval import ScheduleDetailResponse
from backend.app.schemas.schedule import GenerateScheduleRequest, GenerateScheduleResponse
from backend.app.services.persistence import generate_schedule_response, get_schedule_by_id_response


router = APIRouter(tags=["schedule"])


@router.post("/schedule/generate", response_model=GenerateScheduleResponse)
def generate_schedule(
    payload: GenerateScheduleRequest,
    session: Session = Depends(get_session),
) -> GenerateScheduleResponse:
    return generate_schedule_response(session, payload)


@router.get("/schedules/{schedule_id}", response_model=ScheduleDetailResponse)
def get_schedule(schedule_id: str, session: Session = Depends(get_session)) -> ScheduleDetailResponse:
    return get_schedule_by_id_response(session, schedule_id)
