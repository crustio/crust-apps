// // [object Object]
// // SPDX-License-Identifier: Apache-2.0
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import ICU from 'i18next-icu';
import en from 'i18next-icu/locale-data/en';

const localeData = [en];

const i18nInstance = i18n.createInstance();

i18nInstance.use(new ICU({ localeData }))
  .use(Backend)
  .use(LanguageDetector).init({
    backend: {
      backends: [HttpBackend],
      backendOptions: [
        {
        // HttpBackend
        // ensure a relative path is used to look up the locales, so it works when loaded from /ipfs/<cid>
          loadPath: 'ipfs-locales/{{lng}}/{{ns}}.json'
        }
      ]
    },
    ns: ['app', 'welcome', 'status', 'files', 'explore', 'peers', 'settings', 'notify', 'order'],
    defaultNS: 'app',
    fallbackNS: 'app',
    fallbackLng: {
      default: ['en']
    },
    // react i18next special options (optional)
    react: {
      wait: true,
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  });
i18n.on('languageChanged', (e) => {
  i18nInstance.changeLanguage(i18n.language);
});
export default i18nInstance;
