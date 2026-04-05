import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { ActiveReminderCard } from '../components/ActiveReminderCard';
import { ActivityTimelineItem } from '../components/ActivityTimelineItem';
import { AdherenceSummaryCard } from '../components/AdherenceSummaryCard';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { DemoScenarioCard } from '../components/DemoScenarioCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { ReminderStatusCard } from '../components/ReminderStatusCard';
import { ScenarioBanner } from '../components/ScenarioBanner';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type {
  AdherenceActivityItem,
  CaregiverAlertState,
  MedicationItem,
} from '../types/medication';
import type { DemoScenarioKey } from '../types/intake';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
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

type QuickRoute = 'MedicationSchedule' | 'UploadDocument' | 'CaregiverOverview';

type QuickCard = {
  title: string;
  detail: string;
  icon: 'calendar' | 'upload' | 'users';
  route: QuickRoute;
};

const scenarios: Array<{ key: DemoScenarioKey; title: string; detail: string }> = [
  { key: 'smooth', title: 'Smooth Adherence', detail: 'Most doses taken and no caregiver escalation.' },
  { key: 'missed', title: 'Missed Dose Scenario', detail: 'Missed doses create visible caregiver concern.' },
  { key: 'no-response', title: 'No Response Scenario', detail: 'Reminder goes unanswered and doses become unconfirmed.' },
  { key: 'escalated', title: 'Escalated Caregiver Scenario', detail: 'Multiple issues make intervention clearly visible.' },
];

export function HomeDashboardScreen({
  navigation,
  language,
  setLanguage,
  nextReminder,
  caregiverAlert,
  caregiverAlertHistory,
  activityHistory,
  openReminder,
  applyDemoScenario,
  resetDemoState,
  demoScenario,
  demoScenarioSummary,
  stats,
}: Props) {
  const [isLaunchingReminder, setIsLaunchingReminder] = useState(false);

  const quickCards: QuickCard[] = [
    {
      title: 'Upload prescription',
      detail: 'Add a discharge sheet or prescription photo',
      icon: 'upload',
      route: 'UploadDocument',
    },
    {
      title: 'View today\'s schedule',
      detail: 'Update medicine status one dose at a time',
      icon: 'calendar',
      route: 'MedicationSchedule',
    },
    {
      title: 'Caregiver status',
      detail: 'Check whether a follow-up alert is active',
      icon: 'users',
      route: 'CaregiverOverview',
    },
  ];

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
    }, 450);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="MedBridge"
        title="Good morning, Lakshmi"
        subtitle="Your dashboard updates as each medicine is marked taken, missed, unconfirmed, or handled from a reminder."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        helper={
          <StatusBadge
            icon={caregiverAlert.active ? 'bell' : 'shield'}
            label={caregiverAlert.active ? 'Caregiver follow-up active' : 'No active escalation'}
            variant={caregiverAlert.active ? 'secondary' : 'accent'}
          />
        }
      />

      <ScenarioBanner
        active={Boolean(demoScenario)}
        detail={demoScenarioSummary}
        title={demoScenario ? 'Guided demo mode is active' : 'Guided demo mode is ready'}
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <Feather color={theme.colors.primary} name="sunrise" size={22} />
          </View>
          <StatusBadge icon="clock" label={`${stats.pending} pending now`} variant="primary" />
        </View>
        <Text style={styles.heroTitle}>Today&apos;s medicines</Text>
        <Text style={styles.heroBody}>
          {allHandled
            ? 'All scheduled medicines are handled for today.'
            : `${stats.taken} taken, ${stats.unconfirmed} unconfirmed, and ${stats.missed} missed. Reminder actions update the plan immediately.`}
        </Text>
      </View>

      <View style={styles.demoSection}>
        <View style={styles.demoHeader}>
          <Text style={styles.sectionTitle}>Guided demo mode</Text>
          <SecondaryButton fullWidth={false} icon="rotate-ccw" label="Reset demo" onPress={resetDemoState} />
        </View>
        <View style={styles.demoList}>
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

      {isLaunchingReminder ? (
        <SuccessStateCard title="Opening reminder" detail="Preparing the low-literacy reminder interaction for the next dose." />
      ) : (
        <ActiveReminderCard onStart={launchReminder} reminder={nextReminder} />
      )}

      <View style={styles.dualRow}>
        <ReminderStatusCard nextReminder={nextReminder} />
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
          detail="All reminders completed for today. The patient routine looks stable and calm."
          icon="check-circle"
          title="Day complete"
        />
      ) : null}

      {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} /> : null}

      <View style={styles.quickSection}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickList}>
          {quickCards.map((card) => (
            <Pressable
              key={card.title}
              accessibilityRole="button"
              onPress={() => navigation.navigate(card.route)}
              style={({ pressed }) => [styles.quickCard, pressed && styles.quickCardPressed]}
            >
              <View style={styles.quickIcon}>
                <Feather color={theme.colors.secondary} name={card.icon} size={20} />
              </View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>{card.title}</Text>
                <Text style={styles.quickDetail}>{card.detail}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent reminder actions</Text>
        <View style={styles.timelineCard}>
          {activityHistory.length === 0 ? (
            <EmptyStateCard detail="No reminder activity yet. Start a reminder demo to begin." title="No activity yet" />
          ) : (
            activityHistory.slice(0, 4).map((item) => <ActivityTimelineItem key={item.id} item={item} />)
          )}
        </View>
      </View>

      {caregiverAlertHistory.length > 0 ? (
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Caregiver alert history</Text>
          <View style={styles.timelineCard}>
            {caregiverAlertHistory.map((item) => (
              <ActivityTimelineItem key={item.id} item={item} />
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.spacing.xl,
    padding: theme.spacing.lg,
    paddingTop: 64,
    paddingBottom: theme.spacing.xxl,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title,
    fontWeight: '800',
    lineHeight: 32,
  },
  heroBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyLarge,
    lineHeight: 28,
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
  demoList: {
    gap: theme.spacing.md,
  },
  dualRow: {
    gap: theme.spacing.md,
  },
  quickSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  quickList: {
    gap: theme.spacing.md,
  },
  quickCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  quickCardPressed: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  quickCopy: {
    flex: 1,
    gap: 4,
  },
  quickTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  quickDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  activitySection: {
    gap: theme.spacing.md,
  },
  timelineCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
});
