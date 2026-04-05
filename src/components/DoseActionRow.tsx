import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import type { MedicationStatus } from '../types/medication';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

type DoseActionRowProps = {
  status: MedicationStatus;
  onTaken: () => void;
  onMissed: () => void;
  onUnconfirmed: () => void;
};

export function DoseActionRow({ status, onTaken, onMissed, onUnconfirmed }: DoseActionRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.flexButton}>
          <PrimaryButton icon="check" label="Taken" onPress={onTaken} />
        </View>
        <View style={styles.flexButton}>
          <SecondaryButton icon="x-circle" label="Missed" onPress={onMissed} />
        </View>
      </View>
      <View style={styles.thirdButton}>
        <SecondaryButton
          fullWidth={false}
          icon="help-circle"
          label={status === 'Unconfirmed' ? 'Still Unconfirmed' : 'Mark Unconfirmed'}
          onPress={onUnconfirmed}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  thirdButton: {
    alignSelf: 'flex-start',
  },
});
