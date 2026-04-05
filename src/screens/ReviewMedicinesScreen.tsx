import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
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
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  reviewMedicines: ReviewMedicine[];
  confirmMedicine: (id: string) => void;
  editMedicine: (id: string) => void;
  removeMedicine: (id: string) => void;
  generateSchedule: () => MedicationItem[];
  resetReviewMedicines: () => void;
};

export function ReviewMedicinesScreen({
  navigation,
  language,
  setLanguage,
  reviewMedicines,
  confirmMedicine,
  editMedicine,
  removeMedicine,
  generateSchedule,
  resetReviewMedicines,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const confirmedCount = reviewMedicines.filter((item) => item.confirmed).length;
  const warningCount = reviewMedicines.reduce((count, item) => count + item.warnings.length, 0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateSchedule();
      setIsGenerating(false);
      setShowSuccess(true);
      setTimeout(() => navigation.navigate('AppTabs', { screen: 'ScheduleTab' }), 450);
    }, 500);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Step 3 of 3"
          title="Review medicines"
          subtitle="Please confirm each medicine before the schedule is created."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
          helper={<StatusBadge icon="check-circle" label={`${confirmedCount} confirmed`} variant="accent" />}
        />

        {isGenerating ? (
          <SuccessStateCard title="Generating schedule" detail="Turning reviewed medicines into a simple day plan." />
        ) : null}
        {showSuccess ? <SuccessStateCard title="Schedule generated" detail="The schedule is ready in the Schedule tab." /> : null}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Review before generating</Text>
          <Text style={styles.summaryBody}>Confirm clear entries, edit unclear fields, and remove anything that should not be included.</Text>
          <View style={styles.summaryBadges}>
            <StatusBadge icon="layers" label={`${reviewMedicines.length} medicines`} variant="accent" />
            <StatusBadge icon="alert-circle" label={`${warningCount} warnings`} variant="secondary" />
          </View>
        </View>

        <View style={styles.list}>
          {reviewMedicines.map((medicine) => (
            <ReviewMedicineCard
              key={medicine.id}
              medicine={medicine}
              onConfirm={() => confirmMedicine(medicine.id)}
              onEdit={() => editMedicine(medicine.id)}
              onRemove={() => removeMedicine(medicine.id)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="calendar" label="Generate schedule" onPress={handleGenerate} />
          <SecondaryButton icon="rotate-ccw" label="Reset review" onPress={resetReviewMedicines} />
        </View>
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  summaryBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  summaryBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.md,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
