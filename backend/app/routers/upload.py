from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlmodel import Session

from backend.app.db import get_session
from backend.app.schemas.upload import UploadResponse
from backend.app.services.persistence import save_uploaded_document


router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str | None = Form(default=None),
    session: Session = Depends(get_session),
) -> UploadResponse:
    return save_uploaded_document(
        session,
        filename=file.filename or "sample.pdf",
        document_type=document_type or "discharge_summary",
        file_bytes=await file.read(),
    )
