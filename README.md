# MedBridge

MedBridge is a mobile-first Expo + React Native + TypeScript MVP shell for a bilingual post-discharge medication safety and adherence assistant.

## Folder structure

```text
src/
  api/            backend client helpers and endpoint modules
  components/     reusable UI primitives
  screens/        feature screens for the MVP flow
  navigation/     React Navigation stack
  constants/      bilingual copy and app constants
  theme/          color, spacing, radius, typography, shadows
  data/           fallback mock medication and caregiver data
  hooks/          app-level state helpers
  types/          navigation and domain types
```

## Design system

MedBridge uses a restrained healthcare palette with only three core brand colors plus neutral surfaces:

- Primary soft violet: `#8E87C8`
- Secondary calm blue: `#6F95B8`
- Light accent lavender-blue: `#EDF0FA`
- Surface white: `#FFFFFF`
- Background neutral: `#F6F7FB`
- Border gray: `#E4E7EE`
- Text dark gray: `#2F3642`

The UI favors large readable text, roomy spacing, soft rounded cards, and very light shadow use.

## Run the project

```bash
npm install
npm run start
```

You can also run:

```bash
npm run android
npm run ios
npm run web
```

## Backend API URL

Set the frontend API base URL with:

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:8000
```

For a physical phone on the same Wi-Fi, this should usually be your laptop LAN IP, not `localhost`.
Do not put secrets in `EXPO_PUBLIC_*` variables.

## Complete in this MVP shell

- Expo + TypeScript project initialized
- React Navigation stack wired
- Mobile-first frontend shell for six screens
- Reusable components: `PrimaryButton`, `SecondaryButton`, `ScreenHeader`, `MedicationCard`, `StatusBadge`
- Theme tokens for colors, spacing, radius, typography, and light shadows
- English-first bilingual toggle with Telugu placeholder translations in `src/constants/languages.ts`
- FastAPI-backed upload, review, schedule, patient-today, and dose-status integration with local fallback

## Intentionally mocked

- OCR and prescription parsing
- Authentication
- Notifications and reminders delivery
- Persistent storage
- Real upload processing from device files
- Real medication adherence syncing across sessions
