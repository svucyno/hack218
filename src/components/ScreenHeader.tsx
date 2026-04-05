import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, rightAction }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  eyebrow: {
    color: theme.colors.secondary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title,
    fontWeight: '800',
    lineHeight: 32,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  action: {
    justifyContent: 'flex-start',
  },
});
