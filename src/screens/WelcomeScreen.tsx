import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme';
import type { DemoScenarioKey } from '../types/intake';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Welcome'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
};

export function WelcomeScreen({ navigation, t }: Props) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.logoWrap}>
            <Feather color={theme.colors.surface} name="heart" size={22} />
          </View>
          <Text style={styles.brandName}>{t('appName')}</Text>
          <Text style={styles.headline}>Simple medicine support</Text>
          <Text style={styles.supportingText}>Reminders, schedule, caregiver view.</Text>
        </View>

        <PrimaryButton icon="arrow-right" label={t('getStarted')} onPress={() => navigation.replace('AppTabs')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingTop: 64,
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  brandName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  headline: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
    maxWidth: 280,
  },
  supportingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
    maxWidth: 260,
  },
});
