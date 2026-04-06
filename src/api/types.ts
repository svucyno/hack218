export type UploadApiResponse = {
  document_id: string;
  filename: string;
  document_type: string;
  extracted_text: string;
  detected_lines: string[];
  warnings: string[];
};

export type ReviewMedicinePayload = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  foodTiming: string;
  confirmed: boolean;
  removed: boolean;
  edited: boolean;
  warnings: Array<'missing-dosage' | 'unclear-timing' | 'possible-duplicate'>;
};

export type NormalizedMedicineApi = {
  medicine_id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  food_note: string;
  duration_days: number | null;
  status: string;
};

export type ReviewApiResponse = {
  review_id: string;
  medicines: NormalizedMedicineApi[];
  warnings: string[];
};

export type DoseStatusApi = 'pending' | 'taken' | 'missed' | 'unconfirmed';
export type ScheduleGroupApi = 'morning' | 'afternoon' | 'night';

export type ScheduleDoseApi = {
  dose_id: string;
  medicine_name: string;
  dosage: string;
  time_label: string;
  period: ScheduleGroupApi;
  food_note: string;
  note: string;
  status: DoseStatusApi;
};

export type AdherenceSummaryApi = {
  total_doses: number;
  taken: number;
  missed: number;
  unconfirmed: number;
  pending: number;
};

export type ScheduleApiResponse = {
  schedule_id: string;
  groups: {
    morning: ScheduleDoseApi[];
    afternoon: ScheduleDoseApi[];
    night: ScheduleDoseApi[];
  };
  adherence_summary: AdherenceSummaryApi;
};

export type CaregiverStatusApi = {
  active: boolean;
  level: 'watch' | 'alert';
  reason: string;
};

export type RecentActivityApi = {
  activity_id: string;
  title: string;
  detail: string;
  time_label: string;
  type: string;
};

export type PatientTodayApiResponse = {
  patient_id: string;
  patient_name: string;
  next_reminder: ScheduleDoseApi | null;
  adherence_summary: AdherenceSummaryApi;
  caregiver_status: CaregiverStatusApi;
  recent_activity: RecentActivityApi[];
  active_schedule: ScheduleDoseApi[];
};

export type DoseStatusUpdateApiResponse = {
  dose_id: string;
  updated_dose: ScheduleDoseApi;
  adherence_summary: AdherenceSummaryApi;
  caregiver_status: CaregiverStatusApi;
  next_reminder: ScheduleDoseApi | null;
  recent_activity: RecentActivityApi[];
  groups: {
    morning: ScheduleDoseApi[];
    afternoon: ScheduleDoseApi[];
    night: ScheduleDoseApi[];
  };
};
