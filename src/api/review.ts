import { apiRequest } from './client';
import { endpoints } from './endpoints';
import type { ReviewApiResponse, ReviewMedicinePayload } from './types';

export async function reviewMedicinesApi(payload: {
  documentId?: string | null;
  medicines: ReviewMedicinePayload[];
}): Promise<ReviewApiResponse> {
  return apiRequest<ReviewApiResponse>(endpoints.reviewMedicines, {
    method: 'POST',
    body: JSON.stringify({
      document_id: payload.documentId ?? undefined,
      medicines: payload.medicines,
    }),
  });
}
