import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewMedicines'> & {
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
      setTimeout(() => navigation.navigate('MedicationSchedule'), 450);
    }, 500);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="Step 3 of 3"
        title="Review and confirm medicines"
        subtitle="Check each medicine before MedBridge creates the daily schedule."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        helper={<StatusBadge icon="check-circle" label={`${confirmedCount} confirmed so far`} variant="accent" />}
      />

      {isGenerating ? (
        <SuccessStateCard title="Generating schedule" detail="Turning reviewed medicines into a simple morning, afternoon, and night plan." />
      ) : null}
      {showSuccess ? (
        <SuccessStateCard title="Schedule generated" detail="Your medicines are ready in a calm daily view." />
      ) : null}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Ready to generate</Text>
        <Text style={styles.summaryBody}>
          Confirm the clear entries, edit unclear fields, and remove anything that should not be included.
        </Text>
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

      <View style={styles.helperCard}>
        <Text style={styles.helperTitle}>Simple review tip</Text>
        <Text style={styles.helperBody}>
          If timing or dosage is unclear, use Edit to simulate a correction before schedule generation in the demo.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton icon="calendar" label="Generate schedule" onPress={handleGenerate} />
        <SecondaryButton icon="rotate-ccw" label="Reset review" onPress={resetReviewMedicines} />
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
  },
  summaryBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  summaryBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.md,
  },
  helperCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  helperTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  helperBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
