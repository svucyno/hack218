import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
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
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(scenario)}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
        {selected ? <Feather color={theme.colors.primary} name="check-circle" size={20} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  cardSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.96,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  detail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
