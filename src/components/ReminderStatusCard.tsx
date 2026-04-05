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
        <Text style={styles.label}>Next dose</Text>
        <Feather color={theme.colors.primary} name={isComplete ? 'check-circle' : 'clock'} size={18} />
      </View>
      <Text style={styles.title}>{isComplete ? 'Done today' : nextReminder.name}</Text>
      <Text style={styles.body}>{isComplete ? 'No pending doses.' : `${nextReminder.timing} · ${nextReminder.foodTiming}`}</Text>
      <StatusBadge
        icon={isComplete ? 'check-circle' : nextReminder.status === 'Pending' ? 'clock' : 'help-circle'}
        label={isComplete ? 'Done' : nextReminder.status}
        variant={isComplete ? 'accent' : nextReminder.status === 'Pending' ? 'primary' : 'secondary'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
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
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
});
