from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.medication import ReviewMedicinesRequest, ReviewMedicinesResponse
from backend.app.services.persistence import review_medicines_response


router = APIRouter(tags=["review"])


@router.post("/medicines/review", response_model=ReviewMedicinesResponse)
def review_medicines(
    payload: ReviewMedicinesRequest,
    session: Session = Depends(get_session),
) -> ReviewMedicinesResponse:
    return review_medicines_response(session, payload.medicines)
