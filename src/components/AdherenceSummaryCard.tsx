import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatStatusLabel, getTranslation, type AppLanguage } from '../constants/languages';
import { theme } from '../theme';
import { StatusBadge } from './StatusBadge';

type AdherenceSummaryCardProps = {
  language: AppLanguage;
  taken: number;
  total: number;
  pending: number;
  missed: number;
  adherencePercent: number;
};

export function AdherenceSummaryCard({ language, taken, total, pending, missed, adherencePercent }: AdherenceSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{getTranslation(language, 'home.adherence')}</Text>
        <Feather color={theme.colors.primary} name="activity" size={18} />
      </View>
      <Text style={styles.percent}>{`${adherencePercent}%`}</Text>
      <Text style={styles.body}>{`${taken}/${total} ${formatStatusLabel(language, 'taken').toLowerCase()}`}</Text>
      <View style={styles.badges}>
        <StatusBadge icon="clock" label={`${pending} ${formatStatusLabel(language, 'pending')}`} variant="primary" />
        <StatusBadge icon="alert-circle" label={`${missed} ${formatStatusLabel(language, 'missed')}`} variant="neutral" />
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
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
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
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  percent: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.display,
    fontWeight: '800',
    lineHeight: 34,
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
