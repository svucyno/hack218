from pydantic import BaseModel


class MedicineCandidate(BaseModel):
    candidate_id: str
    raw_line: str
    name: str
    dosage: str
    frequency: str
    timing: str
    duration: str
    food_timing: str
    warnings: list[str]
    clarity: str


class UploadResponse(BaseModel):
    document_id: str
    filename: str
    document_type: str
    extracted_text: str
    detected_lines: list[str]
    warnings: list[str]
    medicine_candidates: list[MedicineCandidate] = []
