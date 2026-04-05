import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { demoDocument, uploadMethods } from '../data/intakeMockData';
import type { AppLanguage, TranslationKey } from '../constants/languages';
import { DocumentPreviewCard } from '../components/DocumentPreviewCard';
import { LanguageToggle } from '../components/LanguageToggle';
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
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  selectedUploadMethod: UploadMethod | null;
  selectUploadMethod: (method: UploadMethod) => void;
  continueWithSampleDocument: () => void;
};

export function UploadDocumentScreen({
  navigation,
  language,
  setLanguage,
  selectedUploadMethod,
  selectUploadMethod,
  continueWithSampleDocument,
}: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const handleContinue = () => {
    setIsOpening(true);
    continueWithSampleDocument();
    setTimeout(() => {
      setIsOpening(false);
      navigation.navigate('ExtractionPreview');
    }, 450);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Upload"
          title="Add a medicine document"
          subtitle="Choose a clear prescription, discharge page, or demo file."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
          helper={<StatusBadge icon="file-text" label="Printed or typed pages work best" variant="accent" />}
        />

        {isOpening ? (
          <SuccessStateCard title="Preparing document" detail="Opening a demo document for extraction preview." />
        ) : null}

        <View style={styles.optionList}>
          {uploadMethods.map((option) => (
            <UploadOptionCard
              key={option.id}
              detail={option.detail}
              icon={option.icon}
              onPress={() => selectUploadMethod(option.id)}
              selected={selectedUploadMethod === option.id}
              title={option.title}
            />
          ))}
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipRow}>
            <Feather color={theme.colors.secondary} name="info" size={16} />
            <Text style={styles.tipTitle}>Helpful note</Text>
          </View>
          <Text style={styles.tipBody}>This MVP works best with printed or clearly typed medicine instructions.</Text>
        </View>

        <View style={styles.sampleSection}>
          <Text style={styles.sectionTitle}>Sample document</Text>
          <DocumentPreviewCard
            dateLabel={demoDocument.dateLabel}
            source={demoDocument.source}
            summary={demoDocument.summary}
            title={demoDocument.title}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="play-circle" label="Continue with sample" onPress={handleContinue} />
          <SecondaryButton
            icon="arrow-right"
            label={selectedUploadMethod ? 'Preview selected upload' : 'Go to Home'}
            onPress={() =>
              selectedUploadMethod ? navigation.navigate('ExtractionPreview') : navigation.navigate('HomeTab')
            }
          />
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
  optionList: {
    gap: theme.spacing.md,
  },
  tipCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  tipRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  tipTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  tipBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  sampleSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
