import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type EmptyStateCardProps = {
  title: string;
  detail: string;
  icon?: 'check-circle' | 'moon' | 'inbox' | 'shield';
};

export function EmptyStateCard({ title, detail, icon = 'inbox' }: EmptyStateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather color={theme.colors.primary} name={icon} size={22} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    textAlign: 'center',
  },
  detail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
});
