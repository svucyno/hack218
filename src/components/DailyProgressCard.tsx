import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { StatusBadge } from './StatusBadge';

type DailyProgressCardProps = {
  taken: number;
  total: number;
  missed: number;
  unconfirmed: number;
};

export function DailyProgressCard({ taken, total, missed, unconfirmed }: DailyProgressCardProps) {
  const safeTotal = Math.max(total, 1);
  const takenFlex = Math.max(taken, 0.5);
  const unconfirmedFlex = Math.max(unconfirmed, 0.5);
  const missedFlex = Math.max(missed, 0.5);
  const remaining = Math.max(total - taken - unconfirmed - missed, 0);
  const remainingFlex = Math.max(remaining, 0.5);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's progress</Text>
        <Feather color={theme.colors.primary} name="bar-chart-2" size={18} />
      </View>
      <View style={styles.barRow}>
        <View style={[styles.segment, styles.segmentTaken, { flex: takenFlex / safeTotal }]} />
        <View
          style={[styles.segment, styles.segmentUnconfirmed, { flex: unconfirmedFlex / safeTotal }]}
        />
        <View style={[styles.segment, styles.segmentMissed, { flex: missedFlex / safeTotal }]} />
        <View style={[styles.segment, styles.segmentPending, { flex: remainingFlex / safeTotal }]} />
      </View>
      <View style={styles.badgeRow}>
        <StatusBadge icon="check-circle" label={`${taken} taken`} variant="accent" />
        <StatusBadge icon="help-circle" label={`${unconfirmed} unconfirmed`} variant="secondary" />
        <StatusBadge icon="alert-circle" label={`${missed} missed`} variant="neutral" />
      </View>
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
    ...theme.shadows.soft,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  barRow: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    height: 14,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  segmentTaken: {
    backgroundColor: theme.colors.secondary,
  },
  segmentUnconfirmed: {
    backgroundColor: '#C7D7EA',
  },
  segmentMissed: {
    backgroundColor: '#D8DCE6',
  },
  segmentPending: {
    backgroundColor: theme.colors.accent,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
