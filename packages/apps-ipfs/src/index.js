// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import App from './App';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'redux-bundler-react';
import './index.css';
import 'react-virtualized/styles.css';

import getStore from './bundles';
import bundleCache from './lib/bundle-cache';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { DndProvider } from 'react-dnd';
import DndBackend from './lib/dnd-backend';

const appVersion = process.env.REACT_APP_VERSION;
const gitRevision = process.env.REACT_APP_GIT_REV;

console.log(`IPFS Web UI - v${appVersion} - https://github.com/ipfs-shipyard/ipfs-webui/commit/${gitRevision}`);

function IpfsApp () {
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    bundleCache.getAll().then((data) => {
      setInitialData(data);
    });
  });

  if (initialData && process.env.NODE_ENV !== 'production') {
    console.log('intialising store with data from cache', initialData);
  }

  const store = getStore(initialData);

  return <Provider store={store}>
    <I18nextProvider i18n={i18n} >
      <DndProvider backend={DndBackend}>
        <App />
      </DndProvider>
    </I18nextProvider>
  </Provider>;
}

export default React.memo(IpfsApp);
