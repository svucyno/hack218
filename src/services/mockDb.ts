import { mockAdherence, mockAlerts, mockMedicines, mockPatient, mockSchedule } from '../data/mockData';
import type { Medicine, ScheduleItem, CaregiverAlert, AdherenceSummary } from '../types';

// Utility to simulate network latency
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'medbridge_mock_db';

interface MockDBState {
  medicines: Medicine[];
  schedule: ScheduleItem[];
  alerts: CaregiverAlert[];
  adherence: AdherenceSummary;
}

const defaultState: MockDBState = {
  medicines: mockMedicines,
  schedule: mockSchedule,
  alerts: [...mockAlerts],
  adherence: { ...mockAdherence },
};

// Extremely simple localStorage wrapper for keeping state over refreshes
export const MockDB = {
  read(): MockDBState {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultState;
    try {
      // Must revive dates
      return JSON.parse(data, (key, value) => {
        if (key === 'expectedTime' || key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
    } catch {
      return defaultState;
    }
  },

  write(state: MockDBState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  update(updater: (state: MockDBState) => MockDBState): MockDBState {
    const state = this.read();
    const newState = updater(state);
    this.write(newState);
    return newState;
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
