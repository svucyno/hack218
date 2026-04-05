import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type IconName = ComponentProps<typeof Feather>['name'];

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  fullWidth?: boolean;
};

export function PrimaryButton({ label, onPress, icon, fullWidth = true }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, fullWidth && styles.fullWidth, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        {icon ? <Feather color={theme.colors.surface} name={icon} size={18} /> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.soft,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.surface,
    fontSize: theme.typography.button,
    fontWeight: '800',
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
});
