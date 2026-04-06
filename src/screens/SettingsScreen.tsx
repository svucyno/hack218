import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatDemoScenarioDetail, formatDemoScenarioSummary, formatDemoScenarioTitle, getTranslation, localizeKnownText, type AppLanguage, type TranslationKey } from '../constants/languages';
import { DemoScenarioCard } from '../components/DemoScenarioCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';
import type { DemoScenarioKey } from '../types/intake';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Settings'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  demoScenario: DemoScenarioKey | null;
  demoScenarioSummary: string;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
  resetDemoState: () => void;
};

const scenarios: DemoScenarioKey[] = ['smooth', 'missed', 'no-response', 'escalated'];

export function SettingsScreen({ language, setLanguage, t, demoScenario, demoScenarioSummary, applyDemoScenario, resetDemoState }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={t('settings.eyebrow')} title={t('settings.title')} subtitle={t('settings.subtitle')} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.language')}</Text>
          <LanguageToggle value={language} onChange={setLanguage} />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{t('settings.demoMode')}</Text>
            <SecondaryButton fullWidth={false} icon="rotate-ccw" label={t('common.reset')} onPress={resetDemoState} />
          </View>
          <StatusBadge
            icon="play-circle"
            label={demoScenario ? t('demo.activeScenario', { name: formatDemoScenarioTitle(language, demoScenario) }) : t('settings.noScenario')}
            variant={demoScenario ? 'primary' : 'accent'}
          />
          <Text style={styles.helper}>{demoScenario ? formatDemoScenarioSummary(language, demoScenario) : t('demo.chooseScenario')}</Text>
          <View style={styles.scenarioGrid}>
            {scenarios.map((scenario) => (
              <DemoScenarioCard
                key={scenario}
                language={language}
                detail={formatDemoScenarioDetail(language, scenario)}
                onPress={applyDemoScenario}
                scenario={scenario}
                selected={demoScenario === scenario}
                title={formatDemoScenarioTitle(language, scenario)}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.appInfoTitle')}</Text>
          <Text style={styles.helper}>{t('settings.appInfoDetail')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  helper: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
  scenarioGrid: {
    gap: theme.spacing.sm,
  },
});
