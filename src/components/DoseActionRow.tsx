import { StyleSheet, View } from 'react-native';

import { type AppLanguage, getTranslation } from '../constants/languages';
import { theme } from '../theme';
import type { MedicationStatus } from '../types/medication';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

type DoseActionRowProps = {
  language: AppLanguage;
  status: MedicationStatus;
  onTaken: () => void;
  onMissed: () => void;
  onUnconfirmed: () => void;
};

export function DoseActionRow({ language, status, onTaken, onMissed, onUnconfirmed }: DoseActionRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.flexButton}>
          <PrimaryButton icon="check" label={getTranslation(language, 'statuses.taken')} onPress={onTaken} />
        </View>
        <View style={styles.flexButton}>
          <SecondaryButton icon="x-circle" label={getTranslation(language, 'statuses.missed')} onPress={onMissed} />
        </View>
      </View>
      <View style={styles.thirdButton}>
        <SecondaryButton
          fullWidth={false}
          icon="help-circle"
          label={getTranslation(language, status === 'Unconfirmed' ? 'statuses.unconfirmed' : 'statuses.pending')}
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
