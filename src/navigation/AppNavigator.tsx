import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { CaregiverOverviewScreen } from '../screens/CaregiverOverviewScreen';
import { HomeDashboardScreen } from '../screens/HomeDashboardScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { MedicationScheduleScreen } from '../screens/MedicationScheduleScreen';
import { UploadDocumentScreen } from '../screens/UploadDocumentScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppNavigatorProps = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

export function AppNavigator({ language, setLanguage, t }: AppNavigatorProps) {
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
          <WelcomeScreen {...props} language={language} setLanguage={setLanguage} t={t} />
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
          <HomeDashboardScreen {...props} language={language} setLanguage={setLanguage} t={t} />
        )}
      </Stack.Screen>
      <Stack.Screen name="UploadDocument">
        {(props) => (
          <UploadDocumentScreen {...props} language={language} setLanguage={setLanguage} t={t} />
        )}
      </Stack.Screen>
      <Stack.Screen name="MedicationSchedule">
        {(props) => (
          <MedicationScheduleScreen
            {...props}
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="CaregiverOverview">
        {(props) => (
          <CaregiverOverviewScreen
            {...props}
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
