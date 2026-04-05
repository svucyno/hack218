import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
          <Feather color={theme.colors.primary} name={complete ? 'check-circle' : 'bell'} size={20} />
        </View>
        <StatusBadge
          icon={complete ? 'shield' : 'volume-2'}
          label={complete ? 'All reminders done' : 'Reminder ready'}
          variant={complete ? 'accent' : 'primary'}
        />
      </View>
      <Text style={styles.title}>{complete ? 'All reminders completed for today' : 'Medicine time'}</Text>
      <Text style={styles.body}>
        {complete
          ? 'The patient has handled every current reminder in this demo session.'
          : `${reminder.name} · ${reminder.dosage} · ${reminder.timing}`}
      </Text>
      {!complete ? <Text style={styles.helper}>{reminder.foodTiming}</Text> : null}
      {!complete ? <PrimaryButton icon="play-circle" label="Start Reminder Demo" onPress={onStart} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
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
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  body: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 26,
  },
  helper: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
