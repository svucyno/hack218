import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { AdherenceActivityItem } from '../types/medication';

const iconMap: Record<AdherenceActivityItem['type'], 'check-circle' | 'alert-circle' | 'help-circle' | 'users' | 'clock' | 'bell'> = {
  taken: 'check-circle',
  missed: 'alert-circle',
  unconfirmed: 'help-circle',
  caregiver: 'users',
  system: 'clock',
  reminder: 'bell',
};

type ActivityTimelineItemProps = {
  item: AdherenceActivityItem;
};

export function ActivityTimelineItem({ item }: ActivityTimelineItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Feather color={theme.colors.secondary} name={iconMap[item.type]} size={15} />
      </View>
      <View style={styles.copy}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          <Text style={styles.time}>{item.timeLabel}</Text>
        </View>
        <Text numberOfLines={1} style={styles.detail}>{item.detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    flex: 1,
    fontSize: theme.typography.bodySmall,
    fontWeight: '800',
    lineHeight: 20,
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  detail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    lineHeight: 18,
  },
});
