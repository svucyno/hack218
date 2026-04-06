import { apiRequest } from './client';
import { endpoints } from './endpoints';
import type { PatientTodayApiResponse } from './types';

export async function getPatientTodayApi(): Promise<PatientTodayApiResponse> {
  return apiRequest<PatientTodayApiResponse>(endpoints.patientToday);
}
