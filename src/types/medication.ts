export type MedicationStatus = 'Due now' | 'Unconfirmed' | 'Taken' | 'Missed';
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
