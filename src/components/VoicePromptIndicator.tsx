import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { getTranslation, type AppLanguage } from '../constants/languages';
import { theme } from '../theme';

type VoicePromptIndicatorProps = {
  language: AppLanguage;
  languageLabel: string;
};

export function VoicePromptIndicator({ language, languageLabel }: VoicePromptIndicatorProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather color={theme.colors.primary} name="volume-2" size={20} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{getTranslation(language, 'reminder.voiceTitle')}</Text>
        <Text style={styles.detail}>{getTranslation(language, 'reminder.voiceDetail', { language: languageLabel })}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  detail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
