import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type IconName = ComponentProps<typeof Feather>['name'];

type UploadOptionCardProps = {
  title: string;
  detail: string;
  icon: IconName;
  selected?: boolean;
  onPress?: () => void;
};

export function UploadOptionCard({ title, detail, icon, selected = false, onPress }: UploadOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selectedCard, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, selected && styles.selectedIconWrap]}>
        <Feather color={selected ? theme.colors.primary : theme.colors.secondary} name={icon} size={22} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      {selected ? <Feather color={theme.colors.primary} name="check-circle" size={20} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  selectedCard: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.97,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  selectedIconWrap: {
    backgroundColor: theme.colors.surface,
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
    lineHeight: 24,
  },
});
