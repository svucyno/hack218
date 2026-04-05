export type UploadMethod = 'camera' | 'image' | 'pdf' | 'sample';
export type DemoScenarioKey = 'smooth' | 'missed' | 'no-response' | 'escalated';

export type ExtractionLine = {
  id: string;
  text: string;
  clarity: 'clear' | 'review';
  note?: string;
};

export type ReviewWarning = 'missing-dosage' | 'unclear-timing' | 'possible-duplicate';

export type ReviewMedicine = {
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
  warnings: ReviewWarning[];
};

export type DemoDocument = {
  id: string;
  title: string;
  source: string;
  dateLabel: string;
  summary: string;
};
