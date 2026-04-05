import type { Medicine, Patient, ScheduleItem, Alert, AdherenceSummary } from '../types';

export const mockMedicines: Medicine[] = [
  {
    id: 'm1',
    name: 'Metformin 500mg',
    dosage: '1 Tablet',
    frequency: 'Twice a day',
    timing: ['8:00 AM', '8:00 PM'],
    duration: '30 Days',
    instruction: 'After Food',
    description: 'For blood sugar control',
  },
  {
    id: 'm2',
    name: 'Amlodipine 5mg',
    dosage: '1 Tablet',
    frequency: 'Once a day',
    timing: ['8:00 AM'],
    duration: '30 Days',
    instruction: 'Before Food',
    description: 'For blood pressure',
    warningTags: ['Do not crush', 'Take with water'],
  },
  {
    id: 'm3',
    name: 'Atorvastatin 20mg',
    dosage: '1 Tablet',
    frequency: 'Once a day',
    timing: ['9:00 PM'],
    duration: '30 Days',
    instruction: 'After Food',
  }
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: 's1',
    medicineId: 'm2',
    time: '8:00 AM',
    expectedTime: new Date(new Date().setHours(8, 0, 0, 0)),
    status: 'taken',
    period: 'Morning'
  },
  {
    id: 's2',
    medicineId: 'm1',
    time: '8:00 AM',
    expectedTime: new Date(new Date().setHours(8, 0, 0, 0)),
    status: 'taken',
    period: 'Morning'
  },
  {
    id: 's3',
    medicineId: 'm1',
    time: '8:00 PM',
    expectedTime: new Date(new Date().setHours(20, 0, 0, 0)),
    status: 'unconfirmed',
    period: 'Night'
  },
  {
    id: 's4',
    medicineId: 'm3',
    time: '9:00 PM',
    expectedTime: new Date(new Date().setHours(21, 0, 0, 0)),
    status: 'unconfirmed',
    period: 'Night'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    patientId: 'p1',
    type: 'missed_dose',
    severity: 'critical',
    message: 'Missed Metformin dose yesterday night.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    resolved: false
  },
  {
    id: 'a2',
    patientId: 'p1',
    type: 'adherence_drop',
    severity: 'warning',
    message: 'Adherence dropped below 80% this week.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    resolved: false
  }
];

export const mockAdherence: AdherenceSummary = {
  patientId: 'p1',
  overallPercentage: 78,
  takenCount: 14,
  missedCount: 2,
  unconfirmedCount: 2,
  totalForWeek: 18
};

export const mockPatient: Patient = {
  id: 'p1',
  name: 'Venkateshwara Rao',
  age: 68,
  languagePref: 'te',
  caregiverId: 'c1',
  medicines: mockMedicines,
};
