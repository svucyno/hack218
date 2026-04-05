import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { CaregiverAlertState } from '../types/medication';
import { StatusBadge } from './StatusBadge';

type CaregiverAlertCardProps = {
  alert: CaregiverAlertState;
};

export function CaregiverAlertCard({ alert }: CaregiverAlertCardProps) {
  return (
    <View style={[styles.card, alert.active && styles.cardActive]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather color={theme.colors.primary} name="users" size={18} />
        </View>
        <StatusBadge
          icon={alert.active ? 'bell' : 'shield'}
          label={alert.active ? 'Alert' : 'Stable'}
          variant={alert.active ? 'secondary' : 'accent'}
        />
      </View>
      <Text style={styles.title}>{alert.active ? 'Caregiver follow-up' : 'Caregiver okay'}</Text>
      <Text style={styles.body}>{alert.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  cardActive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.secondary,
    borderWidth: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
