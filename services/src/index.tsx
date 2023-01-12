import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Theme from 'components/Theme';
import router from 'routes';
import 'styles/index.scss';

import en from 'i18n/en.json'
import vi from 'i18n/vi.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: "en",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Theme>
      {router}
    </Theme>
  </React.StrictMode>
);
