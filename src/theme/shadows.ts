import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#2F3642',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 18,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  soft: Platform.select({
    ios: {
      shadowColor: '#2F3642',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
} as const;
