import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { theme } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

export function WelcomeScreen({ navigation, language, setLanguage, t }: Props) {
  const points = [t('welcomePointOne'), t('welcomePointTwo'), t('welcomePointThree')];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow={t('appName')}
        title={t('welcomeTitle')}
        subtitle={t('welcomeSubtitle')}
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
      />

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Safe steps for the first days at home</Text>
        <Text style={styles.heroBody}>
          The first MedBridge version keeps the experience slow, clear, and easy to read.
        </Text>
      </View>

      <View style={styles.listCard}>
        {points.map((point) => (
          <View key={point} style={styles.listRow}>
            <View style={styles.iconWrap}>
              <Feather name="check" size={18} color={theme.colors.primary} />
            </View>
            <Text style={styles.listText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={t('getStarted')}
          onPress={() => navigation.navigate('LanguageSelection')}
        />
        <SecondaryButton label={t('skipForNow')} onPress={() => navigation.navigate('Home')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.spacing.xl,
    padding: theme.spacing.lg,
    paddingTop: 72,
  },
  heroCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  listRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  listText: {
    color: theme.colors.textPrimary,
    flex: 1,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '600',
    lineHeight: 26,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
