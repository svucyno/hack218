import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatDemoScenarioTitle, formatStatusLabel, getTranslation, localizeKnownText, type AppLanguage, type TranslationKey } from '../constants/languages';
import { ActiveReminderCard } from '../components/ActiveReminderCard';
import { AdherenceSummaryCard } from '../components/AdherenceSummaryCard';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { ScenarioBanner } from '../components/ScenarioBanner';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { DemoScenarioKey } from '../types/intake';
import type { CaregiverAlertState, MedicationItem } from '../types/medication';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'HomeTab'> & {
  language: AppLanguage;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  nextReminder: MedicationItem | null;
  caregiverAlert: CaregiverAlertState;
  openReminder: (id?: string) => void;
  demoScenario: DemoScenarioKey | null;
  demoScenarioSummary: string;
  apiNotice: string | null;
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
};

const quickActions: Array<{ key: string; icon: keyof typeof Feather.glyphMap; route: 'ScheduleTab' | 'UploadTab' | 'CaregiverTab'; labelKey: TranslationKey }> = [
  { key: 'schedule', icon: 'calendar', route: 'ScheduleTab', labelKey: 'navigation.schedule' },
  { key: 'upload', icon: 'upload', route: 'UploadTab', labelKey: 'navigation.upload' },
  { key: 'caregiver', icon: 'users', route: 'CaregiverTab', labelKey: 'navigation.caregiver' },
];

export function HomeDashboardScreen({ navigation, language, t, nextReminder, caregiverAlert, openReminder, demoScenario, demoScenarioSummary, apiNotice, stats }: Props) {
  const [isLaunchingReminder, setIsLaunchingReminder] = useState(false);
  const allHandled = stats.pending === 0 && stats.unconfirmed === 0;

  const launchReminder = () => {
    if (!nextReminder) return;
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
          eyebrow={t('home.eyebrow')}
          title="Lakshmi"
          subtitle={t('home.subtitle')}
          rightAction={<HeaderIconButton icon="settings" onPress={() => navigation.navigate('Settings')} />}
        />

        {apiNotice ? <EmptyStateCard title={t('home.usingDemoData')} detail={localizeKnownText(language, apiNotice)} /> : null}
        {demoScenario ? <ScenarioBanner active detail={localizeKnownText(language, demoScenarioSummary)} language={language} title={formatDemoScenarioTitle(language, demoScenario)} /> : null}

        {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} language={language} /> : null}

        {isLaunchingReminder ? <SuccessStateCard title={t('common.opening')} detail={t('home.openingReminder')} /> : <ActiveReminderCard language={language} onStart={launchReminder} reminder={nextReminder} />}

        <View style={styles.grid}>
          <View style={styles.todayCard}>
            <View style={styles.todayTop}>
              <Text style={styles.smallLabel}>{t('common.today')}</Text>
              <Feather color={theme.colors.primary} name="sun" size={18} />
            </View>
            <Text style={styles.todayValue}>{stats.total}</Text>
            <View style={styles.todayBadges}>
              <StatusBadge icon="clock" label={`${stats.pending} ${formatStatusLabel(language, 'pending')}`} variant="primary" />
              <StatusBadge icon="check-circle" label={`${stats.taken} ${formatStatusLabel(language, 'taken')}`} variant="accent" />
            </View>
          </View>

          <AdherenceSummaryCard adherencePercent={stats.adherencePercent} language={language} missed={stats.missed} pending={stats.pending} taken={stats.taken} total={stats.total} />
        </View>

        {allHandled ? <EmptyStateCard detail={t('home.doneDetail')} icon="check-circle" title={t('home.doneTitle')} /> : null}

        <View style={styles.actionRow}>
          {quickActions.map((action) => (
            <Pressable key={action.key} accessibilityRole="button" onPress={() => navigation.navigate(action.route)} style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}>
              <View style={styles.actionIcon}>
                <Feather color={theme.colors.secondary} name={action.icon} size={18} />
              </View>
              <Text style={styles.actionLabel}>{t(action.labelKey)}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl },
  grid: { gap: theme.spacing.md },
  todayCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.sm, padding: theme.spacing.lg, ...theme.shadows.card },
  todayTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  smallLabel: { color: theme.colors.secondary, fontSize: theme.typography.caption, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  todayValue: { color: theme.colors.textPrimary, fontSize: theme.typography.display, fontWeight: '800', lineHeight: 34 },
  todayBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  actionRow: { flexDirection: 'row', gap: theme.spacing.sm },
  actionCard: { alignItems: 'center', backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, flex: 1, gap: theme.spacing.sm, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.sm, ...theme.shadows.soft },
  actionPressed: { backgroundColor: theme.colors.accent },
  actionIcon: { alignItems: 'center', backgroundColor: theme.colors.accent, borderRadius: theme.radius.md, height: 38, justifyContent: 'center', width: 38 },
  actionLabel: { color: theme.colors.textPrimary, fontSize: theme.typography.bodySmall, fontWeight: '800', lineHeight: 18, textAlign: 'center' },
});
