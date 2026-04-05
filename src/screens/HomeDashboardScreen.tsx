import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { medications } from '../data/mockData';
import { theme } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

type QuickRoute = 'MedicationSchedule' | 'UploadDocument' | 'CaregiverOverview';

type QuickCard = {
  detail: string;
  icon: 'clock' | 'upload' | 'users';
  route: QuickRoute;
  title: string;
};

export function HomeDashboardScreen({ navigation, language, setLanguage, t }: Props) {
  const quickCards: QuickCard[] = [
    {
      detail: '3 medicines planned today',
      icon: 'clock',
      route: 'MedicationSchedule',
      title: t('openSchedule'),
    },
    {
      detail: 'Keep papers in one place',
      icon: 'upload',
      route: 'UploadDocument',
      title: t('uploadTitle'),
    },
    {
      detail: 'Simple progress summary',
      icon: 'users',
      route: 'CaregiverOverview',
      title: t('viewCaregiver'),
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow={t('appName')}
        title={t('homeTitle')}
        subtitle={t('homeSubtitle')}
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
      />

      <View style={styles.planCard}>
        <View style={styles.planTop}>
          <Text style={styles.planTitle}>{t('todayPlan')}</Text>
          <StatusBadge label="1 due now" variant="primary" />
        </View>
        <Text style={styles.planBody}>
          Morning antibiotic is ready to confirm. Afternoon and evening doses are scheduled next.
        </Text>
      </View>

      <View style={styles.quickList}>
        {quickCards.map((card) => (
          <Pressable
            key={card.title}
            accessibilityRole="button"
            onPress={() => navigation.navigate(card.route)}
            style={styles.quickCard}
          >
            <View style={styles.quickIcon}>
              <Feather name={card.icon} size={20} color={theme.colors.secondary} />
            </View>
            <View style={styles.quickCopy}>
              <Text style={styles.quickTitle}>{card.title}</Text>
              <Text style={styles.quickDetail}>{card.detail}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's medicines</Text>
        {medications.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryName}>{item.name}</Text>
              <Text style={styles.summaryMeta}>
                {item.dosage} • {item.timing}
              </Text>
            </View>
            <StatusBadge
              label={item.status}
              variant={item.status === 'Due now' ? 'primary' : 'accent'}
            />
          </View>
        ))}
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
    paddingTop: 64,
  },
  planCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  planTop: {
    gap: theme.spacing.sm,
  },
  planTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  planBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  quickList: {
    gap: theme.spacing.md,
  },
  quickCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  quickCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  quickTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 24,
  },
  quickDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  summaryRow: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  summaryName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
  },
  summaryMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    marginTop: 2,
  },
});
