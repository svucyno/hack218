import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { StatusBadge } from './StatusBadge';

type AdherenceSummaryCardProps = {
  taken: number;
  total: number;
  pending: number;
  missed: number;
  adherencePercent: number;
};

export function AdherenceSummaryCard({ taken, total, pending, missed, adherencePercent }: AdherenceSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Adherence snapshot</Text>
        <Feather color={theme.colors.primary} name="activity" size={18} />
      </View>
      <Text style={styles.percent}>{`${adherencePercent}%`}</Text>
      <Text style={styles.body}>{`${taken} of ${total} doses marked taken today`}</Text>
      <View style={styles.badges}>
        <StatusBadge icon="check-circle" label={`${taken} taken`} variant="accent" />
        <StatusBadge icon="clock" label={`${pending} pending`} variant="primary" />
        <StatusBadge icon="alert-circle" label={`${missed} missed`} variant="neutral" />
      </View>
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
  percent: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.display,
    fontWeight: '800',
    lineHeight: 36,
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
