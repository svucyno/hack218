import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { ActivityTimelineItem } from '../components/ActivityTimelineItem';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { ReminderStatusCard } from '../components/ReminderStatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';
import type {
  AdherenceActivityItem,
  CaregiverAlertState,
  MedicationItem,
} from '../types/medication';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'CaregiverTab'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  scheduleMedicines: MedicationItem[];
  nextReminder: MedicationItem | null;
  caregiverAlert: CaregiverAlertState;
  caregiverAlertHistory: AdherenceActivityItem[];
  activityHistory: AdherenceActivityItem[];
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
};

export function CaregiverOverviewScreen({
  language,
  setLanguage,
  nextReminder,
  caregiverAlert,
  activityHistory,
  scheduleMedicines,
  stats,
}: Props) {
  const overallStatus = caregiverAlert.active
    ? caregiverAlert.level === 'alert'
      ? 'Escalated'
      : 'Needs attention'
    : stats.pending === 0 && stats.missed === 0 && stats.unconfirmed === 0
      ? 'Stable'
      : 'Stable';

  const summarySentence = caregiverAlert.active
    ? caregiverAlert.reason
    : stats.pending === 0 && stats.missed === 0 && stats.unconfirmed === 0
      ? 'All recorded doses are on track today.'
      : `${stats.missed} missed and ${stats.unconfirmed} unconfirmed doses may need follow-up.`;

  const followUpItems = scheduleMedicines.filter(
    (item) => item.status === 'Pending' || item.status === 'Unconfirmed',
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Caregiver"
          title="Patient status"
          subtitle="A quick view of whether follow-up is needed today."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        />

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.avatarWrap}>
              <Feather color={theme.colors.primary} name="user" size={20} />
            </View>
            <StatusBadge
              icon={overallStatus === 'Escalated' ? 'alert-circle' : 'shield'}
              label={overallStatus}
              variant={overallStatus === 'Escalated' ? 'secondary' : 'accent'}
            />
          </View>
          <Text style={styles.patientName}>Lakshmi Devi</Text>
          <Text style={styles.patientMeta}>{`${stats.adherencePercent}% adherence today`}</Text>
          <Text style={styles.heroBody}>{summarySentence}</Text>
        </View>

        {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} /> : null}

        {!caregiverAlert.active && stats.pending === 0 && stats.missed === 0 && stats.unconfirmed === 0 ? (
          <EmptyStateCard detail="All recorded doses are on track today." icon="shield" title="Patient stable today" />
        ) : null}

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Taken</Text>
            <Text style={styles.metricValue}>{stats.taken}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Missed</Text>
            <Text style={styles.metricValue}>{stats.missed}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Unconfirmed</Text>
            <Text style={styles.metricValue}>{stats.unconfirmed}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pending</Text>
            <Text style={styles.metricValue}>{stats.pending}</Text>
          </View>
        </View>

        <DailyProgressCard missed={stats.missed} taken={stats.taken} total={stats.total} unconfirmed={stats.unconfirmed} />

        <View style={styles.followUpSection}>
          <Text style={styles.sectionTitle}>Follow-up</Text>
          <ReminderStatusCard nextReminder={nextReminder} />
          <View style={styles.followUpCard}>
            <Text style={styles.followUpTitle}>Medicines to watch</Text>
            {followUpItems.length === 0 ? (
              <Text style={styles.followUpBody}>No pending or unconfirmed medicines right now.</Text>
            ) : (
              followUpItems.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.followUpItem}>
                  <View style={styles.followUpCopy}>
                    <Text style={styles.followUpName}>{item.name}</Text>
                    <Text style={styles.followUpMeta}>{`${item.timing} · ${item.foodTiming}`}</Text>
                  </View>
                  <StatusBadge
                    icon={item.status === 'Pending' ? 'clock' : 'help-circle'}
                    label={item.status}
                    variant={item.status === 'Pending' ? 'primary' : 'secondary'}
                  />
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <View style={styles.timelineCard}>
            {activityHistory.length === 0 ? (
              <EmptyStateCard detail="No reminder or adherence activity has been recorded yet." title="No recent activity" />
            ) : (
              activityHistory.slice(0, 3).map((item) => <ActivityTimelineItem key={item.id} item={item} />)
            )}
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
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  avatarWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  patientName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  patientMeta: {
    color: theme.colors.secondary,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  heroBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metricCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    minWidth: '47%',
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.display,
    fontWeight: '800',
    lineHeight: 34,
  },
  followUpSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  followUpCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  followUpTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  followUpBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  followUpItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  followUpCopy: {
    flex: 1,
    gap: 2,
  },
  followUpName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  followUpMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
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
