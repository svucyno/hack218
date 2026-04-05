import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  languageOptions,
  type AppLanguage,
  type TranslationKey,
} from '../constants/languages';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'LanguageSelection'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

export function LanguageSelectionScreen({ navigation, language, setLanguage, t }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader title={t('languageTitle')} subtitle={t('languageSubtitle')} />

        <View style={styles.options}>
          {languageOptions.map((option) => {
            const selected = option.code === language;

            return (
              <Pressable
                key={option.code}
                accessibilityRole="button"
                onPress={() => setLanguage(option.code)}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardCopy}>
                    <Text style={styles.cardTitle}>{option.label}</Text>
                    <Text style={styles.cardSubtitle}>{option.helper}</Text>
                  </View>
                  {selected ? <StatusBadge label={t('selected')} variant="secondary" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <PrimaryButton label={t('continue')} onPress={() => navigation.replace('AppTabs')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  options: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.secondary,
  },
  cardRow: {
    gap: theme.spacing.md,
  },
  cardCopy: {
    gap: theme.spacing.xs,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
