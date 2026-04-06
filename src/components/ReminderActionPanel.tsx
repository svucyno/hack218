import { StyleSheet, View } from 'react-native';

import { getTranslation, type AppLanguage } from '../constants/languages';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { theme } from '../theme';

type ReminderActionPanelProps = {
  language: AppLanguage;
  onTaken: () => void;
  onMissed: () => void;
  onRemindAgain: () => void;
  onNoResponse: () => void;
};

export function ReminderActionPanel({ language, onTaken, onMissed, onRemindAgain, onNoResponse }: ReminderActionPanelProps) {
  return (
    <View style={styles.container}>
      <PrimaryButton icon="check" label={getTranslation(language, 'statuses.taken')} onPress={onTaken} />
      <SecondaryButton icon="x-circle" label={getTranslation(language, 'statuses.missed')} onPress={onMissed} />
      <SecondaryButton icon="rotate-ccw" label={getTranslation(language, 'reminder.remindAgain')} onPress={onRemindAgain} />
      <SecondaryButton icon="help-circle" label={getTranslation(language, 'reminder.noResponse')} onPress={onNoResponse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
});
