import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
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
  t: (key: TranslationKey) => string;
  demoScenario: DemoScenarioKey | null;
  demoScenarioSummary: string;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
  resetDemoState: () => void;
};

const scenarios: Array<{ key: DemoScenarioKey; title: string; detail: string }> = [
  { key: 'smooth', title: 'Smooth', detail: 'Mostly taken' },
  { key: 'missed', title: 'Missed', detail: 'Caregiver alert' },
  { key: 'no-response', title: 'No response', detail: 'Unconfirmed dose' },
  { key: 'escalated', title: 'Escalated', detail: 'Multiple issues' },
];

export function SettingsScreen({
  language,
  setLanguage,
  demoScenario,
  demoScenarioSummary,
  applyDemoScenario,
  resetDemoState,
}: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="Settings" title="Settings" subtitle="Language and demo mode." />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Language</Text>
          <LanguageToggle value={language} onChange={setLanguage} />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Demo mode</Text>
            <SecondaryButton fullWidth={false} icon="rotate-ccw" label="Reset" onPress={resetDemoState} />
          </View>
          <StatusBadge
            icon="play-circle"
            label={demoScenario ? `Active: ${demoScenario}` : 'No scenario'}
            variant={demoScenario ? 'primary' : 'accent'}
          />
          <Text style={styles.helper}>{demoScenarioSummary}</Text>
          <View style={styles.scenarioGrid}>
            {scenarios.map((scenario) => (
              <DemoScenarioCard
                key={scenario.key}
                detail={scenario.detail}
                onPress={applyDemoScenario}
                scenario={scenario.key}
                selected={demoScenario === scenario.key}
                title={scenario.title}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>MedBridge</Text>
          <Text style={styles.helper}>Mock demo build</Text>
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
