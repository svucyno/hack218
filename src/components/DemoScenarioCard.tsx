import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import type { DemoScenarioKey } from '../types/intake';

type DemoScenarioCardProps = {
  title: string;
  detail: string;
  scenario: DemoScenarioKey;
  selected?: boolean;
  onPress?: (scenario: DemoScenarioKey) => void;
};

export function DemoScenarioCard({ title, detail, scenario, selected = false, onPress }: DemoScenarioCardProps) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Text style={styles.title}>{title}</Text>
      <Text numberOfLines={1} style={styles.detail}>{detail}</Text>
      <PrimaryButton fullWidth={false} label={selected ? 'Active' : 'Use'} onPress={() => onPress?.(scenario)} />
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
    padding: theme.spacing.md,
    ...theme.shadows.soft,
  },
  cardSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.primary,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  detail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    lineHeight: 18,
  },
});
