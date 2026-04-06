import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatInstructionLabel, formatLanguageName, getTranslation, localizeKnownText, type AppLanguage, type TranslationKey } from '../constants/languages';
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
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  activeReminder: MedicationItem | null;
  closeReminder: () => void;
  replayReminderVoice: () => void;
  remindAgain: () => void;
  respondToReminder: (status: 'Taken' | 'Missed' | 'Unconfirmed') => void;
};

export function ReminderDetailScreen({ navigation, language, t, activeReminder, closeReminder, replayReminderVoice, remindAgain, respondToReminder }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const languageLabel = formatLanguageName(language, language);

  if (!activeReminder) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <ScreenHeader eyebrow={t('reminder.eyebrow')} title={t('reminder.emptyTitle')} subtitle={t('reminder.emptySubtitle')} />
          <EmptyStateCard detail={t('reminder.emptyDetail')} icon="check-circle" title={t('common.done')} />
          <PrimaryButton icon="arrow-left" label={t('common.home')} onPress={() => navigation.navigate('AppTabs', { screen: 'HomeTab' })} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={t('reminder.eyebrow')} title={t('reminder.title')} subtitle={t('reminder.subtitle')} helper={<StatusBadge icon="volume-2" label={languageLabel} variant="accent" />} />

        {feedback ? <SuccessStateCard detail={feedback} title={t('common.updated')} /> : null}

        <VoicePromptIndicator language={language} languageLabel={languageLabel} />
        <StatusBadge icon="clock" label={`${activeReminder.timing} · ${formatInstructionLabel(language, activeReminder.foodTiming)}`} variant="neutral" />

        <ReminderActionPanel
          language={language}
          onMissed={() => {
            setFeedback(t('reminder.missedFeedback'));
            respondToReminder('Missed');
            setTimeout(() => navigation.goBack(), 350);
          }}
          onNoResponse={() => {
            setFeedback(t('reminder.unconfirmedFeedback'));
            respondToReminder('Unconfirmed');
            setTimeout(() => navigation.goBack(), 350);
          }}
          onRemindAgain={() => {
            remindAgain();
            setFeedback(t('reminder.repeatFeedback'));
          }}
          onTaken={() => {
            setFeedback(t('reminder.takenFeedback'));
            respondToReminder('Taken');
            setTimeout(() => navigation.goBack(), 350);
          }}
        />

        <SecondaryButton icon="volume-2" label={t('reminder.playAgain')} onPress={() => { replayReminderVoice(); setFeedback(t('reminder.voiceReplayed')); }} />
        <SecondaryButton icon="x" label={t('common.close')} onPress={() => { closeReminder(); navigation.goBack(); }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl },
});
