import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  HomeTab: undefined;
  ScheduleTab: undefined;
  UploadTab: undefined;
  CaregiverTab: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  LanguageSelection: undefined;
  AppTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ReminderDetail: undefined;
  ExtractionPreview: undefined;
  ReviewMedicines: undefined;
};

export type AppTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
