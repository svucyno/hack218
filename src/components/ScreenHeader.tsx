import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
  helper?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, rightAction, helper }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.copy}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
      </View>
      {helper ? <View style={styles.helper}>{helper}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },
  eyebrow: {
    color: theme.colors.secondary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  action: {
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  helper: {
    marginTop: 2,
  },
});
