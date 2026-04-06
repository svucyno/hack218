from pydantic import BaseModel


class UploadResponse(BaseModel):
    document_id: str
    filename: str
    document_type: str
    extracted_text: str
    detected_lines: list[str]
    warnings: list[str]
