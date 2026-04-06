from collections import defaultdict

from backend.app.schemas.medication import NormalizedMedicine
from backend.app.schemas.patient import CaregiverAlertLevel, CaregiverStatus, RecentActivityItem
from backend.app.schemas.schedule import AdherenceSummary, DoseStatus, ScheduleDose, ScheduleGroupName, ScheduleGroups


def infer_period(time_label: str) -> ScheduleGroupName:
    upper = time_label.upper()
    if "PM" in upper:
        if upper.startswith(("1", "2", "3", "4", "5")):
            return ScheduleGroupName.afternoon
        return ScheduleGroupName.night
    return ScheduleGroupName.morning


def build_doses_from_medicines(medicines: list[NormalizedMedicine]) -> list[ScheduleDose]:
    doses: list[ScheduleDose] = []

    for medicine_index, medicine in enumerate(medicines):
        for timing_index, time_label in enumerate(medicine.timing):
            doses.append(
                ScheduleDose(
                    dose_id=f"{medicine.medicine_id}-dose-{timing_index + 1}",
                    medicine_name=medicine.name,
                    dosage=medicine.dosage or "1 tablet",
                    time_label=time_label,
                    period=infer_period(time_label),
                    food_note=medicine.food_note,
                    note=f"{medicine.frequency} for {medicine.duration_days or 'ongoing'} days",
                    status=DoseStatus.pending if medicine_index == 0 and timing_index == 0 else DoseStatus.unconfirmed,
                )
            )

    return doses


def group_doses(doses: list[ScheduleDose]) -> ScheduleGroups:
    grouped: dict[ScheduleGroupName, list[ScheduleDose]] = defaultdict(list)
    for dose in doses:
        grouped[dose.period].append(dose)

    return ScheduleGroups(
        morning=grouped[ScheduleGroupName.morning],
        afternoon=grouped[ScheduleGroupName.afternoon],
        night=grouped[ScheduleGroupName.night],
    )


def summarize_adherence(doses: list[ScheduleDose]) -> AdherenceSummary:
    return AdherenceSummary(
        total_doses=len(doses),
        taken=sum(1 for dose in doses if dose.status == DoseStatus.taken),
        missed=sum(1 for dose in doses if dose.status == DoseStatus.missed),
        unconfirmed=sum(1 for dose in doses if dose.status == DoseStatus.unconfirmed),
        pending=sum(1 for dose in doses if dose.status == DoseStatus.pending),
    )


def build_caregiver_status(summary: AdherenceSummary) -> CaregiverStatus:
    if summary.missed >= 2:
        return CaregiverStatus(
            active=True,
            level=CaregiverAlertLevel.alert,
            reason="Two or more doses were missed today. Caregiver follow-up may be needed.",
        )

    if summary.unconfirmed >= 2:
        return CaregiverStatus(
            active=True,
            level=CaregiverAlertLevel.watch,
            reason="Multiple doses are still unconfirmed. A caregiver check-in may help.",
        )

    return CaregiverStatus(
        active=False,
        level=CaregiverAlertLevel.watch,
        reason="No caregiver escalation is active right now.",
    )


def get_next_reminder(doses: list[ScheduleDose]) -> ScheduleDose | None:
    for dose in doses:
        if dose.status == DoseStatus.pending:
            return dose
    for dose in doses:
        if dose.status == DoseStatus.unconfirmed:
            return dose
    return None


def build_recent_activity(doses: list[ScheduleDose], caregiver_status: CaregiverStatus) -> list[RecentActivityItem]:
    activity: list[RecentActivityItem] = []

    for dose in doses[:3]:
        activity.append(
            RecentActivityItem(
                activity_id=f"activity-{dose.dose_id}",
                title=f"{dose.medicine_name} {dose.status.value}",
                detail=f"{dose.time_label} · {dose.food_note}",
                time_label=dose.time_label,
                type=dose.status.value,
            )
        )

    if caregiver_status.active:
        activity.insert(
            0,
            RecentActivityItem(
                activity_id="activity-caregiver",
                title="Caregiver attention",
                detail=caregiver_status.reason,
                time_label="Now",
                type="caregiver",
            ),
        )

    return activity[:5]
