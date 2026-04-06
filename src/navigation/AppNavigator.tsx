import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { theme } from '../theme';
import type { DemoScenarioKey, ReviewMedicine, UploadMethod, UploadPreviewData } from '../types/intake';
import type { AdherenceActivityItem, CaregiverAlertState, MedicationItem } from '../types/medication';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';
import { CaregiverOverviewScreen } from '../screens/CaregiverOverviewScreen';
import { ExtractionPreviewScreen } from '../screens/ExtractionPreviewScreen';
import { HomeDashboardScreen } from '../screens/HomeDashboardScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { MedicationScheduleScreen } from '../screens/MedicationScheduleScreen';
import { ReminderDetailScreen } from '../screens/ReminderDetailScreen';
import { ReviewMedicinesScreen } from '../screens/ReviewMedicinesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { UploadDocumentScreen } from '../screens/UploadDocumentScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type SharedNavigatorProps = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  completeLanguageSetup: (language: AppLanguage) => void;
  hasCompletedLanguageSetup: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  selectedUploadMethod: UploadMethod | null;
  hasUploadedDocument: boolean;
  reviewMedicines: ReviewMedicine[];
  scheduleMedicines: MedicationItem[];
  activityHistory: AdherenceActivityItem[];
  caregiverAlert: CaregiverAlertState;
  caregiverAlertHistory: AdherenceActivityItem[];
  nextReminder: MedicationItem | null;
  activeReminder: MedicationItem | null;
  demoScenario: DemoScenarioKey | null;
  demoScenarioSummary: string;
  uploadPreview: UploadPreviewData;
  apiNotice: string | null;
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
  selectUploadMethod: (method: UploadMethod) => void;
  continueWithSampleDocument: () => Promise<void>;
  confirmMedicine: (id: string) => void;
  editMedicine: (id: string) => void;
  removeMedicine: (id: string) => void;
  generateSchedule: () => Promise<MedicationItem[]>;
  resetReviewMedicines: () => void;
  updateDoseStatus: (id: string, status: MedicationItem['status']) => Promise<void>;
  openReminder: (id?: string) => void;
  closeReminder: () => void;
  replayReminderVoice: () => void;
  remindAgain: () => void;
  respondToReminder: (status: 'Taken' | 'Missed' | 'Unconfirmed') => Promise<void>;
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
          fontSize: 11,
          fontWeight: '700',
          paddingBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => <Feather color={color} name={tabIcons[route.name]} size={size} />,
      })}
    >
      <Tab.Screen name="HomeTab" options={{ title: props.t('navigation.home'), tabBarLabel: props.t('navigation.home') }}>
        {(screenProps) => (
          <HomeDashboardScreen
            {...screenProps}
            language={props.language}
            caregiverAlert={props.caregiverAlert}
            demoScenario={props.demoScenario}
            demoScenarioSummary={props.demoScenarioSummary}
            nextReminder={props.nextReminder}
            openReminder={props.openReminder}
            stats={props.stats}
            apiNotice={props.apiNotice}
            t={props.t}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="ScheduleTab" options={{ title: props.t('navigation.schedule'), tabBarLabel: props.t('navigation.schedule') }}>
        {(screenProps) => (
          <MedicationScheduleScreen
            {...screenProps}
            language={props.language}
            caregiverAlert={props.caregiverAlert}
            openReminder={props.openReminder}
            scheduleMedicines={props.scheduleMedicines}
            stats={props.stats}
            apiNotice={props.apiNotice}
            t={props.t}
            updateDoseStatus={props.updateDoseStatus}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="UploadTab" options={{ title: props.t('navigation.upload'), tabBarLabel: props.t('navigation.upload') }}>
        {(screenProps) => (
          <UploadDocumentScreen
            {...screenProps}
            language={props.language}
            continueWithSampleDocument={props.continueWithSampleDocument}
            hasUploadedDocument={props.hasUploadedDocument}
            selectedUploadMethod={props.selectedUploadMethod}
            selectUploadMethod={props.selectUploadMethod}
            apiNotice={props.apiNotice}
            t={props.t}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="CaregiverTab" options={{ title: props.t('navigation.caregiver'), tabBarLabel: props.t('navigation.caregiver') }}>
        {(screenProps) => (
          <CaregiverOverviewScreen
            {...screenProps}
            language={props.language}
            activityHistory={props.activityHistory}
            caregiverAlert={props.caregiverAlert}
            nextReminder={props.nextReminder}
            scheduleMedicines={props.scheduleMedicines}
            stats={props.stats}
            apiNotice={props.apiNotice}
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
      initialRouteName={props.hasCompletedLanguageSetup ? 'Welcome' : 'LanguageSelection'}
      screenOptions={{ animation: 'slide_from_right', headerShown: false }}
    >
      <Stack.Screen name="LanguageSelection">
        {(screenProps) => (
          <LanguageSelectionScreen
            {...screenProps}
            completeLanguageSetup={props.completeLanguageSetup}
            language={props.language}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
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
      <Stack.Screen name="AppTabs">{() => <MainTabNavigator {...props} />}</Stack.Screen>
      <Stack.Screen name="Settings">
        {(screenProps) => (
          <SettingsScreen
            {...screenProps}
            applyDemoScenario={props.applyDemoScenario}
            demoScenario={props.demoScenario}
            demoScenarioSummary={props.demoScenarioSummary}
            language={props.language}
            resetDemoState={props.resetDemoState}
            setLanguage={props.setLanguage}
            t={props.t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ExtractionPreview">
        {(screenProps) => (
          <ExtractionPreviewScreen
            {...screenProps}
            language={props.language}
            selectedUploadMethod={props.selectedUploadMethod}
            uploadPreview={props.uploadPreview}
            apiNotice={props.apiNotice}
            t={props.t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReviewMedicines">
        {(screenProps) => (
          <ReviewMedicinesScreen
            {...screenProps}
            language={props.language}
            confirmMedicine={props.confirmMedicine}
            editMedicine={props.editMedicine}
            generateSchedule={props.generateSchedule}
            removeMedicine={props.removeMedicine}
            resetReviewMedicines={props.resetReviewMedicines}
            reviewMedicines={props.reviewMedicines}
            apiNotice={props.apiNotice}
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
