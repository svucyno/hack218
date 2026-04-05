import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LanguageToggle } from '../components/LanguageToggle';
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

export function ReminderDetailScreen({
  navigation,
  language,
  setLanguage,
  activeReminder,
  closeReminder,
  replayReminderVoice,
  remindAgain,
  respondToReminder,
}: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const languageLabel = language === 'te' ? 'Telugu' : 'English';

  if (!activeReminder) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <ScreenHeader
            eyebrow="Reminder"
            title="No active reminder"
            subtitle="There is no medicine reminder open right now."
            rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
          />
          <EmptyStateCard detail="All active doses have been handled for the moment." icon="check-circle" title="No current reminder" />
          <PrimaryButton icon="arrow-left" label="Back to Home" onPress={() => navigation.navigate('AppTabs', { screen: 'HomeTab' })} />
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
          subtitle="Choose the clearest action for this dose."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
          helper={<StatusBadge icon="volume-2" label={`${languageLabel} voice prompt`} variant="accent" />}
        />

        {feedback ? <SuccessStateCard detail={feedback} title="Reminder updated" /> : null}

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Feather color={theme.colors.primary} name="bell" size={24} />
          </View>
          <Text style={styles.heroTitle}>{activeReminder.name}</Text>
          <Text style={styles.heroDose}>{activeReminder.dosage}</Text>
          <Text style={styles.heroTiming}>{activeReminder.timing}</Text>
          <Text style={styles.heroFood}>{activeReminder.foodTiming}</Text>
        </View>

        <VoicePromptIndicator languageLabel={languageLabel} />

        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Simple reminder</Text>
          <Text style={styles.messageBody}>Medicine time. Please take your medicine now.</Text>
          <Text style={styles.messageBodySecondary}>తెలుగు ప్లేస్‌హోల్డర్: మందు తీసుకునే సమయం.</Text>
          <SecondaryButton
            fullWidth={false}
            icon="volume-2"
            label="Play voice again"
            onPress={() => {
              replayReminderVoice();
              setFeedback('Voice reminder replayed in the selected language.');
            }}
          />
        </View>

        <ReminderActionPanel
          onMissed={() => {
            setFeedback('Missed dose recorded. Caregiver attention may be needed.');
            respondToReminder('Missed');
            setTimeout(() => navigation.goBack(), 350);
          }}
          onNoResponse={() => {
            setFeedback('No response recorded. Dose marked as unconfirmed.');
            respondToReminder('Unconfirmed');
            setTimeout(() => navigation.goBack(), 350);
          }}
          onRemindAgain={() => {
            remindAgain();
            setFeedback('Reminder will play again shortly.');
          }}
          onTaken={() => {
            setFeedback('Dose recorded as taken.');
            respondToReminder('Taken');
            setTimeout(() => navigation.goBack(), 350);
          }}
        />

        <SecondaryButton
          icon="x"
          label="Close reminder"
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
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
  },
  heroDose: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title,
    fontWeight: '800',
    lineHeight: 30,
  },
  heroTiming: {
    color: theme.colors.secondary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  heroFood: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  messageTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  messageBody: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 26,
  },
  messageBodySecondary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
