import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { CaregiverOverviewScreen } from '../screens/CaregiverOverviewScreen';
import { ExtractionPreviewScreen } from '../screens/ExtractionPreviewScreen';
import { HomeDashboardScreen } from '../screens/HomeDashboardScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { MedicationScheduleScreen } from '../screens/MedicationScheduleScreen';
import { ReminderDetailScreen } from '../screens/ReminderDetailScreen';
import { ReviewMedicinesScreen } from '../screens/ReviewMedicinesScreen';
import { UploadDocumentScreen } from '../screens/UploadDocumentScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import type { DemoScenarioKey, ReviewMedicine, UploadMethod } from '../types/intake';
import type {
  AdherenceActivityItem,
  CaregiverAlertState,
  MedicationItem,
} from '../types/medication';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppNavigatorProps = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  selectedUploadMethod: UploadMethod | null;
  reviewMedicines: ReviewMedicine[];
  scheduleMedicines: MedicationItem[];
  activityHistory: AdherenceActivityItem[];
  caregiverAlert: CaregiverAlertState;
  caregiverAlertHistory: AdherenceActivityItem[];
  nextReminder: MedicationItem | null;
  activeReminder: MedicationItem | null;
  demoScenario: DemoScenarioKey | null;
  demoScenarioSummary: string;
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
  selectUploadMethod: (method: UploadMethod) => void;
  continueWithSampleDocument: () => void;
  confirmMedicine: (id: string) => void;
  editMedicine: (id: string) => void;
  removeMedicine: (id: string) => void;
  generateSchedule: () => MedicationItem[];
  resetReviewMedicines: () => void;
  updateDoseStatus: (id: string, status: MedicationItem['status']) => void;
  openReminder: (id?: string) => void;
  closeReminder: () => void;
  replayReminderVoice: () => void;
  remindAgain: () => void;
  respondToReminder: (status: 'Taken' | 'Missed' | 'Unconfirmed') => void;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
  resetDemoState: () => void;
};

export function AppNavigator({
  language,
  setLanguage,
  t,
  selectedUploadMethod,
  reviewMedicines,
  scheduleMedicines,
  activityHistory,
  caregiverAlert,
  caregiverAlertHistory,
  nextReminder,
  activeReminder,
  demoScenario,
  demoScenarioSummary,
  stats,
  selectUploadMethod,
  continueWithSampleDocument,
  confirmMedicine,
  editMedicine,
  removeMedicine,
  generateSchedule,
  resetReviewMedicines,
  updateDoseStatus,
  openReminder,
  closeReminder,
  replayReminderVoice,
  remindAgain,
  respondToReminder,
  applyDemoScenario,
  resetDemoState,
}: AppNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome">
        {(props) => (
          <WelcomeScreen
            {...props}
            applyDemoScenario={applyDemoScenario}
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="LanguageSelection">
        {(props) => (
          <LanguageSelectionScreen
            {...props}
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Home">
        {(props) => (
          <HomeDashboardScreen
            {...props}
            activityHistory={activityHistory}
            applyDemoScenario={applyDemoScenario}
            caregiverAlert={caregiverAlert}
            caregiverAlertHistory={caregiverAlertHistory}
            demoScenario={demoScenario}
            demoScenarioSummary={demoScenarioSummary}
            language={language}
            nextReminder={nextReminder}
            openReminder={openReminder}
            resetDemoState={resetDemoState}
            scheduleMedicines={scheduleMedicines}
            setLanguage={setLanguage}
            stats={stats}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UploadDocument">
        {(props) => (
          <UploadDocumentScreen
            {...props}
            continueWithSampleDocument={continueWithSampleDocument}
            language={language}
            selectedUploadMethod={selectedUploadMethod}
            selectUploadMethod={selectUploadMethod}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ExtractionPreview">
        {(props) => (
          <ExtractionPreviewScreen
            {...props}
            language={language}
            selectedUploadMethod={selectedUploadMethod}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReviewMedicines">
        {(props) => (
          <ReviewMedicinesScreen
            {...props}
            confirmMedicine={confirmMedicine}
            editMedicine={editMedicine}
            generateSchedule={generateSchedule}
            language={language}
            removeMedicine={removeMedicine}
            resetReviewMedicines={resetReviewMedicines}
            reviewMedicines={reviewMedicines}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReminderDetail">
        {(props) => (
          <ReminderDetailScreen
            {...props}
            activeReminder={activeReminder}
            closeReminder={closeReminder}
            language={language}
            remindAgain={remindAgain}
            replayReminderVoice={replayReminderVoice}
            respondToReminder={respondToReminder}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="MedicationSchedule">
        {(props) => (
          <MedicationScheduleScreen
            {...props}
            caregiverAlert={caregiverAlert}
            language={language}
            openReminder={openReminder}
            scheduleMedicines={scheduleMedicines}
            setLanguage={setLanguage}
            stats={stats}
            t={t}
            updateDoseStatus={updateDoseStatus}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="CaregiverOverview">
        {(props) => (
          <CaregiverOverviewScreen
            {...props}
            activityHistory={activityHistory}
            caregiverAlert={caregiverAlert}
            caregiverAlertHistory={caregiverAlertHistory}
            language={language}
            nextReminder={nextReminder}
            scheduleMedicines={scheduleMedicines}
            setLanguage={setLanguage}
            stats={stats}
            t={t}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
