import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type IconName = ComponentProps<typeof Feather>['name'];

type StatusBadgeProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  icon?: IconName;
};

export function StatusBadge({ label, variant = 'neutral', icon }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, badgeStyles[variant]]}>
      {icon ? <Feather name={icon} size={14} color={labelStyles[variant].color} /> : null}
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    gap: 6,
    minHeight: 30,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.caption,
    fontWeight: '800',
    lineHeight: 16,
  },
});

const badgeStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  accent: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
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
