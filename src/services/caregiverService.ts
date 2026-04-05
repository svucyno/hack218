import { MockDB, delay } from './mockDb';
import type { CaregiverAlert, APIResponse } from '../types';

export const caregiverService = {
  async getAlerts(): Promise<APIResponse<CaregiverAlert[]>> {
    await delay(400);
    const db = MockDB.read();
    return { success: true, data: db.alerts.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()) };
  },

  async resolveAlert(alertId: string): Promise<APIResponse<null>> {
    await delay(300);
    MockDB.update(state => ({
      ...state,
      alerts: state.alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a)
    }));
    return { success: true, data: null };
  }
};
