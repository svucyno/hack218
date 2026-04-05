import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { theme } from '../theme';

type ReminderActionPanelProps = {
  onTaken: () => void;
  onMissed: () => void;
  onRemindAgain: () => void;
  onNoResponse: () => void;
};

export function ReminderActionPanel({ onTaken, onMissed, onRemindAgain, onNoResponse }: ReminderActionPanelProps) {
  return (
    <View style={styles.container}>
      <PrimaryButton icon="check" label="Taken" onPress={onTaken} />
      <SecondaryButton icon="x-circle" label="Missed" onPress={onMissed} />
      <SecondaryButton icon="rotate-ccw" label="Remind me again" onPress={onRemindAgain} />
      <SecondaryButton icon="help-circle" label="No response" onPress={onNoResponse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
});
