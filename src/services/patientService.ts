import { MockDB, delay } from './mockDb';
import type { UploadedDocument, OCRResult, APIResponse, Medicine, ScheduleItem, DoseLog } from '../types';
import { mockMedicines } from '../data/mockData';

export const patientService = {
  async uploadPrescription(file: File): Promise<APIResponse<UploadedDocument>> {
    await delay(1500); // Simulate network
    const doc: UploadedDocument = {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      fileObj: file,
      previewUrl: URL.createObjectURL(file),
      uploadTimestamp: new Date(),
    };
    return { success: true, data: doc };
  },

  async runOCR(documentId: string): Promise<APIResponse<OCRResult>> {
    await delay(2000);
    // Simulate AI parsing returning mockMedicines
    const result: OCRResult = {
      documentId,
      rawText: "Rx\nMetformin 500mg - 1 Tablet, Twice a day (8:00 AM, 8:00 PM), 30 Days. After Food.\n\nAmlodipine 5mg - 1 Tablet, Once a day (8:00 AM), 30 Days. Before Food. Do not crush. Take with water.\n\nAtorvastatin 20mg - 1 Tablet, Once a day (9:00 PM), 30 Days. After Food.",
      parsedMedicines: [...mockMedicines].map(m => ({...m, id: `parsed_${Math.random()}`}))
    };
    return { success: true, data: result };
  },

  async generateSchedule(medicines: Medicine[]): Promise<APIResponse<ScheduleItem[]>> {
    await delay(1000); // simulate backend saving medicines and generating schedule
    
    // In a real app this creates DB records. Here we do simple generation for today.
    const newSchedule: ScheduleItem[] = [];
    
    medicines.forEach((med, i) => {
      med.timing.forEach((timeStr, j) => {
        let period: 'Morning' | 'Afternoon' | 'Night' = 'Morning';
        const isPM = timeStr.includes('PM');
        const hourOrString = parseInt(timeStr.split(':')[0] || '8', 10);
        
        if (isPM && hourOrString >= 5 && hourOrString !== 12) period = 'Night';
        else if (isPM && (hourOrString < 5 || hourOrString === 12)) period = 'Afternoon';

        const d = new Date();
        d.setHours(isPM && hourOrString !== 12 ? hourOrString + 12 : hourOrString, 0, 0, 0);

        newSchedule.push({
          id: `sch_${Date.now()}_${i}_${j}`,
          medicineId: med.id, // reference
          time: timeStr,
          expectedTime: d,
          status: 'unconfirmed',
          period
        });
      });
    });

    // Save to DB
    MockDB.update(state => ({
      ...state,
      medicines,
      schedule: newSchedule,
    }));

    return { success: true, data: newSchedule };
  },

  async getSchedule(): Promise<APIResponse<{ medicines: Medicine[], schedule: ScheduleItem[] }>> {
    await delay(300);
    const db = MockDB.read();
    return { success: true, data: { medicines: db.medicines, schedule: db.schedule } };
  },

  async logDose(scheduleId: string, action: 'taken' | 'missed'): Promise<APIResponse<DoseLog>> {
    await delay(500);

    let updatedAdherence = { patientId: 'p1', overallPercentage: 0, takenCount: 0, missedCount: 0, unconfirmedCount: 0, totalForWeek: 0 };
    
    MockDB.update(state => {
      const schedule = (state.schedule || []).map(item => 
        item.id === scheduleId ? { ...item, status: action } : item
      );
      
      // Compute mock Adherence loosely based on new state
      const total = schedule.length || 1;
      const taken = schedule.filter(s => s.status === 'taken').length;
      const missed = schedule.filter(s => s.status === 'missed').length;
      const unconfirmed = schedule.filter(s => s.status === 'unconfirmed').length;
      const overall = Math.round((taken / total) * 100);

      updatedAdherence = {
        patientId: 'p1',
        takenCount: taken,
        missedCount: missed,
        unconfirmedCount: unconfirmed,
        overallPercentage: overall,
        totalForWeek: total
      };

      // Caregiver Alert Generation Logic (Mock)
      const alerts = [...state.alerts];
      if (action === 'missed') {
         // Create a missed dose alert
         alerts.push({
           id: `alert_${Date.now()}`,
           patientId: 'p1',
           type: 'missed_dose',
           severity: 'critical',
           message: `Missed dose logged at ${new Date().toLocaleTimeString()}`,
           timestamp: new Date(),
           resolved: false
         });
      }

      return { ...state, schedule, adherence: updatedAdherence, alerts };
    });

    const doseLog: DoseLog = {
      id: `log_${Date.now()}`,
      scheduleId,
      patientId: 'p1',
      action,
      timestamp: new Date()
    };
    
    return { success: true, data: doseLog };
  },

  async getAdherence(): Promise<APIResponse<any>> {
    await delay(300);
    return { success: true, data: MockDB.read().adherence };
  }
};
