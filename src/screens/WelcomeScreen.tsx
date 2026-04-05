import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScenarioBanner } from '../components/ScenarioBanner';
import { ScreenHeader } from '../components/ScreenHeader';
import { LanguageToggle } from '../components/LanguageToggle';
import { theme } from '../theme';
import type { DemoScenarioKey } from '../types/intake';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  applyDemoScenario: (scenario: DemoScenarioKey) => void;
};

const benefits = [
  {
    icon: 'calendar',
    title: 'Simple medicine plan',
    detail: 'Turn discharge medicines into a clear day-by-day schedule.',
  },
  {
    icon: 'globe',
    title: 'Support in your language',
    detail: 'Large, calm instructions help patients and families follow the plan.',
  },
  {
    icon: 'shield',
    title: 'Caregiver can stay updated',
    detail: 'Missed doses and pending medicines are easy to notice quickly.',
  },
] as const;

export function WelcomeScreen({ navigation, language, setLanguage, t, applyDemoScenario }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow={t('appName')}
        title={t('welcomeTitle')}
        subtitle="MedBridge helps patients follow discharge medicines safely at home with clear steps, simple language, and caregiver visibility."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
      />

      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Feather color={theme.colors.primary} name="heart" size={16} />
          <Text style={styles.heroBadgeText}>Calm support after discharge</Text>
        </View>
        <Text style={styles.heroTitle}>Feel more confident with every dose</Text>
        <Text style={styles.heroBody}>
          A gentle medication guide for patients, elderly users, and caregivers during the first days at home.
        </Text>
      </View>

      <ScenarioBanner
        active={false}
        detail="Open guided demo mode to jump straight into a presentation-ready MedBridge journey."
        title="Hackathon demo mode is available"
      />

      <View style={styles.benefitList}>
        {benefits.map((item) => (
          <View key={item.title} style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Feather color={theme.colors.secondary} name={item.icon} size={20} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>{item.title}</Text>
              <Text style={styles.benefitDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          icon="arrow-right"
          label={t('getStarted')}
          onPress={() => navigation.navigate('LanguageSelection')}
        />
        <PrimaryButton
          icon="play-circle"
          label="Open guided demo mode"
          onPress={() => {
            applyDemoScenario('smooth');
            navigation.navigate('Home');
          }}
        />
        <Text style={styles.footerNote}>You can change language later and switch demo scenarios from the dashboard.</Text>
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
    paddingBottom: theme.spacing.xxl,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  heroBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.hero,
    fontWeight: '800',
    lineHeight: 42,
  },
  heroBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyLarge,
    lineHeight: 28,
  },
  benefitList: {
    gap: theme.spacing.md,
  },
  benefitCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  benefitCopy: {
    flex: 1,
    gap: 4,
  },
  benefitTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  benefitDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footer: {
    gap: theme.spacing.md,
  },
  footerNote: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    lineHeight: 22,
    textAlign: 'center',
  },
});
