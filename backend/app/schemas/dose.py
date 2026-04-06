from pydantic import BaseModel

from backend.app.schemas.patient import CaregiverStatus, RecentActivityItem
from backend.app.schemas.schedule import AdherenceSummary, DoseStatus, ScheduleDose, ScheduleGroups


class DoseStatusUpdateRequest(BaseModel):
    status: DoseStatus


class DoseStatusUpdateResponse(BaseModel):
    dose_id: str
    updated_dose: ScheduleDose
    adherence_summary: AdherenceSummary
    caregiver_status: CaregiverStatus
    next_reminder: ScheduleDose | None
    recent_activity: list[RecentActivityItem]
    groups: ScheduleGroups
