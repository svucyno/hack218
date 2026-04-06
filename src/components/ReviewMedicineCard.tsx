import { StyleSheet, Text, View } from 'react-native';

import { formatInstructionLabel, formatWarningLabel, getTranslation, type AppLanguage } from '../constants/languages';
import { theme } from '../theme';
import type { ReviewMedicine } from '../types/intake';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { StatusBadge } from './StatusBadge';
import { WarningTag } from './WarningTag';

type ReviewMedicineCardProps = {
  language: AppLanguage;
  medicine: ReviewMedicine;
  onConfirm?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
};

export function ReviewMedicineCard({ language, medicine, onConfirm, onEdit, onRemove }: ReviewMedicineCardProps) {
  return (
    <View style={[styles.card, medicine.confirmed && styles.cardConfirmed]}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{medicine.name}</Text>
          <Text style={styles.subtitle}>{formatInstructionLabel(language, medicine.frequency)}</Text>
        </View>
        <StatusBadge
          icon={medicine.confirmed ? 'check-circle' : 'help-circle'}
          label={medicine.confirmed ? getTranslation(language, 'review.confirmed') : getTranslation(language, 'review.needsReview')}
          variant={medicine.confirmed ? 'accent' : 'secondary'}
        />
      </View>

      <View style={styles.fieldGrid}>
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>{getTranslation(language, 'review.dosage')}</Text>
          <Text style={styles.fieldValue}>{medicine.dosage || getTranslation(language, 'review.missingDosage')}</Text>
        </View>
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>{getTranslation(language, 'review.timing')}</Text>
          <Text style={styles.fieldValue}>{medicine.timing || getTranslation(language, 'review.timingUnclear')}</Text>
        </View>
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>{getTranslation(language, 'review.duration')}</Text>
          <Text style={styles.fieldValue}>{formatInstructionLabel(language, medicine.duration)}</Text>
        </View>
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>{getTranslation(language, 'review.food')}</Text>
          <Text style={styles.fieldValue}>{formatInstructionLabel(language, medicine.foodTiming)}</Text>
        </View>
      </View>

      {medicine.warnings.length > 0 ? (
        <View style={styles.warningRow}>
          {medicine.warnings.map((warning) => (
            <WarningTag key={warning} language={language} warning={warning} />
          ))}
        </View>
      ) : null}

      {medicine.edited ? <Text style={styles.editedNote}>{getTranslation(language, 'review.editedNote')}</Text> : null}

      <View style={styles.actionsColumn}>
        <PrimaryButton icon="check" label={getTranslation(language, 'review.confirm')} onPress={onConfirm} />
        <View style={styles.secondaryRow}>
          <View style={styles.flexButton}>
            <SecondaryButton icon="edit-2" label={getTranslation(language, 'review.edit')} onPress={onEdit} />
          </View>
          <View style={styles.flexButton}>
            <SecondaryButton icon="trash-2" label={getTranslation(language, 'review.remove')} onPress={onRemove} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardConfirmed: {
    borderColor: theme.colors.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  fieldCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    gap: 4,
    minWidth: '47%',
    padding: theme.spacing.md,
  },
  fieldLabel: {
    color: theme.colors.secondary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  fieldValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  warningRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  editedNote: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
    fontStyle: 'italic',
  },
  actionsColumn: {
    gap: theme.spacing.sm,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
