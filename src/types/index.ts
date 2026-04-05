export type Language = 'en' | 'te';

export type DoseStatus = 'taken' | 'missed' | 'unconfirmed';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[]; // e.g., ['8:00 AM', '8:00 PM']
  duration: string;
  instruction: 'Before Food' | 'After Food' | 'Anytime';
  description?: string;
  warningTags?: string[];
}

export interface ScheduleItem {
  id: string;
  medicineId: string;
  time: string;
  expectedTime: Date; // For sorting
  status: DoseStatus;
  period: 'Morning' | 'Afternoon' | 'Night';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  languagePref: Language;
  caregiverId: string;
  medicines: Medicine[];
}

export interface Caregiver {
  id: string;
  name: string;
  patients: Patient[];
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  patientId: string;
  type: 'missed_dose' | 'adherence_drop' | 'refill_needed';
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface AdherenceSummary {
  patientId: string;
  overallPercentage: number;
  takenCount: number;
  missedCount: number;
  unconfirmedCount: number;
  totalForWeek: number;
}
