import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { MedicationStatus } from '../types/medication';
import { StatusBadge } from './StatusBadge';

type MedicationCardProps = {
  name: string;
  dosage: string;
  timing: string;
  foodTiming: string;
  note: string;
  status: MedicationStatus;
  actions?: React.ReactNode;
};

const statusVariantMap = {
  Pending: { variant: 'primary', icon: 'clock' },
  Unconfirmed: { variant: 'secondary', icon: 'help-circle' },
  Taken: { variant: 'accent', icon: 'check-circle' },
  Missed: { variant: 'neutral', icon: 'alert-circle' },
} as const;

export function MedicationCard({
  name,
  dosage,
  timing,
  foodTiming,
  note,
  status,
  actions,
}: MedicationCardProps) {
  const badge = statusVariantMap[status];

  return (
    <View style={[styles.card, status === 'Pending' && styles.cardPending, status === 'Missed' && styles.cardMissed]}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>{dosage}</Text>
        </View>
        <StatusBadge icon={badge.icon} label={status} variant={badge.variant} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoPill}>
          <Feather color={theme.colors.secondary} name="clock" size={14} />
          <Text style={styles.infoText}>{timing}</Text>
        </View>
        <View style={styles.infoPill}>
          <Feather color={theme.colors.secondary} name="coffee" size={14} />
          <Text style={styles.infoText}>{foodTiming}</Text>
        </View>
      </View>

      <Text style={styles.note}>{note}</Text>
      {status === 'Missed' ? <Text style={styles.helper}>Missed dose. A caregiver check-in may help.</Text> : null}
      {status === 'Unconfirmed' ? <Text style={styles.helper}>No response yet. This dose still needs confirmation.</Text> : null}
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
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },
  cardPending: {
    borderColor: theme.colors.primary,
  },
  cardMissed: {
    borderColor: theme.colors.secondary,
  },
  topRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  infoPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 7,
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySmall,
    fontWeight: '700',
  },
  note: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
  helper: {
    color: theme.colors.secondary,
    fontSize: theme.typography.bodySmall,
    fontWeight: '700',
    lineHeight: 20,
  },
  actions: {
    gap: theme.spacing.sm,
    marginTop: 2,
  },
});
