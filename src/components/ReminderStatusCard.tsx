import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { MedicationItem } from '../types/medication';
import { StatusBadge } from './StatusBadge';

type ReminderStatusCardProps = {
  nextReminder: MedicationItem | null;
};

export function ReminderStatusCard({ nextReminder }: ReminderStatusCardProps) {
  const isComplete = !nextReminder;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Next reminder</Text>
        <Feather color={theme.colors.primary} name={isComplete ? 'check-circle' : 'clock'} size={18} />
      </View>
      <Text style={styles.title}>{isComplete ? 'All doses completed' : nextReminder.name}</Text>
      <Text style={styles.body}>
        {isComplete
          ? 'Everything for today is complete. The patient can rest easy for now.'
          : `${nextReminder.timing} · ${nextReminder.foodTiming}`}
      </Text>
      <StatusBadge
        icon={isComplete ? 'check-circle' : nextReminder.status === 'Pending' ? 'clock' : 'help-circle'}
        label={isComplete ? 'Completed day' : nextReminder.status}
        variant={isComplete ? 'accent' : nextReminder.status === 'Pending' ? 'primary' : 'secondary'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: theme.colors.secondary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
