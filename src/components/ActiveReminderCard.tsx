import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { MedicationItem } from '../types/medication';
import { PrimaryButton } from './PrimaryButton';
import { StatusBadge } from './StatusBadge';

type ActiveReminderCardProps = {
  reminder: MedicationItem | null;
  onStart?: () => void;
};

export function ActiveReminderCard({ reminder, onStart }: ActiveReminderCardProps) {
  const complete = !reminder;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather color={theme.colors.primary} name={complete ? 'check-circle' : 'bell'} size={18} />
        </View>
        <StatusBadge
          icon={complete ? 'shield' : 'clock'}
          label={complete ? 'Done' : 'Next dose'}
          variant={complete ? 'accent' : 'primary'}
        />
      </View>
      <Text style={styles.title}>{complete ? 'All done' : reminder.name}</Text>
      <Text style={styles.body}>{complete ? 'No active reminders.' : `${reminder.timing} · ${reminder.dosage}`}</Text>
      {!complete ? <Text style={styles.helper}>{reminder.foodTiming}</Text> : null}
      {!complete ? <PrimaryButton icon="play-circle" label="Start" onPress={onStart} /> : null}
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
    ...theme.shadows.card,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 24,
  },
  body: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  helper: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
});
