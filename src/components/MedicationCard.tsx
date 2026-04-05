import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { MedicationStatus } from '../types/medication';
import { StatusBadge } from './StatusBadge';

type MedicationCardProps = {
  name: string;
  dosage: string;
  timing: string;
  instructions: string;
  status: MedicationStatus;
  actions?: ReactNode;
};

const statusVariantMap = {
  'Due now': 'primary',
  Scheduled: 'secondary',
  Taken: 'accent',
  Missed: 'neutral',
} as const;

export function MedicationCard({
  name,
  dosage,
  timing,
  instructions,
  status,
  actions,
}: MedicationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>
            {dosage} • {timing}
          </Text>
        </View>
        <StatusBadge label={status} variant={statusVariantMap[status]} />
      </View>
      <Text style={styles.instructions}>{instructions}</Text>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
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
  topRow: {
    gap: theme.spacing.sm,
  },
  copy: {
    gap: theme.spacing.xs,
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '600',
  },
  instructions: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
