import type {
  CaregiverStatusApi,
  DoseStatusApi,
  PatientTodayApiResponse,
  RecentActivityApi,
  ReviewApiResponse,
  ScheduleApiResponse,
  ScheduleDoseApi,
  UploadApiResponse,
} from './types';
import type { ExtractionLine, ReviewMedicine, UploadPreviewData } from '../types/intake';
import type { AdherenceActivityItem, CaregiverAlertState, MedicationItem, MedicationStatus } from '../types/medication';

function titleCaseWords(value: string): string {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function mapDoseStatus(status: DoseStatusApi): MedicationStatus {
  switch (status) {
    case 'taken':
      return 'Taken';
    case 'missed':
      return 'Missed';
    case 'unconfirmed':
      return 'Unconfirmed';
    default:
      return 'Pending';
  }
}

function mapPeriod(period: ScheduleDoseApi['period']): MedicationItem['period'] {
  switch (period) {
    case 'afternoon':
      return 'Afternoon';
    case 'night':
      return 'Night';
    default:
      return 'Morning';
  }
}

export function mapUploadResponseToPreview(response: UploadApiResponse): UploadPreviewData {
  const detectedLines: ExtractionLine[] = response.detected_lines.map((text, index) => ({
    id: `${response.document_id}-line-${index + 1}`,
    text,
    clarity: text.toLowerCase().includes('unclear') ? 'review' : 'clear',
  }));

  return {
    documentId: response.document_id,
    filename: response.filename,
    documentType: response.document_type,
    extractedText: response.extracted_text,
    warnings: response.warnings,
    detectedLines,
    title: response.filename,
    source: titleCaseWords(response.document_type),
    dateLabel: 'Uploaded now',
    summary: `${response.detected_lines.length} detected lines ready for review.`,
  };
}

export function mapReviewResponseToReviewMedicines(response: ReviewApiResponse): ReviewMedicine[] {
  return response.medicines.map((medicine) => ({
    id: medicine.medicine_id,
    name: medicine.name,
    dosage: medicine.dosage,
    frequency: titleCaseWords(medicine.frequency),
    timing: medicine.timing.join(' and '),
    duration: medicine.duration_days ? `${medicine.duration_days} days` : 'Continue daily',
    foodTiming: titleCaseWords(medicine.food_note),
    confirmed: medicine.status === 'confirmed',
    removed: false,
    edited: false,
    warnings: [],
  }));
}

export function mapScheduleDoseToMedicationItem(dose: ScheduleDoseApi): MedicationItem {
  return {
    id: dose.dose_id,
    name: dose.medicine_name,
    dosage: dose.dosage,
    timing: dose.time_label,
    period: mapPeriod(dose.period),
    foodTiming: titleCaseWords(dose.food_note),
    note: dose.note,
    status: mapDoseStatus(dose.status),
  };
}

export function mapScheduleResponseToMedicationItems(response: ScheduleApiResponse): MedicationItem[] {
  return [...response.groups.morning, ...response.groups.afternoon, ...response.groups.night].map(
    mapScheduleDoseToMedicationItem,
  );
}

export function mapRecentActivity(item: RecentActivityApi): AdherenceActivityItem {
  const typeMap: Record<string, AdherenceActivityItem['type']> = {
    taken: 'taken',
    missed: 'missed',
    unconfirmed: 'unconfirmed',
    caregiver: 'caregiver',
    reminder: 'reminder',
    pending: 'system',
  };

  return {
    id: item.activity_id,
    title: item.title,
    detail: item.detail,
    timeLabel: item.time_label,
    type: typeMap[item.type] ?? 'system',
  };
}

export function mapCaregiverStatus(status: CaregiverStatusApi): CaregiverAlertState {
  return {
    active: status.active,
    level: status.level,
    reason: status.reason,
  };
}

export function mapPatientTodayResponse(response: PatientTodayApiResponse): {
  scheduleMedicines: MedicationItem[];
  activityHistory: AdherenceActivityItem[];
  caregiverAlert: CaregiverAlertState;
  nextReminder: MedicationItem | null;
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
} {
  const scheduleMedicines = response.active_schedule.map(mapScheduleDoseToMedicationItem);
  const summary = response.adherence_summary;
  const adherencePercent = summary.total_doses === 0 ? 0 : Math.round((summary.taken / summary.total_doses) * 100);

  return {
    scheduleMedicines,
    activityHistory: response.recent_activity.map(mapRecentActivity),
    caregiverAlert: mapCaregiverStatus(response.caregiver_status),
    nextReminder: response.next_reminder ? mapScheduleDoseToMedicationItem(response.next_reminder) : null,
    stats: {
      total: summary.total_doses,
      taken: summary.taken,
      missed: summary.missed,
      unconfirmed: summary.unconfirmed,
      pending: summary.pending,
      adherencePercent,
    },
  };
}
