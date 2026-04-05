import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage, TranslationKey } from '../constants/languages';
import { LanguageToggle } from '../components/LanguageToggle';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { theme } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadDocument'> & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

export function UploadDocumentScreen({ navigation, language, setLanguage, t }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('uploadTitle')}
        subtitle={t('uploadSubtitle')}
        rightAction={<LanguageToggle value={language} onChange={setLanguage} />}
      />

      <View style={styles.uploadCard}>
        <View style={styles.uploadIcon}>
          <Feather name="file-plus" size={28} color={theme.colors.primary} />
        </View>
        <Text style={styles.uploadTitle}>Large tap target for a future upload flow</Text>
        <Text style={styles.uploadBody}>
          Patients can bring in a discharge summary, handwritten prescription, or medicine strip
          photo.
        </Text>
      </View>

      <View style={styles.checklistCard}>
        <Text style={styles.checklistTitle}>Helpful file examples</Text>
        <Text style={styles.checklistItem}>- Discharge summary PDF</Text>
        <Text style={styles.checklistItem}>- Prescription photo from the hospital</Text>
        <Text style={styles.checklistItem}>- Medicine label photo for a caregiver to review</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label={t('uploadButton')} />
        <SecondaryButton label={t('backHome')} onPress={() => navigation.navigate('Home')} />
      </View>
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
  },
  uploadCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    gap: theme.spacing.md,
    padding: theme.spacing.xxl,
  },
  uploadIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  uploadTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
  },
  uploadBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  checklistCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  checklistTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  checklistItem: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
