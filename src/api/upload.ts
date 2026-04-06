import { apiRequest } from './client';
import { endpoints } from './endpoints';
import type { UploadApiResponse } from './types';

export async function uploadSampleDocument(documentType = 'discharge_summary'): Promise<UploadApiResponse> {
  const formData = new FormData();
  const blob = new Blob(['MedBridge sample discharge summary'], { type: 'text/plain' });
  formData.append('file', blob, 'sample.txt');
  formData.append('document_type', documentType);

  return apiRequest<UploadApiResponse>(endpoints.upload, {
    method: 'POST',
    body: formData,
    skipJsonHeader: true,
  });
}
