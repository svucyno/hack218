import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ReminderActionPanel } from '../components/ReminderActionPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessStateCard } from '../components/SuccessStateCard';
import { VoicePromptIndicator } from '../components/VoicePromptIndicator';
import { theme } from '../theme';
import type { MedicationItem } from '../types/medication';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ReminderDetail'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  activeReminder: MedicationItem | null;
  closeReminder: () => void;
  replayReminderVoice: () => void;
  remindAgain: () => void;
  respondToReminder: (status: 'Taken' | 'Missed' | 'Unconfirmed') => void;
};

export function ReminderDetailScreen({ navigation, language, activeReminder, closeReminder, replayReminderVoice, remindAgain, respondToReminder }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const languageLabel = language === 'te' ? 'Telugu' : 'English';

  if (!activeReminder) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <ScreenHeader eyebrow="Reminder" title="No reminder" subtitle="Nothing active now." />
          <EmptyStateCard detail="All active doses have been handled." icon="check-circle" title="Done" />
          <PrimaryButton icon="arrow-left" label="Home" onPress={() => navigation.navigate('AppTabs', { screen: 'HomeTab' })} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Reminder"
          title="Medicine time"
          subtitle="Choose one action."
          helper={<StatusBadge icon="volume-2" label={languageLabel} variant="accent" />}
        />

        {feedback ? <SuccessStateCard detail={feedback} title="Updated" /> : null}

        <VoicePromptIndicator languageLabel={languageLabel} />

        <ReminderActionPanel
          onMissed={() => {
            setFeedback('Dose marked missed.');
            respondToReminder('Missed');
            setTimeout(() => navigation.goBack(), 350);
          }}
          onNoResponse={() => {
            setFeedback('Dose marked unconfirmed.');
            respondToReminder('Unconfirmed');
            setTimeout(() => navigation.goBack(), 350);
          }}
          onRemindAgain={() => {
            remindAgain();
            setFeedback('Reminder will repeat.');
          }}
          onTaken={() => {
            setFeedback('Dose marked taken.');
            respondToReminder('Taken');
            setTimeout(() => navigation.goBack(), 350);
          }}
        />

        <SecondaryButton
          icon="volume-2"
          label="Play again"
          onPress={() => {
            replayReminderVoice();
            setFeedback('Voice replayed.');
          }}
        />
        <SecondaryButton
          icon="x"
          label="Close"
          onPress={() => {
            closeReminder();
            navigation.goBack();
          }}
        />
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
});
