import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { caregiverStatus } from '../data/mockData';
import { theme } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CaregiverOverview'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

export function CaregiverOverviewScreen({ language, setLanguage, t }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('caregiverTitle')}
        subtitle={t('caregiverSubtitle')}
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
      />

      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>One patient check-in may be helpful this afternoon</Text>
        <Text style={styles.alertBody}>
          The dashboard keeps the overview simple so a caregiver can notice missed support quickly.
        </Text>
      </View>

      <View style={styles.list}>
        {caregiverStatus.map((item) => (
          <View key={item.id} style={styles.statusCard}>
            <View style={styles.statusTop}>
              <Text style={styles.statusLabel}>{item.label}</Text>
              <StatusBadge label={t('sampleLabel')} variant={item.badge} />
            </View>
            <Text style={styles.statusDetail}>{item.detail}</Text>
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
  alertCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  alertTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  alertBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  list: {
    gap: theme.spacing.md,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  statusTop: {
    gap: theme.spacing.sm,
  },
  statusLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 26,
  },
  statusDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
