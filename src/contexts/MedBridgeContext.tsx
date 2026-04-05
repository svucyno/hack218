import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MockDB } from '../services/mockDb';
import { patientService } from '../services/patientService';
import { caregiverService } from '../services/caregiverService';
import type { 
  Medicine, ScheduleItem, AdherenceSummary, 
  CaregiverAlert, UploadedDocument, OCRResult, AppSettings 
} from '../types';

interface MedBridgeContextType {
  // Global State
  document: UploadedDocument | null;
  ocrResult: OCRResult | null;
  medicines: Medicine[];
  schedule: ScheduleItem[];
  adherence: AdherenceSummary | null;
  alerts: CaregiverAlert[];
  settings: AppSettings;
  isLoading: boolean;
  
  // Actions
  handleUpload: (file: File) => Promise<void>;
  handleGenerateSchedule: (medicines: Medicine[]) => Promise<void>;
  handleDoseAction: (scheduleId: string, action: 'taken' | 'missed') => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  loadInitialData: () => Promise<void>;
}

const MedBridgeContext = createContext<MedBridgeContextType | undefined>(undefined);

export function MedBridgeProvider({ children }: { children: ReactNode }) {
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [adherence, setAdherence] = useState<AdherenceSummary | null>(null);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    notificationsEnabled: true,
    voicePromptsEnabled: true,
    darkModeEnabled: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
       // Pull from LocalStorage/MockDB
       const db = MockDB.read();
       setMedicines(db.medicines);
       setSchedule(db.schedule);
       setAdherence(db.adherence);
       setAlerts(db.alerts);

       // Read local settings if any
       const storedSettings = localStorage.getItem('medbridge_settings');
       if (storedSettings) setSettings(JSON.parse(storedSettings));
       
    } catch (e) {
       console.error("Failed to load generic state", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem('medbridge_settings', JSON.stringify(settings));
  }, [settings]);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    const res = await patientService.uploadPrescription(file);
    if (res.success && res.data) {
      setDocument(res.data);
      // Automatically trigger OCR based on the document mock logic
      const ocr = await patientService.runOCR(res.data.id);
      if (ocr.success && ocr.data) {
        setOcrResult(ocr.data);
      }
    }
    setIsLoading(false);
  };

  const handleGenerateSchedule = async (newMedicines: Medicine[]) => {
    setIsLoading(true);
    const res = await patientService.generateSchedule(newMedicines);
    if (res.success && res.data) {
      setMedicines(newMedicines);
      setSchedule(res.data);
    }
    setIsLoading(false);
  };

  const handleDoseAction = async (scheduleId: string, action: 'taken' | 'missed') => {
    setIsLoading(true);
    const res = await patientService.logDose(scheduleId, action);
    if (res.success) {
      // Refresh state directly from DB to cleanly fetch side-effects (new alerts, adherence modifications)
      const db = MockDB.read();
      setSchedule(db.schedule);
      setAdherence(db.adherence);
      setAlerts(db.alerts);
    }
    setIsLoading(false);
  };

  const resolveAlert = async (alertId: string) => {
    const res = await caregiverService.resolveAlert(alertId);
    if (res.success) {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <MedBridgeContext.Provider 
      value={{
        document, ocrResult, medicines, schedule, adherence, alerts, settings, isLoading,
        handleUpload, handleGenerateSchedule, handleDoseAction, resolveAlert, updateSettings, loadInitialData
      }}
    >
      {children}
    </MedBridgeContext.Provider>
  );
}

export const useMedBridge = () => {
  const context = useContext(MedBridgeContext);
  if (context === undefined) {
    throw new Error('useMedBridge must be used within a MedBridgeProvider');
  }
  return context;
};
