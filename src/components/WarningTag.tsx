import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { ReviewWarning } from '../types/intake';

const warningConfig: Record<ReviewWarning, { icon: 'alert-circle' | 'help-circle' | 'copy'; label: string }> = {
  'missing-dosage': { icon: 'alert-circle', label: 'Missing dosage' },
  'unclear-timing': { icon: 'help-circle', label: 'Timing unclear' },
  'possible-duplicate': { icon: 'copy', label: 'Possible duplicate' },
};

type WarningTagProps = {
  warning: ReviewWarning;
};

export function WarningTag({ warning }: WarningTagProps) {
  const config = warningConfig[warning];

  return (
    <View style={styles.tag}>
      <Feather color={theme.colors.textPrimary} name={config.icon} size={14} />
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 30,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
});
