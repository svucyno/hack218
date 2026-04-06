import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  reviewMedicines: ReviewMedicine[];
  confirmMedicine: (id: string) => void;
  editMedicine: (id: string) => void;
  removeMedicine: (id: string) => void;
  generateSchedule: () => Promise<MedicationItem[]>;
  resetReviewMedicines: () => void;
  apiNotice: string | null;
};

export function ReviewMedicinesScreen({ navigation, reviewMedicines, confirmMedicine, editMedicine, removeMedicine, generateSchedule, resetReviewMedicines, apiNotice }: Props) {
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
        <ScreenHeader
          eyebrow="Review"
          title="Medicines"
          subtitle="Confirm before schedule."
          helper={<StatusBadge icon="check-circle" label={`${confirmedCount} Confirmed`} variant="accent" />}
        />

        {apiNotice ? <EmptyStateCard title="Using demo data" detail={apiNotice} /> : null}
        {isGenerating ? <SuccessStateCard title="Generating" detail="Creating schedule." /> : null}
        {showSuccess ? <SuccessStateCard title="Ready" detail="Schedule created." /> : null}

        <View style={styles.summaryCard}>
          <View style={styles.badges}>
            <StatusBadge icon="layers" label={`${reviewMedicines.length} Items`} variant="accent" />
            <StatusBadge icon="alert-circle" label={`${warningCount} Warnings`} variant="secondary" />
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
          <PrimaryButton icon="calendar" label="Generate" onPress={() => void handleGenerate()} />
          <SecondaryButton icon="rotate-ccw" label="Reset" onPress={resetReviewMedicines} />
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
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.sm,
  },
  footer: {
    gap: theme.spacing.sm,
  },
});
