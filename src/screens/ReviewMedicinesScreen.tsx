import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatStatusLabel, getTranslation, localizeKnownText, type AppLanguage, type TranslationKey } from '../constants/languages';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ReviewMedicineCard } from '../components/ReviewMedicineCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { ReviewMedicine } from '../types/intake';
import type { MedicationItem } from '../types/medication';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ReviewMedicines'> & {
  language: AppLanguage;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  reviewMedicines: ReviewMedicine[];
  confirmMedicine: (id: string) => void;
  editMedicine: (id: string) => void;
  removeMedicine: (id: string) => void;
  generateSchedule: () => Promise<MedicationItem[]>;
  resetReviewMedicines: () => void;
  apiNotice: string | null;
};

export function ReviewMedicinesScreen({ navigation, language, t, reviewMedicines, confirmMedicine, editMedicine, removeMedicine, generateSchedule, resetReviewMedicines, apiNotice }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const confirmedCount = reviewMedicines.filter((item) => item.confirmed).length;
  const warningCount = reviewMedicines.reduce((count, item) => count + item.warnings.length, 0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateSchedule();
    setIsGenerating(false);
    setShowSuccess(true);
    setTimeout(() => navigation.navigate('AppTabs', { screen: 'ScheduleTab' }), 450);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={t('review.eyebrow')} title={t('review.title')} subtitle={t('review.subtitle')} helper={<StatusBadge icon="check-circle" label={`${confirmedCount} ${t('review.confirmed')}`} variant="accent" />} />

        {apiNotice ? <EmptyStateCard title={t('home.usingDemoData')} detail={localizeKnownText(language, apiNotice)} /> : null}
        {isGenerating ? <SuccessStateCard title={t('common.generating')} detail={t('review.generatingDetail')} /> : null}
        {showSuccess ? <SuccessStateCard title={t('common.ready')} detail={t('review.readyDetail')} /> : null}

        <View style={styles.summaryCard}>
          <View style={styles.badges}>
            <StatusBadge icon="layers" label={`${reviewMedicines.length} ${t('common.items')}`} variant="accent" />
            <StatusBadge icon="alert-circle" label={`${warningCount} ${t('common.warnings')}`} variant="secondary" />
          </View>
        </View>

        <View style={styles.list}>
          {reviewMedicines.map((medicine) => (
            <ReviewMedicineCard key={medicine.id} language={language} medicine={medicine} onConfirm={() => confirmMedicine(medicine.id)} onEdit={() => editMedicine(medicine.id)} onRemove={() => removeMedicine(medicine.id)} />
          ))}
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="calendar" label={t('review.generate')} onPress={() => void handleGenerate()} />
          <SecondaryButton icon="rotate-ccw" label={t('common.reset')} onPress={resetReviewMedicines} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl },
  summaryCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.sm, padding: theme.spacing.lg, ...theme.shadows.card },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  list: { gap: theme.spacing.sm },
  footer: { gap: theme.spacing.sm },
});
