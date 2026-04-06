import { apiRequest } from './client';
import { endpoints } from './endpoints';
import type { NormalizedMedicineApi, ScheduleApiResponse } from './types';

export async function generateScheduleApi(medicines: NormalizedMedicineApi[]): Promise<ScheduleApiResponse> {
  return apiRequest<ScheduleApiResponse>(endpoints.generateSchedule, {
    method: 'POST',
    body: JSON.stringify({ medicines }),
  });
}
