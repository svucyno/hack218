import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { demoDocument, uploadMethods } from '../data/intakeMockData';
import type { TranslationKey } from '../constants/languages';
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
  t: (key: TranslationKey) => string;
  selectedUploadMethod: UploadMethod | null;
  selectUploadMethod: (method: UploadMethod) => void;
  continueWithSampleDocument: () => Promise<void>;
  apiNotice: string | null;
};

export function UploadDocumentScreen({ navigation, selectedUploadMethod, selectUploadMethod, continueWithSampleDocument, apiNotice }: Props) {
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
          eyebrow="Upload"
          title="Upload"
          subtitle="Add a clear document."
          rightAction={<HeaderIconButton icon="settings" onPress={() => navigation.navigate('Settings')} />}
          helper={<StatusBadge icon="file-text" label="Clear pages work best" variant="accent" />}
        />

        {apiNotice ? <EmptyStateCard title="Using demo data" detail={apiNotice} /> : null}
        {isOpening ? <SuccessStateCard title="Preparing" detail="Opening sample document." /> : null}

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

        <View style={styles.sampleSection}>
          <Text style={styles.sectionTitle}>Sample</Text>
          <DocumentPreviewCard
            dateLabel={demoDocument.dateLabel}
            source={demoDocument.source}
            summary={demoDocument.summary}
            title={demoDocument.title}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton icon="play-circle" label="Continue" onPress={() => void handleContinue()} />
          <SecondaryButton
            icon="arrow-right"
            label={selectedUploadMethod ? 'Review' : 'Home'}
            onPress={() => (selectedUploadMethod ? navigation.navigate('ExtractionPreview') : navigation.navigate('HomeTab'))}
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
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  optionList: {
    gap: theme.spacing.sm,
  },
  sampleSection: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  footer: {
    gap: theme.spacing.sm,
  },
});
