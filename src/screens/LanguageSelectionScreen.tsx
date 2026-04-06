import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatLanguageName, theme } from '../theme';
import type { AppLanguage, TranslationKey } from '../constants/languages';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'LanguageSelection'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  completeLanguageSetup: (language: AppLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const options: Array<{ code: AppLanguage; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
];

export function LanguageSelectionScreen({ navigation, language, setLanguage, completeLanguageSetup, t }: Props) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.logoWrap}>
            <Feather color={theme.colors.surface} name="heart" size={22} />
          </View>
          <Text style={styles.brandName}>{t('common.appName')}</Text>
          <Text style={styles.headline}>{t('onboarding.chooseLanguage')}</Text>
        </View>

        <View style={styles.options}>
          {options.map((option) => {
            const selected = option.code === language;
            return (
              <Pressable
                key={option.code}
                accessibilityRole="button"
                onPress={() => {
                  setLanguage(option.code);
                  completeLanguageSetup(option.code);
                  navigation.replace('Welcome');
                }}
                style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.cardPressed]}
              >
                <Text style={styles.cardTitle}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
  },
  topSection: {
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingTop: 64,
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  brandName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  headline: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    maxWidth: 300,
  },
  options: {
    gap: theme.spacing.md,
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 88,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.accent,
  },
  cardPressed: {
    opacity: 0.97,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
});
