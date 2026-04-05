// Placeholders for backend connection

/**
 * Uploads document to backend OCR processing
 * POST /api/v1/prescription/upload
 */
export async function uploadPrescription(file: File) {
  // return fetch('/api/v1/prescription/upload', { ... })
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

/**
 * Sync medicine changes to schedule generator
 * POST /api/v1/schedule/generate
 */
export async function generateSchedule(medicines: any[]) {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

/**
 * Mark a dose as taken or missed
 * POST /api/v1/dose/:id/action
 */
export async function submitDoseAction(scheduleId: string, action: 'taken' | 'missed') {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Get adherence summary for caregiver
 * GET /api/v1/patient/:id/adherence
 */
export async function fetchPatientAdherence(patientId: string) {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Get alerts for caregiver
 * GET /api/v1/caregiver/alerts
 */
export async function fetchAlerts() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}
