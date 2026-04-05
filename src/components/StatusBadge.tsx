import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type StatusBadgeProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
};

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, badgeStyles[variant]]}>
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
});

const badgeStyles = StyleSheet.create({
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  accent: { backgroundColor: theme.colors.accent },
  neutral: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
});

const labelStyles = StyleSheet.create({
  primary: { color: theme.colors.surface },
  secondary: { color: theme.colors.surface },
  accent: { color: theme.colors.textPrimary },
  neutral: { color: theme.colors.textSecondary },
});
