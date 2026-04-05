import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
};

export function SecondaryButton({ label, onPress }: SecondaryButtonProps) {
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  label: {
    color: theme.colors.secondary,
    fontSize: theme.typography.button,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.88,
  },
});
