from enum import Enum

from pydantic import BaseModel

from backend.app.schemas.schedule import AdherenceSummary, ScheduleDose


class CaregiverAlertLevel(str, Enum):
    watch = "watch"
    alert = "alert"


class CaregiverStatus(BaseModel):
    active: bool
    level: CaregiverAlertLevel
    reason: str


class RecentActivityItem(BaseModel):
    activity_id: str
    title: str
    detail: str
    time_label: str
    type: str


class PatientTodayResponse(BaseModel):
    patient_id: str
    patient_name: str
    next_reminder: ScheduleDose | None
    adherence_summary: AdherenceSummary
    caregiver_status: CaregiverStatus
    recent_activity: list[RecentActivityItem]
    active_schedule: list[ScheduleDose]
