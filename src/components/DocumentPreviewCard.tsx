import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type DocumentPreviewCardProps = {
  title: string;
  source: string;
  dateLabel: string;
  summary: string;
};

export function DocumentPreviewCard({ title, source, dateLabel, summary }: DocumentPreviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.thumbnail}>
        <Feather color={theme.colors.primary} name="file-text" size={28} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{source} · {dateLabel}</Text>
        <Text style={styles.summary}>{summary}</Text>
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
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  thumbnail: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLarge,
    fontWeight: '800',
    lineHeight: 24,
  },
  meta: {
    color: theme.colors.secondary,
    fontSize: theme.typography.bodySmall,
    fontWeight: '700',
  },
  summary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
