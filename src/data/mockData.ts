import type { CaregiverStatusItem, MedicationItem, ReminderItem } from '../types/medication';

export const medications: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Amoxicillin',
    dosage: '500 mg',
    timing: '8:00 AM',
    period: 'Morning',
    foodTiming: 'After breakfast',
    note: 'For chest infection, continue for 5 days',
    status: 'Pending',
  },
  {
    id: 'med-2',
    name: 'Pantoprazole',
    dosage: '40 mg',
    timing: '7:30 AM',
    period: 'Morning',
    foodTiming: 'Before food',
    note: 'Take with water before breakfast',
    status: 'Taken',
  },
  {
    id: 'med-3',
    name: 'Aspirin',
    dosage: '75 mg',
    timing: '1:00 PM',
    period: 'Afternoon',
    foodTiming: 'After lunch',
    note: 'Daily heart-protection tablet',
    status: 'Unconfirmed',
  },
  {
    id: 'med-4',
    name: 'Metformin',
    dosage: '500 mg',
    timing: '8:00 PM',
    period: 'Night',
    foodTiming: 'After dinner',
    note: 'Take after the full evening meal',
    status: 'Unconfirmed',
  },
  {
    id: 'med-5',
    name: 'Vitamin D3',
    dosage: '1 tablet',
    timing: '9:00 PM',
    period: 'Night',
    foodTiming: 'After food',
    note: 'Missed yesterday, keep strip nearby tonight',
    status: 'Missed',
  },
];

export const caregiverStatus: CaregiverStatusItem[] = [
  {
    id: 'care-1',
    label: 'Morning dose progress',
    detail: '2 of 2 morning medicines were reviewed today',
    badge: 'primary',
  },
  {
    id: 'care-2',
    label: 'Patient support note',
    detail: 'Afternoon aspirin may need a caregiver reminder call',
    badge: 'secondary',
  },
  {
    id: 'care-3',
    label: 'Recent file activity',
    detail: 'Discharge summary uploaded and ready for review',
    badge: 'accent',
  },
];

export const recentReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Morning antibiotic pending',
    detail: 'Please take after breakfast and tap Taken when complete.',
    time: '8:00 AM',
    level: 'attention',
  },
  {
    id: 'rem-2',
    title: 'Caregiver review helpful at 1:00 PM',
    detail: 'Aspirin is still waiting for confirmation after lunch.',
    time: '1:00 PM',
    level: 'info',
  },
];
