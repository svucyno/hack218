from enum import Enum

from pydantic import BaseModel

from backend.app.schemas.medication import NormalizedMedicine


class DoseStatus(str, Enum):
    pending = "pending"
    taken = "taken"
    missed = "missed"
    unconfirmed = "unconfirmed"


class ScheduleGroupName(str, Enum):
    morning = "morning"
    afternoon = "afternoon"
    night = "night"


class ScheduleDose(BaseModel):
    dose_id: str
    medicine_name: str
    dosage: str
    time_label: str
    period: ScheduleGroupName
    food_note: str
    note: str
    status: DoseStatus


class ScheduleGroups(BaseModel):
    morning: list[ScheduleDose]
    afternoon: list[ScheduleDose]
    night: list[ScheduleDose]


class AdherenceSummary(BaseModel):
    total_doses: int
    taken: int
    missed: int
    unconfirmed: int
    pending: int


class GenerateScheduleRequest(BaseModel):
    document_id: str | None = None
    review_id: str | None = None
    medicines: list[NormalizedMedicine] | None = None


class GenerateScheduleResponse(BaseModel):
    schedule_id: str
    document_id: str | None = None
    review_id: str | None = None
    groups: ScheduleGroups
    adherence_summary: AdherenceSummary
