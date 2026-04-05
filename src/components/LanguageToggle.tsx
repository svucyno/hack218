import { Pressable, StyleSheet, Text, View } from 'react-native';

import { languageOptions, type AppLanguage } from '../constants/languages';
import { theme } from '../theme';

type LanguageToggleProps = {
  value: AppLanguage;
  onChange: (language: AppLanguage) => void;
};

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <View style={styles.container}>
      {languageOptions.map((option) => {
        const active = option.code === value;

        return (
          <Pressable
            key={option.code}
            accessibilityRole="button"
            onPress={() => onChange(option.code)}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    padding: 4,
  },
  option: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  optionActive: {
    backgroundColor: theme.colors.surface,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  labelActive: {
    color: theme.colors.primary,
  },
});
