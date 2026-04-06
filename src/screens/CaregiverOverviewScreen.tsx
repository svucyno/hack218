import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatStatusLabel, getTranslation, localizeKnownText, type AppLanguage, type TranslationKey } from '../constants/languages';
import { ActivityTimelineItem } from '../components/ActivityTimelineItem';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { ReminderStatusCard } from '../components/ReminderStatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';
import type { AdherenceActivityItem, CaregiverAlertState, MedicationItem } from '../types/medication';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'CaregiverTab'> & {
  language: AppLanguage;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  scheduleMedicines: MedicationItem[];
  nextReminder: MedicationItem | null;
  caregiverAlert: CaregiverAlertState;
  activityHistory: AdherenceActivityItem[];
  apiNotice: string | null;
  stats: { total: number; taken: number; missed: number; unconfirmed: number; pending: number; adherencePercent: number };
};

export function CaregiverOverviewScreen({ navigation, language, t, nextReminder, caregiverAlert, activityHistory, scheduleMedicines, apiNotice, stats }: Props) {
  const overallStatus = caregiverAlert.active ? 'Alert' : 'Stable';
  const followUpItems = scheduleMedicines.filter((item) => item.status === 'Pending' || item.status === 'Unconfirmed');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={t('caregiver.eyebrow')} title={t('caregiver.title')} subtitle={t('caregiver.subtitle')} rightAction={<HeaderIconButton icon="settings" onPress={() => navigation.navigate('Settings')} />} />

        {apiNotice ? <EmptyStateCard title={t('home.usingDemoData')} detail={localizeKnownText(language, apiNotice)} /> : null}

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.avatarWrap}><Feather color={theme.colors.primary} name="user" size={18} /></View>
            <StatusBadge icon={overallStatus === 'Alert' ? 'bell' : 'shield'} label={formatStatusLabel(language, overallStatus)} variant={overallStatus === 'Alert' ? 'secondary' : 'accent'} />
          </View>
          <Text style={styles.patientName}>Lakshmi Devi</Text>
          <Text style={styles.patientMeta}>{t('caregiver.adherenceLine', { percent: stats.adherencePercent })}</Text>
        </View>

        {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} language={language} /> : null}
        {!caregiverAlert.active && stats.pending === 0 && stats.missed === 0 && stats.unconfirmed === 0 ? <EmptyStateCard detail={t('caregiver.onTrackDetail')} icon="shield" title={t('caregiver.onTrackTitle')} /> : null}

        <View style={styles.metricRow}>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>{formatStatusLabel(language, 'taken')}</Text><Text style={styles.metricValue}>{stats.taken}</Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>{formatStatusLabel(language, 'missed')}</Text><Text style={styles.metricValue}>{stats.missed}</Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>{formatStatusLabel(language, 'unconfirmed')}</Text><Text style={styles.metricValue}>{stats.unconfirmed}</Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>{formatStatusLabel(language, 'pending')}</Text><Text style={styles.metricValue}>{stats.pending}</Text></View>
        </View>

        <ReminderStatusCard language={language} nextReminder={nextReminder} />
        <DailyProgressCard language={language} missed={stats.missed} taken={stats.taken} total={stats.total} unconfirmed={stats.unconfirmed} />

        <View style={styles.followUpCard}>
          <Text style={styles.cardTitle}>{t('caregiver.followUp')}</Text>
          {followUpItems.length === 0 ? (
            <Text style={styles.cardHelper}>{t('common.noPendingItems')}</Text>
          ) : (
            followUpItems.slice(0, 2).map((item) => (
              <View key={item.id} style={styles.followUpItem}>
                <View style={styles.followUpCopy}>
                  <Text numberOfLines={1} style={styles.followUpName}>{item.name}</Text>
                  <Text style={styles.followUpMeta}>{item.timing}</Text>
                </View>
                <StatusBadge icon={item.status === 'Pending' ? 'clock' : 'help-circle'} label={formatStatusLabel(language, item.status)} variant={item.status === 'Pending' ? 'primary' : 'secondary'} />
              </View>
            ))
          )}
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>{t('caregiver.recent')}</Text>
          {activityHistory.length === 0 ? <EmptyStateCard detail={t('common.noActivity')} title={t('caregiver.recent')} /> : activityHistory.slice(0, 3).map((item) => <ActivityTimelineItem key={item.id} item={item} language={language} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl },
  heroCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.xs, padding: theme.spacing.lg, ...theme.shadows.card },
  heroHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
  avatarWrap: { alignItems: 'center', backgroundColor: theme.colors.accent, borderRadius: theme.radius.md, height: 40, justifyContent: 'center', width: 40 },
  patientName: { color: theme.colors.textPrimary, fontSize: theme.typography.bodyLarge, fontWeight: '800', lineHeight: 24 },
  patientMeta: { color: theme.colors.secondary, fontSize: theme.typography.bodySmall, fontWeight: '800' },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  metricCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: 2, minWidth: '47%', padding: theme.spacing.md, ...theme.shadows.soft },
  metricLabel: { color: theme.colors.textSecondary, fontSize: theme.typography.caption, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  metricValue: { color: theme.colors.textPrimary, fontSize: theme.typography.title, fontWeight: '800', lineHeight: 30 },
  followUpCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.sm, padding: theme.spacing.lg, ...theme.shadows.soft },
  cardTitle: { color: theme.colors.textPrimary, fontSize: theme.typography.body, fontWeight: '800', lineHeight: 22 },
  cardHelper: { color: theme.colors.textSecondary, fontSize: theme.typography.bodySmall, lineHeight: 20 },
  followUpItem: { alignItems: 'center', backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.md, flexDirection: 'row', gap: theme.spacing.md, justifyContent: 'space-between', padding: theme.spacing.sm },
  followUpCopy: { flex: 1, gap: 2 },
  followUpName: { color: theme.colors.textPrimary, fontSize: theme.typography.bodySmall, fontWeight: '800', lineHeight: 18 },
  followUpMeta: { color: theme.colors.textSecondary, fontSize: theme.typography.caption, lineHeight: 18 },
  timelineCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.sm, padding: theme.spacing.lg, ...theme.shadows.soft },
});
