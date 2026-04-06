import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatStatusLabel, formatUploadMethodLabel, getTranslation, localizeKnownText, type AppLanguage, type TranslationKey } from '../constants/languages';
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
  language: AppLanguage;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  selectedUploadMethod: UploadMethod | null;
  uploadPreview: UploadPreviewData;
  apiNotice: string | null;
};

export function ExtractionPreviewScreen({ navigation, language, t, selectedUploadMethod, uploadPreview, apiNotice }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const reviewCount = uploadPreview.detectedLines.filter((line) => line.clarity === 'review').length;
  const clearCount = uploadPreview.detectedLines.length - reviewCount;
  const currentLabel = selectedUploadMethod ? formatUploadMethodLabel(language, selectedUploadMethod) : t('common.sample');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <ScreenHeader eyebrow={t('extraction.eyebrow')} title={t('extraction.loadingTitle')} subtitle={t('extraction.loadingDetail')} />
          <SuccessStateCard title={t('common.scanning')} detail={t('extraction.scanningDetail')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={t('extraction.eyebrow')} title={t('extraction.title')} subtitle={t('extraction.subtitle')} helper={<StatusBadge icon="search" label={currentLabel} variant="accent" />} />

        {apiNotice ? <EmptyStateCard title={t('home.usingDemoData')} detail={localizeKnownText(language, apiNotice)} /> : null}
        <SuccessStateCard title={t('common.ready')} detail={t('extraction.readyDetail')} />

        <DocumentPreviewCard dateLabel={localizeKnownText(language, uploadPreview.dateLabel)} source={uploadPreview.source} summary={localizeKnownText(language, uploadPreview.summary)} title={localizeKnownText(language, uploadPreview.title)} />

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryTitle}>{t('extraction.detected')}</Text>
            <Feather color={theme.colors.primary} name="cpu" size={18} />
          </View>
          <View style={styles.badgeRow}>
            <StatusBadge icon="check-circle" label={`${clearCount} ${formatStatusLabel(language, 'clear')}`} variant="accent" />
            <StatusBadge icon="alert-circle" label={`${reviewCount} ${formatStatusLabel(language, 'review')}`} variant="secondary" />
          </View>
        </View>

        <View style={styles.lineList}>
          {uploadPreview.detectedLines.length === 0 ? (
            <EmptyStateCard detail={t('extraction.nothingDetail')} title={t('extraction.nothingTitle')} />
          ) : (
            uploadPreview.detectedLines.map((line) => (
              <View key={line.id} style={styles.lineCard}>
                <StatusBadge icon={line.clarity === 'clear' ? 'check-circle' : 'help-circle'} label={line.clarity === 'clear' ? formatStatusLabel(language, 'clear') : formatStatusLabel(language, 'review')} variant={line.clarity === 'clear' ? 'accent' : 'secondary'} />
                <Text style={styles.lineText}>{line.text}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="arrow-right" label={t('extraction.reviewAction')} onPress={() => navigation.navigate('ReviewMedicines')} />
          <SecondaryButton icon="arrow-left" label={t('common.back')} onPress={() => navigation.goBack()} />
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
  summaryTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  summaryTitle: { color: theme.colors.textPrimary, fontSize: theme.typography.body, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  lineList: { gap: theme.spacing.sm },
  lineCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.sm, padding: theme.spacing.md, ...theme.shadows.soft },
  lineText: { color: theme.colors.textPrimary, fontSize: theme.typography.bodySmall, fontWeight: '700', lineHeight: 20 },
  footer: { gap: theme.spacing.sm },
});
