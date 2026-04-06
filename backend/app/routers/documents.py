from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.retrieval import DocumentDetailResponse, DocumentReviewResponse, ScheduleDetailResponse
from backend.app.services.persistence import get_document_response, get_document_review_response, get_document_schedule_response


router = APIRouter(tags=["documents"])


@router.get("/documents/{document_id}", response_model=DocumentDetailResponse)
def get_document(document_id: str, session: Session = Depends(get_session)) -> DocumentDetailResponse:
    return get_document_response(session, document_id)


@router.get("/documents/{document_id}/review", response_model=DocumentReviewResponse)
def get_document_review(document_id: str, session: Session = Depends(get_session)) -> DocumentReviewResponse:
    return get_document_review_response(session, document_id)


@router.get("/documents/{document_id}/schedule", response_model=ScheduleDetailResponse)
def get_document_schedule(document_id: str, session: Session = Depends(get_session)) -> ScheduleDetailResponse:
    return get_document_schedule_response(session, document_id)
