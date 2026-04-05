import type { MedicationItem } from '../types/medication';
import type { DemoDocument, ExtractionLine, ReviewMedicine, UploadMethod } from '../types/intake';

export const demoDocument: DemoDocument = {
  id: 'doc-1',
  title: 'Discharge Summary Sample',
  source: 'City Care Hospital',
  dateLabel: 'Issued today',
  summary: 'Printed discharge instructions with 4 medicine lines and one unclear entry.',
};

export const uploadMethods: Array<{
  id: UploadMethod;
  title: string;
  detail: string;
  icon: 'camera' | 'image' | 'file-text';
}> = [
  {
    id: 'camera',
    title: 'Take Photo',
    detail: 'Use the phone camera for a clear printed prescription.',
    icon: 'camera',
  },
  {
    id: 'image',
    title: 'Upload Image',
    detail: 'Choose a prescription photo already saved on the phone.',
    icon: 'image',
  },
  {
    id: 'pdf',
    title: 'Upload PDF',
    detail: 'Use a discharge summary or typed hospital medicine sheet.',
    icon: 'file-text',
  },
];

export const extractedLines: ExtractionLine[] = [
  {
    id: 'line-1',
    text: 'Pantoprazole 40 mg - once daily - before breakfast - 7 days',
    clarity: 'clear',
  },
  {
    id: 'line-2',
    text: 'Amoxicillin 500 mg - morning and night - after food - 5 days',
    clarity: 'clear',
  },
  {
    id: 'line-3',
    text: 'Aspirin 75 mg - afternoon after lunch - continue daily',
    clarity: 'clear',
  },
  {
    id: 'line-4',
    text: 'Metformin - 1 tab - after dinner - timing not fully clear',
    clarity: 'review',
    note: 'Dinner timing appears faint in the document and may need confirmation.',
  },
];

export const initialReviewMedicines: ReviewMedicine[] = [
  {
    id: 'review-1',
    name: 'Pantoprazole',
    dosage: '40 mg',
    frequency: 'Once daily',
    timing: '7:30 AM',
    duration: '7 days',
    foodTiming: 'Before breakfast',
    confirmed: true,
    removed: false,
    edited: false,
    warnings: [],
  },
  {
    id: 'review-2',
    name: 'Amoxicillin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    timing: '8:00 AM and 8:00 PM',
    duration: '5 days',
    foodTiming: 'After food',
    confirmed: true,
    removed: false,
    edited: false,
    warnings: [],
  },
  {
    id: 'review-3',
    name: 'Aspirin',
    dosage: '75 mg',
    frequency: 'Once daily',
    timing: '1:00 PM',
    duration: 'Continue daily',
    foodTiming: 'After lunch',
    confirmed: false,
    removed: false,
    edited: false,
    warnings: ['possible-duplicate'],
  },
  {
    id: 'review-4',
    name: 'Metformin',
    dosage: '',
    frequency: 'Once daily',
    timing: '',
    duration: '14 days',
    foodTiming: 'After dinner',
    confirmed: false,
    removed: false,
    edited: false,
    warnings: ['missing-dosage', 'unclear-timing'],
  },
];

export const defaultGeneratedSchedule: MedicationItem[] = [
  {
    id: 'sched-1',
    name: 'Pantoprazole',
    dosage: '40 mg',
    timing: '7:30 AM',
    period: 'Morning',
    foodTiming: 'Before breakfast',
    note: 'From discharge summary, take for 7 days',
    status: 'Taken',
  },
  {
    id: 'sched-2',
    name: 'Amoxicillin',
    dosage: '500 mg',
    timing: '8:00 AM',
    period: 'Morning',
    foodTiming: 'After breakfast',
    note: 'Morning antibiotic dose from review step',
    status: 'Pending',
  },
  {
    id: 'sched-3',
    name: 'Aspirin',
    dosage: '75 mg',
    timing: '1:00 PM',
    period: 'Afternoon',
    foodTiming: 'After lunch',
    note: 'Continue daily after lunch',
    status: 'Unconfirmed',
  },
  {
    id: 'sched-4',
    name: 'Amoxicillin',
    dosage: '500 mg',
    timing: '8:00 PM',
    period: 'Night',
    foodTiming: 'After dinner',
    note: 'Night antibiotic dose from review step',
    status: 'Unconfirmed',
  },
  {
    id: 'sched-5',
    name: 'Metformin',
    dosage: '500 mg',
    timing: '8:30 PM',
    period: 'Night',
    foodTiming: 'After dinner',
    note: 'Timing clarified during review before schedule generation',
    status: 'Missed',
  },
];
