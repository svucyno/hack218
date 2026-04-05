import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ReminderDetail'> & {
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
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Reminder"
          subtitle="There is no active reminder right now."
          rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        />
        <EmptyStateCard
          detail="All active doses have been handled for the moment."
          icon="check-circle"
          title="No current reminder"
        />
        <PrimaryButton icon="arrow-left" label="Back to dashboard" onPress={() => navigation.navigate('Home')} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="Reminder"
        title="Medicine time"
        subtitle="Please choose the simplest action for this dose."
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
        helper={<StatusBadge icon="volume-2" label={`${languageLabel} reminder ready`} variant="accent" />}
      />

      {feedback ? <SuccessStateCard detail={feedback} title="Reminder updated" /> : null}

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Feather color={theme.colors.primary} name="bell" size={26} />
        </View>
        <Text style={styles.heroTitle}>{activeReminder.name}</Text>
        <Text style={styles.heroDose}>{activeReminder.dosage}</Text>
        <Text style={styles.heroTiming}>{activeReminder.timing}</Text>
        <Text style={styles.heroFood}>{activeReminder.foodTiming}</Text>
      </View>

      <VoicePromptIndicator languageLabel={languageLabel} />

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>Simple reminder message</Text>
        <Text style={styles.messageBody}>Medicine time. Please take your tablet now.</Text>
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

      <View style={styles.footerNote}>
        <Text style={styles.footerTitle}>Low-literacy support</Text>
        <Text style={styles.footerBody}>
          This demo keeps the reminder calm and simple with large actions, limited text, and a voice cue indicator.
        </Text>
      </View>

      <SecondaryButton
        icon="x"
        label="Close reminder"
        onPress={() => {
          closeReminder();
          navigation.goBack();
        }}
      />
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
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xxl,
    ...theme.shadows.card,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title,
    fontWeight: '800',
    lineHeight: 32,
    textAlign: 'center',
  },
  heroDose: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.display,
    fontWeight: '800',
    lineHeight: 36,
  },
  heroTiming: {
    color: theme.colors.secondary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  heroFood: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
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
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  messageBody: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 28,
  },
  messageBodySecondary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footerNote: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  footerTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
  },
  footerBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
