import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { TranslationKey } from '../constants/languages';
import { CaregiverAlertCard } from '../components/CaregiverAlertCard';
import { DoseActionRow } from '../components/DoseActionRow';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { MedicationCard } from '../components/MedicationCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { CaregiverAlertState, MedicationItem, MedicationPeriod } from '../types/medication';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'ScheduleTab'> & {
  t: (key: TranslationKey) => string;
  scheduleMedicines: MedicationItem[];
  caregiverAlert: CaregiverAlertState;
  apiNotice: string | null;
  stats: {
    total: number;
    taken: number;
    missed: number;
    unconfirmed: number;
    pending: number;
    adherencePercent: number;
  };
  updateDoseStatus: (id: string, status: MedicationItem['status']) => Promise<void>;
  openReminder: (id?: string) => void;
};

const periods: MedicationPeriod[] = ['Morning', 'Afternoon', 'Night'];

export function MedicationScheduleScreen({ navigation, scheduleMedicines, caregiverAlert, stats, updateDoseStatus, openReminder, apiNotice }: Props) {
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
          title="Schedule"
          subtitle="Morning, afternoon, night."
          rightAction={<HeaderIconButton icon="settings" onPress={() => navigation.navigate('Settings')} />}
        />

        {apiNotice ? <EmptyStateCard title="Using demo data" detail={apiNotice} /> : null}
        {isLaunchingReminder ? <SuccessStateCard title="Opening" detail="Starting reminder." /> : null}

        <View style={styles.summaryCard}>
          <View style={styles.summaryBadges}>
            <StatusBadge icon="check-circle" label={`${stats.taken} Taken`} variant="accent" />
            <StatusBadge icon="clock" label={`${stats.pending} Pending`} variant="primary" />
            <StatusBadge icon="help-circle" label={`${stats.unconfirmed} Unconfirmed`} variant="secondary" />
            <StatusBadge icon="alert-circle" label={`${stats.missed} Missed`} variant="neutral" />
          </View>
          <PrimaryButton icon="bell" label="Next dose" onPress={() => launchReminder()} />
        </View>

        {allHandled ? <EmptyStateCard detail="All medicines handled." icon="check-circle" title="Done" /> : null}
        {caregiverAlert.active ? <CaregiverAlertCard alert={caregiverAlert} /> : null}

        {periods.map((period) => {
          const items = scheduleMedicines.filter((item) => item.period === period);
          if (items.length === 0) {
            return null;
          }

          return (
            <View key={period} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{period}</Text>
                <StatusBadge
                  icon="clock"
                  label={items.some((item) => item.status === 'Pending') ? 'Pending' : 'Updated'}
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
                          <PrimaryButton icon="bell" label="Reminder" onPress={() => launchReminder(item.id)} />
                        ) : null}
                        <DoseActionRow
                          onMissed={() => void updateDoseStatus(item.id, 'Missed')}
                          onTaken={() => void updateDoseStatus(item.id, 'Taken')}
                          onUnconfirmed={() => void updateDoseStatus(item.id, 'Unconfirmed')}
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
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
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
  summaryBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  list: {
    gap: theme.spacing.sm,
  },
  cardActions: {
    gap: theme.spacing.sm,
  },
});
