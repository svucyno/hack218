import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatInstructionLabel, formatStatusLabel, getTranslation, type AppLanguage } from '../constants/languages';
import { theme } from '../theme';
import type { MedicationItem } from '../types/medication';
import { StatusBadge } from './StatusBadge';

type ReminderStatusCardProps = {
  language: AppLanguage;
  nextReminder: MedicationItem | null;
};

export function ReminderStatusCard({ language, nextReminder }: ReminderStatusCardProps) {
  const isComplete = !nextReminder;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{getTranslation(language, 'home.nextDose')}</Text>
        <Feather color={theme.colors.primary} name={isComplete ? 'check-circle' : 'clock'} size={18} />
      </View>
      <Text style={styles.title}>{isComplete ? getTranslation(language, 'common.done') : nextReminder.name}</Text>
      <Text style={styles.body}>{isComplete ? getTranslation(language, 'common.noPendingDoses') : `${nextReminder.timing} · ${formatInstructionLabel(language, nextReminder.foodTiming)}`}</Text>
      <StatusBadge
        icon={isComplete ? 'check-circle' : nextReminder.status === 'Pending' ? 'clock' : 'help-circle'}
        label={isComplete ? formatStatusLabel(language, 'done') : formatStatusLabel(language, nextReminder.status)}
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
