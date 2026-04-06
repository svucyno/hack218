import { useState } from 'react';

import { getTranslation, type AppLanguage, type TranslationKey } from '../constants/languages';

export function useAppLanguage() {
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [hasCompletedLanguageSetup, setHasCompletedLanguageSetup] = useState(false);

  const setLanguage = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
  };

  const completeLanguageSetup = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    setHasCompletedLanguageSetup(true);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  return {
    language,
    setLanguage,
    t,
    hasCompletedLanguageSetup,
    completeLanguageSetup,
  };
}
