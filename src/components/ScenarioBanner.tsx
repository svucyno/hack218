import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { StatusBadge } from './StatusBadge';

type ScenarioBannerProps = {
  title: string;
  detail: string;
  active?: boolean;
};

export function ScenarioBanner({ title, detail, active = true }: ScenarioBannerProps) {
  return (
    <View style={[styles.card, active && styles.cardActive]}>
      <StatusBadge icon="play-circle" label={active ? 'Demo mode active' : 'Demo mode ready'} variant={active ? 'primary' : 'accent'} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
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
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  detail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
