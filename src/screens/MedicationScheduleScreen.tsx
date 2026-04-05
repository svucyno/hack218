import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { DoseActionRow } from '../components/DoseActionRow';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { MedicationCard } from '../components/MedicationCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { CaregiverAlertState, MedicationItem, MedicationPeriod } from '../types/medication';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'ScheduleTab'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  scheduleMedicines: MedicationItem[];
  caregiverAlert: CaregiverAlertState;
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
  updateDoseStatus: (id: string, status: MedicationItem['status']) => void;
  openReminder: (id?: string) => void;
};

const periods: MedicationPeriod[] = ['Morning', 'Afternoon', 'Night'];

export function MedicationScheduleScreen({
  navigation,
  language,
  setLanguage,
  scheduleMedicines,
  caregiverAlert,
  stats,
  updateDoseStatus,
  openReminder,
}: Props) {
  const [isLaunchingReminder, setIsLaunchingReminder] = useState(false);
  const allHandled = stats.pending === 0 && stats.unconfirmed === 0;

  const launchReminder = (id?: string) => {
    setIsLaunchingReminder(true);
    openReminder(id);
    setTimeout(() => {
      setIsLaunchingReminder(false);
      navigation.navigate('ReminderDetail');
    }, 350);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Schedule"
          title="Today’s medicines"
          subtitle="Mark each dose clearly or open the reminder flow."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        />

        {isLaunchingReminder ? (
          <SuccessStateCard title="Launching reminder" detail="Opening the patient reminder for the selected dose." />
        ) : null}

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>At a glance</Text>
            <Feather color={theme.colors.primary} name="clock" size={18} />
          </View>
          <View style={styles.summaryBadges}>
            <StatusBadge icon="check-circle" label={`${stats.taken} taken`} variant="accent" />
            <StatusBadge icon="clock" label={`${stats.pending} pending`} variant="primary" />
            <StatusBadge icon="help-circle" label={`${stats.unconfirmed} unconfirmed`} variant="secondary" />
            <StatusBadge icon="alert-circle" label={`${stats.missed} missed`} variant="neutral" />
          </View>
          <PrimaryButton icon="bell" label="Simulate next reminder" onPress={() => launchReminder()} />
        </View>

        {allHandled ? (
          <EmptyStateCard detail="All scheduled medicines are handled for today." icon="check-circle" title="Day finished" />
        ) : null}

        {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} /> : null}

        {periods.map((period) => {
          const items = scheduleMedicines.filter((item) => item.period === period);
          if (items.length === 0) {
            return null;
          }

          return (
            <View key={period} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{period}</Text>
                  <Text style={styles.sectionSubtitle}>{items.length} dose{items.length > 1 ? 's' : ''}</Text>
                </View>
                <StatusBadge
                  icon="clock"
                  label={items.some((item) => item.status === 'Pending') ? 'Needs action' : 'Updated'}
                  variant={items.some((item) => item.status === 'Pending') ? 'primary' : 'accent'}
                />
              </View>

              <View style={styles.list}>
                {items.map((item) => (
                  <MedicationCard
                    key={item.id}
                    dosage={item.dosage}
                    foodTiming={item.foodTiming}
                    name={item.name}
                    note={item.note}
                    status={item.status}
                    timing={item.timing}
                    actions={
                      <View style={styles.cardActions}>
                        {(item.status === 'Pending' || item.status === 'Unconfirmed') ? (
                          <PrimaryButton icon="bell" label="Open reminder" onPress={() => launchReminder(item.id)} />
                        ) : null}
                        <DoseActionRow
                          onMissed={() => updateDoseStatus(item.id, 'Missed')}
                          onTaken={() => updateDoseStatus(item.id, 'Taken')}
                          onUnconfirmed={() => updateDoseStatus(item.id, 'Unconfirmed')}
                          status={item.status}
                        />
                      </View>
                    }
                  />
                ))}
              </View>
            </View>
          );
        })}
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  summaryBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  sectionSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    marginTop: 2,
  },
  list: {
    gap: theme.spacing.md,
  },
  cardActions: {
    gap: theme.spacing.sm,
  },
});
