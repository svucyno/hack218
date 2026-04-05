import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { ActiveReminderCard } from '../components/ActiveReminderCard';
import { AdherenceSummaryCard } from '../components/AdherenceSummaryCard';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { DemoScenarioCard } from '../components/DemoScenarioCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { ScenarioBanner } from '../components/ScenarioBanner';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { DemoScenarioKey } from '../types/intake';
import type {
  AdherenceActivityItem,
  CaregiverAlertState,
  MedicationItem,
} from '../types/medication';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'HomeTab'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  scheduleMedicines: MedicationItem[];
  nextReminder: MedicationItem | null;
  caregiverAlert: CaregiverAlertState;
  caregiverAlertHistory: AdherenceActivityItem[];
  activityHistory: AdherenceActivityItem[];
  openReminder: (id?: string) => void;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
  resetDemoState: () => void;
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
};

const scenarios: Array<{ key: DemoScenarioKey; title: string; detail: string }> = [
  { key: 'smooth', title: 'Smooth Adherence', detail: 'Most doses taken.' },
  { key: 'missed', title: 'Missed Doses', detail: 'Caregiver needs attention.' },
  { key: 'no-response', title: 'No Response', detail: 'Reminder becomes unconfirmed.' },
  { key: 'escalated', title: 'Escalated', detail: 'Concern is clearly visible.' },
];

export function HomeDashboardScreen({
  navigation,
  language,
  setLanguage,
  nextReminder,
  caregiverAlert,
  openReminder,
  applyDemoScenario,
  resetDemoState,
  demoScenario,
  demoScenarioSummary,
  stats,
}: Props) {
  const [isLaunchingReminder, setIsLaunchingReminder] = useState(false);
  const allHandled = stats.pending === 0 && stats.unconfirmed === 0;

  const launchReminder = () => {
    if (!nextReminder) {
      return;
    }

    setIsLaunchingReminder(true);
    openReminder();
    setTimeout(() => {
      setIsLaunchingReminder(false);
      navigation.navigate('ReminderDetail');
    }, 350);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Home"
          title="Hello, Lakshmi"
          subtitle="Your next medicine and today’s progress are shown here."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        />

        <ScenarioBanner
          active={Boolean(demoScenario)}
          detail={demoScenarioSummary}
          title={demoScenario ? 'Demo scenario active' : 'Demo mode ready'}
        />

        {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} /> : null}

        {isLaunchingReminder ? (
          <SuccessStateCard title="Opening reminder" detail="Preparing the simple patient reminder now." />
        ) : (
          <ActiveReminderCard onStart={launchReminder} reminder={nextReminder} />
        )}

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Today's medicines</Text>
              <Feather color={theme.colors.primary} name="calendar" size={18} />
            </View>
            <Text style={styles.summaryValue}>{stats.total}</Text>
            <Text style={styles.summaryHelper}>
              {allHandled ? 'All medicines handled for today.' : `${stats.pending} doses still need attention.`}
            </Text>
          </View>

          <AdherenceSummaryCard
            adherencePercent={stats.adherencePercent}
            missed={stats.missed}
            pending={stats.pending}
            taken={stats.taken}
            total={stats.total}
          />
        </View>

        {allHandled ? (
          <EmptyStateCard
            detail="All scheduled medicines are handled for today. The patient routine looks stable."
            icon="check-circle"
            title="Day complete"
          />
        ) : null}

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('ScheduleTab')}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
            >
              <View style={styles.actionIcon}>
                <Feather color={theme.colors.secondary} name="calendar" size={18} />
              </View>
              <Text style={styles.actionTitle}>Open schedule</Text>
              <Text style={styles.actionDetail}>Update doses</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('UploadTab')}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
            >
              <View style={styles.actionIcon}>
                <Feather color={theme.colors.secondary} name="upload" size={18} />
              </View>
              <Text style={styles.actionTitle}>Upload document</Text>
              <Text style={styles.actionDetail}>Review medicines</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.demoSection}>
          <View style={styles.demoHeader}>
            <Text style={styles.sectionTitle}>Demo mode</Text>
            <SecondaryButton fullWidth={false} icon="rotate-ccw" label="Reset" onPress={resetDemoState} />
          </View>
          <View style={styles.demoGrid}>
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
  summaryGrid: {
    gap: theme.spacing.md,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    fontWeight: '700',
  },
  summaryValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.display,
    fontWeight: '800',
    lineHeight: 36,
  },
  summaryHelper: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  actionsSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  actionPressed: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  actionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  actionDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
  demoSection: {
    gap: theme.spacing.md,
  },
  demoHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  demoGrid: {
    gap: theme.spacing.sm,
  },
});
