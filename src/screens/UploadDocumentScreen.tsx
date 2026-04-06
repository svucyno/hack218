import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  formatUploadMethodDetail,
  formatUploadMethodLabel,
  localizeKnownText,
  type AppLanguage,
  type TranslationKey,
} from '../constants/languages';
import { demoDocument, uploadMethods } from '../data/intakeMockData';
import { DocumentPreviewCard } from '../components/DocumentPreviewCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { UploadOptionCard } from '../components/UploadOptionCard';
import { theme } from '../theme';
import type { UploadMethod } from '../types/intake';
import type { AppTabScreenProps } from '../types/navigation';

type Props = AppTabScreenProps<'UploadTab'> & {
  language: AppLanguage;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  selectedUploadMethod: UploadMethod | null;
  hasUploadedDocument: boolean;
  selectUploadMethod: (method: UploadMethod) => void;
  continueWithSampleDocument: () => Promise<void>;
  apiNotice: string | null;
};

export function UploadDocumentScreen({
  navigation,
  language,
  t,
  selectedUploadMethod,
  hasUploadedDocument,
  selectUploadMethod,
  continueWithSampleDocument,
  apiNotice,
}: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const handleContinue = async () => {
    setIsOpening(true);
    await continueWithSampleDocument();
    setTimeout(() => {
      setIsOpening(false);
      navigation.navigate('ExtractionPreview');
    }, 450);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow={t('upload.eyebrow')}
          title={t('upload.title')}
          subtitle={t('upload.subtitle')}
          rightAction={<HeaderIconButton icon="settings" onPress={() => navigation.navigate('Settings')} />}
          helper={<StatusBadge icon="file-text" label={t('upload.helper')} variant="accent" />}
        />

        {apiNotice ? <EmptyStateCard title={t('home.usingDemoData')} detail={localizeKnownText(language, apiNotice)} /> : null}
        {isOpening ? <SuccessStateCard title={t('common.preparing')} detail={t('upload.openingSample')} /> : null}

        <View style={styles.optionList}>
          {uploadMethods.map((option) => (
            <UploadOptionCard
              key={option.id}
              detail={formatUploadMethodDetail(language, option.id)}
              icon={option.icon}
              onPress={() => selectUploadMethod(option.id)}
              selected={selectedUploadMethod === option.id}
              title={formatUploadMethodLabel(language, option.id)}
            />
          ))}
        </View>

        <View style={styles.sampleSection}>
          <Text style={styles.sectionTitle}>{t('upload.sampleTitle')}</Text>
          <DocumentPreviewCard
            dateLabel={localizeKnownText(language, demoDocument.dateLabel)}
            source={demoDocument.source}
            summary={localizeKnownText(language, demoDocument.summary)}
            title={localizeKnownText(language, demoDocument.title)}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="play-circle" label={t('upload.continue')} onPress={() => void handleContinue()} />
          <SecondaryButton
            icon="arrow-right"
            label={hasUploadedDocument ? t('upload.review') : t('upload.home')}
            onPress={() => (hasUploadedDocument ? navigation.navigate('ExtractionPreview') : navigation.navigate('HomeTab'))}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl },
  optionList: { gap: theme.spacing.sm },
  sampleSection: { gap: theme.spacing.sm },
  sectionTitle: { color: theme.colors.textPrimary, fontSize: theme.typography.body, fontWeight: '800', lineHeight: 22 },
  footer: { gap: theme.spacing.sm },
});
