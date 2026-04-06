import { apiRequest } from './client';
import { endpoints } from './endpoints';
import type { DoseStatusApi, DoseStatusUpdateApiResponse } from './types';

export async function updateDoseStatusApi(doseId: string, status: DoseStatusApi): Promise<DoseStatusUpdateApiResponse> {
  return apiRequest<DoseStatusUpdateApiResponse>(endpoints.doseStatus(doseId), {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}
