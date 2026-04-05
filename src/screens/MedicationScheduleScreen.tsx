import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
import { MedicationCard } from '../components/MedicationCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { medications } from '../data/mockData';
import { theme } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MedicationSchedule'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

export function MedicationScheduleScreen({ language, setLanguage, t }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('scheduleTitle')}
        subtitle={t('scheduleSubtitle')}
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today: 3 medicines</Text>
        <Text style={styles.summaryBody}>
          Keep actions large and easy. Each card shows what to take, when to take it, and the
          current status.
        </Text>
      </View>

      <View style={styles.list}>
        {medications.map((item) => (
          <MedicationCard
            key={item.id}
            name={item.name}
            dosage={item.dosage}
            timing={item.timing}
            instructions={item.instructions}
            status={item.status}
            actions={
              <View style={styles.actionRow}>
                <View style={styles.actionButton}>
                  <PrimaryButton label={t('taken')} />
                </View>
                <View style={styles.actionButton}>
                  <SecondaryButton label={t('missed')} />
                </View>
              </View>
            }
          />
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
  summaryCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  summaryBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  list: {
    gap: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
