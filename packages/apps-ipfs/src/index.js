// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0
import './index.css';
import 'react-virtualized/styles.css';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { I18nextProvider } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Provider } from 'redux-bundler-react';

import ComponentLoader from '@polkadot/apps-ipfs/loader/ComponentLoader';

import bundleCache from './lib/bundle-cache';
import DndBackend from './lib/dnd-backend';
import App from './App';
import getStore from './bundles';
import i18n from './i18n';
import { useThemeClass } from './theme';

const appVersion = process.env.REACT_APP_VERSION;
const gitRevision = process.env.REACT_APP_GIT_REV;

console.log(`IPFS Web UI - v${appVersion} - https://github.com/ipfs-shipyard/ipfs-webui/commit/${gitRevision}`);

function IpfsApp () {
  const [store, setStore] = useState(null);
  const history = useHistory();
  const theme = useThemeClass()

  useEffect(() => {
    try {
      if (store !== null) return
      bundleCache.getAll().then((initialData) => {
        if (initialData && process.env.NODE_ENV !== 'production') {
          console.log('intialising store with data from cache', initialData);
        }

        console.log(initialData, 'initialData');
        const s = getStore(initialData);

        setStore(s);
      }).catch((e) => {
        history.go(0);
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }, [store]);

  return store
    ? <Provider store={store}>
      <I18nextProvider i18n={i18n} >
        <DndProvider backend={DndBackend}>
          <App theme={theme} />
        </DndProvider>
      </I18nextProvider>
    </Provider>
    : <ComponentLoader pastDelay />;
}

export default IpfsApp;
