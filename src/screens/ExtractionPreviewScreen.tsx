import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyStateCard } from '../components/EmptyStateCard';
import { DocumentPreviewCard } from '../components/DocumentPreviewCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { theme } from '../theme';
import type { UploadMethod, UploadPreviewData } from '../types/intake';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ExtractionPreview'> & {
  selectedUploadMethod: UploadMethod | null;
  uploadPreview: UploadPreviewData;
  apiNotice: string | null;
};

const methodLabelMap: Record<UploadMethod, string> = {
  camera: 'Photo',
  image: 'Image',
  pdf: 'PDF',
  sample: 'Sample',
};

export function ExtractionPreviewScreen({ navigation, selectedUploadMethod, uploadPreview, apiNotice }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const reviewCount = uploadPreview.detectedLines.filter((line) => line.clarity === 'review').length;
  const clearCount = uploadPreview.detectedLines.length - reviewCount;
  const currentLabel = selectedUploadMethod ? methodLabelMap[selectedUploadMethod] : 'Sample';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <ScreenHeader eyebrow="Review" title="Extracting" subtitle="Reading medicine lines." />
          <SuccessStateCard title="Scanning" detail="Preparing medicine list." />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Review"
          title="Extraction"
          subtitle="Check detected lines."
          helper={<StatusBadge icon="search" label={currentLabel} variant="accent" />}
        />

        {apiNotice ? <EmptyStateCard title="Using demo data" detail={apiNotice} /> : null}
        <SuccessStateCard title="Ready" detail="Review before schedule." />

        <DocumentPreviewCard
          dateLabel={uploadPreview.dateLabel}
          source={uploadPreview.source}
          summary={uploadPreview.summary}
          title={uploadPreview.title}
        />

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryTitle}>Detected</Text>
            <Feather color={theme.colors.primary} name="cpu" size={18} />
          </View>
          <View style={styles.badgeRow}>
            <StatusBadge icon="check-circle" label={`${clearCount} Clear`} variant="accent" />
            <StatusBadge icon="alert-circle" label={`${reviewCount} Review`} variant="secondary" />
          </View>
        </View>

        <View style={styles.lineList}>
          {uploadPreview.detectedLines.length === 0 ? (
            <EmptyStateCard detail="No medicine lines found." title="Nothing detected" />
          ) : (
            uploadPreview.detectedLines.map((line) => (
              <View key={line.id} style={styles.lineCard}>
                <StatusBadge
                  icon={line.clarity === 'clear' ? 'check-circle' : 'help-circle'}
                  label={line.clarity === 'clear' ? 'Clear' : 'Review'}
                  variant={line.clarity === 'clear' ? 'accent' : 'secondary'}
                />
                <Text style={styles.lineText}>{line.text}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="arrow-right" label="Review" onPress={() => navigation.navigate('ReviewMedicines')} />
          <SecondaryButton icon="arrow-left" label="Back" onPress={() => navigation.goBack()} />
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
  summaryTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  lineList: {
    gap: theme.spacing.sm,
  },
  lineCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadows.soft,
  },
  lineText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySmall,
    fontWeight: '700',
    lineHeight: 20,
  },
  footer: {
    gap: theme.spacing.sm,
  },
});
