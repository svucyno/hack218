import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadDocument'> & {
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
  t,
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Upload prescription or discharge paper"
        subtitle="Choose the clearest document you have. MedBridge will turn it into a simple medicine schedule to review."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        helper={<StatusBadge icon="file-text" label="Printed or clear typed pages work best" variant="accent" />}
      />

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Feather color={theme.colors.primary} name="shield" size={24} />
        </View>
        <Text style={styles.heroTitle}>Start with one clear document</Text>
        <Text style={styles.heroBody}>
          Use a hospital discharge summary, typed prescription, or a clear photo of the medicine list.
        </Text>
      </View>

      {isOpening ? (
        <SuccessStateCard title="Preparing demo document" detail="Mock extraction is starting so you can continue the guided MedBridge story." />
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

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Helpful note</Text>
        <Text style={styles.noteBody}>
          The demo works best with printed or clearly typed medicine instructions. Handwritten notes may need extra review.
        </Text>
      </View>

      <View style={styles.sampleSection}>
        <Text style={styles.sectionTitle}>Demo sample document</Text>
        <DocumentPreviewCard
          dateLabel={demoDocument.dateLabel}
          source={demoDocument.source}
          summary={demoDocument.summary}
          title={demoDocument.title}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton icon="play-circle" label="Continue with sample document" onPress={handleContinue} />
        <SecondaryButton
          icon="arrow-right"
          label={selectedUploadMethod ? 'Preview selected upload' : t('backHome')}
          onPress={() =>
            selectedUploadMethod ? navigation.navigate('ExtractionPreview') : navigation.navigate('Home')
          }
        />
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
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyLarge,
    lineHeight: 28,
  },
  optionList: {
    gap: theme.spacing.md,
  },
  noteCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  noteTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  noteBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  sampleSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
