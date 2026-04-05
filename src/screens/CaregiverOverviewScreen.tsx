import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CaregiverOverview'> & {
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
  caregiverAlertHistory,
  activityHistory,
  scheduleMedicines,
  stats,
}: Props) {
  const overallStatus = caregiverAlert.active
    ? caregiverAlert.level === 'alert'
      ? 'Escalated'
      : 'Needs attention'
    : stats.adherencePercent >= 75 && stats.missed === 0
      ? 'Stable'
      : 'Needs attention';

  const summarySentence = caregiverAlert.active
    ? caregiverAlert.reason
    : stats.pending === 0 && stats.unconfirmed === 0 && stats.missed === 0
      ? 'All recorded doses are on track today.'
      : `${stats.missed} missed and ${stats.unconfirmed} unconfirmed doses may need follow-up today.`;

  const followUpItems = scheduleMedicines.filter(
    (item) => item.status === 'Pending' || item.status === 'Unconfirmed',
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Caregiver overview"
        subtitle="A quick daily view to understand whether the patient is stable or whether support is needed."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        helper={
          <StatusBadge
            icon={overallStatus === 'Stable' ? 'shield' : 'bell'}
            label={overallStatus}
            variant={overallStatus === 'Stable' ? 'accent' : 'secondary'}
          />
        }
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.avatarWrap}>
            <Feather color={theme.colors.primary} name="user" size={24} />
          </View>
          <StatusBadge
            icon={overallStatus === 'Escalated' ? 'alert-circle' : overallStatus === 'Stable' ? 'check-circle' : 'help-circle'}
            label={overallStatus}
            variant={overallStatus === 'Stable' ? 'accent' : 'secondary'}
          />
        </View>
        <Text style={styles.patientName}>Lakshmi Devi</Text>
        <Text style={styles.patientMeta}>{`${stats.adherencePercent}% adherence today`}</Text>
        <Text style={styles.heroBody}>{summarySentence}</Text>
      </View>

      {stats.pending === 0 && stats.unconfirmed === 0 && stats.missed === 0 ? (
        <EmptyStateCard detail="All recorded doses are on track today." icon="shield" title="Patient stable today" />
      ) : null}

      {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} /> : null}

      <View style={styles.actionCard}>
        <Text style={styles.sectionTitle}>Suggested caregiver actions</Text>
        <View style={styles.actionList}>
          <View style={styles.actionItem}>
            <StatusBadge icon="phone" label="Call patient" variant="accent" />
            <Text style={styles.actionText}>Check whether the current or missed dose was actually taken.</Text>
          </View>
          <View style={styles.actionItem}>
            <StatusBadge icon="clock" label="Check next dose" variant="accent" />
            <Text style={styles.actionText}>Watch the upcoming medicine time and confirm the routine.</Text>
          </View>
          <View style={styles.actionItem}>
            <StatusBadge icon="book-open" label="Review routine" variant="accent" />
            <Text style={styles.actionText}>Reinforce before-food and after-food instructions if there is confusion.</Text>
          </View>
        </View>
      </View>

      <View style={styles.gridSection}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total doses</Text>
          <Text style={styles.metricValue}>{stats.total}</Text>
        </View>
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
        <View style={styles.metricCardWide}>
          <Text style={styles.metricLabel}>Pending</Text>
          <Text style={styles.metricValue}>{stats.pending}</Text>
        </View>
      </View>

      <DailyProgressCard
        missed={stats.missed}
        taken={stats.taken}
        total={stats.total}
        unconfirmed={stats.unconfirmed}
      />

      <View style={styles.followUpSection}>
        <Text style={styles.sectionTitle}>Patient follow-up</Text>
        <ReminderStatusCard nextReminder={nextReminder} />
        <View style={styles.followUpCard}>
          <Text style={styles.followUpTitle}>Medicines needing attention</Text>
          {followUpItems.length === 0 ? (
            <Text style={styles.followUpBody}>All recorded doses are on track today.</Text>
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

      <View style={styles.timelineSection}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.timelineCard}>
          {activityHistory.length === 0 ? (
            <EmptyStateCard detail="No activity has been recorded yet in this session." title="No recent activity" />
          ) : (
            activityHistory.slice(0, 5).map((item) => <ActivityTimelineItem key={item.id} item={item} />)
          )}
        </View>
      </View>

      {caregiverAlertHistory.length > 0 ? (
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Alert history</Text>
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
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  avatarWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  patientName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title,
    fontWeight: '800',
    lineHeight: 32,
  },
  patientMeta: {
    color: theme.colors.secondary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  heroBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  actionList: {
    gap: theme.spacing.sm,
  },
  actionItem: {
    gap: theme.spacing.xs,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  gridSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metricCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
    minWidth: '47%',
    padding: theme.spacing.lg,
  },
  metricCardWide: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    width: '100%',
  },
  metricLabel: {
    color: theme.colors.secondary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.display,
    fontWeight: '800',
    lineHeight: 36,
  },
  followUpSection: {
    gap: theme.spacing.md,
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
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  followUpBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
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
  timelineSection: {
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
