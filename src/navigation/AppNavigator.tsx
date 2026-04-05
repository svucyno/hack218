import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { theme } from '../theme';
import type { DemoScenarioKey, ReviewMedicine, UploadMethod } from '../types/intake';
import type {
  AdherenceActivityItem,
  CaregiverAlertState,
  MedicationItem,
} from '../types/medication';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';
import { CaregiverOverviewScreen } from '../screens/CaregiverOverviewScreen';
import { ExtractionPreviewScreen } from '../screens/ExtractionPreviewScreen';
import { HomeDashboardScreen } from '../screens/HomeDashboardScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { MedicationScheduleScreen } from '../screens/MedicationScheduleScreen';
import { ReminderDetailScreen } from '../screens/ReminderDetailScreen';
import { ReviewMedicinesScreen } from '../screens/ReviewMedicinesScreen';
import { UploadDocumentScreen } from '../screens/UploadDocumentScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type SharedNavigatorProps = {
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

const tabIcons: Record<keyof MainTabParamList, keyof typeof Feather.glyphMap> = {
  HomeTab: 'home',
  ScheduleTab: 'calendar',
  UploadTab: 'upload',
  CaregiverTab: 'users',
};

function MainTabNavigator(props: SharedNavigatorProps) {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          paddingBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Feather color={color} name={tabIcons[route.name]} size={size} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" options={{ title: 'Home', tabBarLabel: 'Home' }}>
        {(screenProps) => (
          <HomeDashboardScreen
            {...screenProps}
            activityHistory={props.activityHistory}
            applyDemoScenario={props.applyDemoScenario}
            caregiverAlert={props.caregiverAlert}
            caregiverAlertHistory={props.caregiverAlertHistory}
            demoScenario={props.demoScenario}
            demoScenarioSummary={props.demoScenarioSummary}
            language={props.language}
            nextReminder={props.nextReminder}
            openReminder={props.openReminder}
            resetDemoState={props.resetDemoState}
            scheduleMedicines={props.scheduleMedicines}
            setLanguage={props.setLanguage}
            stats={props.stats}
            t={props.t}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="ScheduleTab" options={{ title: 'Schedule', tabBarLabel: 'Schedule' }}>
        {(screenProps) => (
          <MedicationScheduleScreen
            {...screenProps}
            caregiverAlert={props.caregiverAlert}
            language={props.language}
            openReminder={props.openReminder}
            scheduleMedicines={props.scheduleMedicines}
            setLanguage={props.setLanguage}
            stats={props.stats}
            t={props.t}
            updateDoseStatus={props.updateDoseStatus}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="UploadTab" options={{ title: 'Upload', tabBarLabel: 'Upload' }}>
        {(screenProps) => (
          <UploadDocumentScreen
            {...screenProps}
            continueWithSampleDocument={props.continueWithSampleDocument}
            language={props.language}
            selectedUploadMethod={props.selectedUploadMethod}
            selectUploadMethod={props.selectUploadMethod}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="CaregiverTab" options={{ title: 'Caregiver', tabBarLabel: 'Caregiver' }}>
        {(screenProps) => (
          <CaregiverOverviewScreen
            {...screenProps}
            activityHistory={props.activityHistory}
            caregiverAlert={props.caregiverAlert}
            caregiverAlertHistory={props.caregiverAlertHistory}
            language={props.language}
            nextReminder={props.nextReminder}
            scheduleMedicines={props.scheduleMedicines}
            setLanguage={props.setLanguage}
            stats={props.stats}
            t={props.t}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator(props: SharedNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome">
        {(screenProps) => (
          <WelcomeScreen
            {...screenProps}
            applyDemoScenario={props.applyDemoScenario}
            language={props.language}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="LanguageSelection">
        {(screenProps) => (
          <LanguageSelectionScreen
            {...screenProps}
            language={props.language}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AppTabs">
        {() => <MainTabNavigator {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ExtractionPreview">
        {(screenProps) => (
          <ExtractionPreviewScreen
            {...screenProps}
            language={props.language}
            selectedUploadMethod={props.selectedUploadMethod}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReviewMedicines">
        {(screenProps) => (
          <ReviewMedicinesScreen
            {...screenProps}
            confirmMedicine={props.confirmMedicine}
            editMedicine={props.editMedicine}
            generateSchedule={props.generateSchedule}
            language={props.language}
            removeMedicine={props.removeMedicine}
            resetReviewMedicines={props.resetReviewMedicines}
            reviewMedicines={props.reviewMedicines}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReminderDetail">
        {(screenProps) => (
          <ReminderDetailScreen
            {...screenProps}
            activeReminder={props.activeReminder}
            closeReminder={props.closeReminder}
            language={props.language}
            remindAgain={props.remindAgain}
            replayReminderVoice={props.replayReminderVoice}
            respondToReminder={props.respondToReminder}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
