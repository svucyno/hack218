import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';
import type { DemoScenarioKey } from '../types/intake';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Welcome'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
};

export function WelcomeScreen({ navigation, language, setLanguage, t }: Props) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              <Feather color={theme.colors.primary} name="heart" size={20} />
            </View>
            <Text style={styles.brandName}>{t('appName')}</Text>
          </View>

          <Text style={styles.headline}>Safe medicine support after discharge</Text>
          <Text style={styles.supportingText}>
            Clear reminders, simple schedules, and caregiver visibility in one calm mobile app.
          </Text>

          <View style={styles.toggleWrap}>
            <LanguageToggle value={language} onChange={setLanguage} />
          </View>

          <View style={styles.chips}>
            <StatusBadge icon="calendar" label="Simple plan" variant="accent" />
            <StatusBadge icon="volume-2" label="Language support" variant="accent" />
            <StatusBadge icon="users" label="Caregiver aware" variant="accent" />
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="arrow-right" label={t('getStarted')} onPress={() => navigation.replace('AppTabs')} />
          <Text style={styles.footerNote}>Demo scenarios can be changed from Home after you enter the app.</Text>
        </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
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
    lineHeight: 36,
    maxWidth: 320,
  },
  supportingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyLarge,
    lineHeight: 27,
    maxWidth: 340,
  },
  toggleWrap: {
    alignSelf: 'flex-start',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  footer: {
    gap: theme.spacing.md,
  },
  footerNote: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
    textAlign: 'center',
  },
});
