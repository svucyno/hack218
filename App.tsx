import 'react-native-gesture-handler';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useAppLanguage } from './src/hooks/useAppLanguage';
import { useMedicationIntake } from './src/hooks/useMedicationIntake';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    border: theme.colors.border,
    card: theme.colors.surface,
    primary: theme.colors.primary,
    text: theme.colors.textPrimary,
  },
};

export default function App() {
  const languageState = useAppLanguage();
  const intakeState = useMedicationIntake();

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="dark" />
      <AppNavigator {...languageState} {...intakeState} />
    </NavigationContainer>
  );
}
