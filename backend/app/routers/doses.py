from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.dose import DoseStatusUpdateRequest, DoseStatusUpdateResponse
from backend.app.services.persistence import update_dose_status_response


router = APIRouter(tags=["doses"])


@router.post("/doses/{dose_id}/status", response_model=DoseStatusUpdateResponse)
def update_dose_status(
    dose_id: str,
    payload: DoseStatusUpdateRequest,
    session: Session = Depends(get_session),
) -> DoseStatusUpdateResponse:
    return update_dose_status_response(session, dose_id=dose_id, status=payload.status)
