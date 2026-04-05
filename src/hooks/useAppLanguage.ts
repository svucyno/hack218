import { useState } from 'react';

import { translations, type AppLanguage, type TranslationKey } from '../constants/languages';

export function useAppLanguage() {
  const [language, setLanguage] = useState<AppLanguage>('en');

  const t = (key: TranslationKey) => translations[language][key] ?? translations.en[key];

  return { language, setLanguage, t };
}
