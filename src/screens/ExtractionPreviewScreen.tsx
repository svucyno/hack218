import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { demoDocument, extractedLines } from '../data/intakeMockData';
import type { AppLanguage, TranslationKey } from '../constants/languages';
import { DocumentPreviewCard } from '../components/DocumentPreviewCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { UploadMethod } from '../types/intake';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ExtractionPreview'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  selectedUploadMethod: UploadMethod | null;
};

const methodLabelMap: Record<UploadMethod, string> = {
  camera: 'Photo capture selected',
  image: 'Saved image selected',
  pdf: 'PDF selected',
  sample: 'Demo sample selected',
};

export function ExtractionPreviewScreen({ navigation, language, setLanguage, selectedUploadMethod }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const reviewCount = extractedLines.filter((line) => line.clarity === 'review').length;
  const clearCount = extractedLines.length - reviewCount;
  const currentLabel = selectedUploadMethod ? methodLabelMap[selectedUploadMethod] : 'Demo sample selected';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Step 2 of 3"
          title="Extraction preview"
          subtitle="Scanning the document and preparing medicine lines for review."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        />
        <SuccessStateCard title="Mock extraction in progress" detail="Please review detected medicines before generating schedule." />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="Step 2 of 3"
        title="Extraction preview"
        subtitle="Please review detected medicines before generating schedule."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        helper={<StatusBadge icon="search" label={currentLabel} variant="accent" />}
      />

      <SuccessStateCard title="Extraction complete" detail="Detected medicine lines are ready for a quick human review." />

      <DocumentPreviewCard
        dateLabel={demoDocument.dateLabel}
        source={demoDocument.source}
        summary={demoDocument.summary}
        title={demoDocument.title}
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <Text style={styles.summaryTitle}>Extraction summary</Text>
          <Feather color={theme.colors.primary} name="cpu" size={20} />
        </View>
        <Text style={styles.summaryBody}>
          {clearCount} medicine lines were read clearly. {reviewCount} line needs a closer look before schedule generation.
        </Text>
        <View style={styles.badgeRow}>
          <StatusBadge icon="check-circle" label={`${clearCount} clear lines`} variant="accent" />
          <StatusBadge icon="alert-circle" label={`${reviewCount} need review`} variant="secondary" />
        </View>
      </View>

      <View style={styles.lineSection}>
        <Text style={styles.sectionTitle}>Detected entries</Text>
        <View style={styles.lineList}>
          {extractedLines.length === 0 ? (
            <EmptyStateCard detail="No medicine lines were detected in this mock document." title="Nothing detected" />
          ) : (
            extractedLines.map((line) => (
              <View key={line.id} style={styles.lineCard}>
                <View style={styles.lineTop}>
                  <StatusBadge
                    icon={line.clarity === 'clear' ? 'check-circle' : 'help-circle'}
                    label={line.clarity === 'clear' ? 'Clear' : 'Review'}
                    variant={line.clarity === 'clear' ? 'accent' : 'secondary'}
                  />
                </View>
                <Text style={styles.lineText}>{line.text}</Text>
                {line.note ? <Text style={styles.lineNote}>{line.note}</Text> : null}
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.footerNoteCard}>
        <Text style={styles.footerNoteTitle}>Why review matters</Text>
        <Text style={styles.footerNoteBody}>
          A quick review helps avoid missed doses, unclear timing, or duplicate medicine entries before the schedule is generated.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton icon="arrow-right" label="Review medicines" onPress={() => navigation.navigate('ReviewMedicines')} />
        <SecondaryButton icon="arrow-left" label="Back to upload" onPress={() => navigation.goBack()} />
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
  summaryTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  lineSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  lineList: {
    gap: theme.spacing.md,
  },
  lineCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  lineTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lineText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 28,
  },
  lineNote: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footerNoteCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  footerNoteTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  footerNoteBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
