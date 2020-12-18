// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import uiSettings, { LANGUAGE_DEFAULT } from '@polkadot/ui-settings';
import Backend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  lookup: () => {
    const i18nLang = uiSettings.i18nLang;

    return i18nLang === LANGUAGE_DEFAULT ? undefined : i18nLang;
  },
  name: 'i18nLangDetector'
});

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    backend: {
      backends: [HttpBackend],
      backendOptions: [
        {
          // LocalStorageBackend
          defaultVersion: 'v1',
          expirationTime: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 1 : 7 * 24 * 60 * 60 * 1000
        },
        {
          // HttpBackend
          // ensure a relative path is used to look up the locales, so it works when loaded from /ipfs/<cid>
          loadPath: 'locales/{{lng}}/{{ns}}.json'
        }
      ]
    },
    debug: false,
    detection: {
      order: ['i18nLangDetector', 'navigator']
    },
    fallbackLng: false,
    interpolation: {
      escapeValue: false
    },
    load: 'languageOnly',
    ns: [
      'apps',
      'app',
      'apps-config',
      'apps-electron',
      'apps-routing',
      'app-accounts',
      'app-claims',
      'app-contracts',
      'app-council',
      'app-democracy',
      'app-explorer',
      'app-extrinsics',
      'app-generic-asset',
      'app-js',
      'app-parachains',
      'app-poll',
      'app-rpc',
      'app-settings',
      'app-signing',
      'app-society',
      'app-staking',
      'app-storage',
      'app-sudo',
      'app-tech-comm',
      'app-treasury',
      'react-api',
      'react-components',
      'react-hooks',
      'react-params',
      'react-query',
      'react-signer',
      'translation'
    ],
    react: {
      wait: true
    },
    returnEmptyString: false,
    returnNull: false
  })
  .catch((error: Error): void => console.log('i18n: failure', error));

uiSettings.on('change', (settings): void => {
  console.log(settings.i18nLang);
  i18next
    .changeLanguage(
      settings.i18nLang === LANGUAGE_DEFAULT
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        i18next.services.languageDetector.detect()
        : settings.i18nLang
    )
    .catch(console.error);
});

export default i18next;
