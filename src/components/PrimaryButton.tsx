import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  label: {
    color: theme.colors.surface,
    fontSize: theme.typography.button,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.92,
  },
});
