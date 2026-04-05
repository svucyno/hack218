import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type DemoScenarioCardProps = {
  title: string;
  detail: string;
  scenario: 'smooth' | 'missed' | 'no-response' | 'escalated';
  selected?: boolean;
  onPress?: (scenario: 'smooth' | 'missed' | 'no-response' | 'escalated') => void;
};

export function DemoScenarioCard({ title, detail, scenario, selected = false, onPress }: DemoScenarioCardProps) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
      <PrimaryButton fullWidth={false} label={selected ? 'Active' : 'Use scenario'} onPress={() => onPress?.(scenario)} />
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
    fontSize: theme.typography.bodySmall,
    lineHeight: 20,
  },
});
