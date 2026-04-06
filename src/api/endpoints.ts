export const endpoints = {
  health: '/api/health',
  upload: '/api/upload',
  reviewMedicines: '/api/medicines/review',
  generateSchedule: '/api/schedule/generate',
  patientToday: '/api/patient/today',
  doseStatus: (doseId: string) => `/api/doses/${doseId}/status`,
} as const;
