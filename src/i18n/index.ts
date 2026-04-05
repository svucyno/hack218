export const translations = {
  en: {
    hello: 'Hello',
    upload: 'Upload Document',
    extract_medicines: 'Extracting Medicines...',
    taken: 'Taken',
    missed: 'Missed',
    unconfirmed: 'Unconfirmed',
    alerts: 'Alerts',
    adherence: 'Health Score',
    next_dose: 'Next Dose',
    medicine_time: 'Medicine Time',
    caregiver_alert: 'Caregiver Alert',
    morning: 'Morning',
    afternoon: 'Afternoon',
    night: 'Night',
    before_food: 'Before Food',
    after_food: 'After Food'
  },
  te: {
    hello: 'నమస్కారం',
    upload: 'పత్రం అప్‌లోడ్ చేయండి',
    extract_medicines: 'మందులను సంగ్రహిస్తోంది...',
    taken: 'వేసుకున్నారు',
    missed: 'వేసుకోలేదు',
    unconfirmed: 'నిర్ధారించబడలేదు',
    alerts: 'హెచ్చరికలు',
    adherence: 'ఆరోగ్య స్కోర్',
    next_dose: 'తదుపరి మందు',
    medicine_time: 'మందుల సమయం',
    caregiver_alert: 'సంరక్షకుని హెచ్చరిక',
    morning: 'ఉదయం',
    afternoon: 'మధ్యాహ్నం',
    night: 'రాత్రి',
    before_food: 'భోజనానికి ముందు',
    after_food: 'భోజనం తర్వాత'
  }
};

export type LanguageKey = keyof typeof translations['en'];

// Utility text fetcher if we implemented context
export function t(key: LanguageKey, lang: 'en' | 'te' = 'en') {
  return translations[lang][key] || translations['en'][key];
}
