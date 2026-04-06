import { apiRequest } from './client';
import { endpoints } from './endpoints';
import type { NormalizedMedicineApi, ScheduleApiResponse } from './types';

export async function generateScheduleApi(payload: {
  documentId?: string | null;
  reviewId?: string | null;
  medicines?: NormalizedMedicineApi[];
}): Promise<ScheduleApiResponse> {
  return apiRequest<ScheduleApiResponse>(endpoints.generateSchedule, {
    method: 'POST',
    body: JSON.stringify({
      document_id: payload.documentId ?? undefined,
      review_id: payload.reviewId ?? undefined,
      medicines: payload.medicines,
    }),
  });
}
