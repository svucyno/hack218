import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { theme } from '../theme';

type IconName = ComponentProps<typeof Feather>['name'];

type HeaderIconButtonProps = {
  icon: IconName;
  onPress?: () => void;
};

export function HeaderIconButton({ icon, onPress }: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Feather color={theme.colors.primary} name={icon} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
    ...theme.shadows.soft,
  },
  pressed: {
    backgroundColor: theme.colors.accent,
  },
});
