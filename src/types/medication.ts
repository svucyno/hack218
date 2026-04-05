export type MedicationStatus = 'Pending' | 'Unconfirmed' | 'Taken' | 'Missed';
export type MedicationPeriod = 'Morning' | 'Afternoon' | 'Night';

export type MedicationItem = {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  period: MedicationPeriod;
  foodTiming: string;
  note: string;
  status: MedicationStatus;
};

export type CaregiverStatusItem = {
  id: string;
  label: string;
  detail: string;
  badge: 'primary' | 'secondary' | 'accent' | 'neutral';
};

export type ReminderItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  level: 'info' | 'attention';
};

export type AdherenceActivityItem = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  type: 'taken' | 'missed' | 'unconfirmed' | 'caregiver' | 'system' | 'reminder';
};

export type CaregiverAlertState = {
  active: boolean;
  reason: string;
  level: 'watch' | 'alert';
};
