// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { ThemeDef } from '@polkadot/react-components/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import { settings } from '@polkadot/ui-settings';

import Apps from './Apps';
import { darkTheme, lightTheme } from './themes';
import WindowDimensions from './WindowDimensions';

interface Props {
  store?: KeyringStore;
}

function createTheme ({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = uiTheme === 'dark' ? 'dark' : 'light';

  document && document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme);

  return uiTheme === 'dark'
    ? darkTheme
    : lightTheme;
}

export function getQueryStringArgs () {
  const qs = window.location.search.length > 0 ? window.location.search.substring(1) : '';
  const args: any = {};
  const items = qs.length ? qs.split('&') : [];
  const length = items.length;

  for (let i = 0; i < length; i++) {
    const item = items[i].split('=');
    const name = decodeURIComponent(item[0]);
    const value = decodeURIComponent(item[1]);

    if (name.length) {
      if (name === 'address') {
        args.elrondAddress = value;
      } else {
        args[name] = value;
      }
    }
  }

  return args;
}

function Root ({ store }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(() => createTheme(settings));
  const client = useRef(new QueryClient());

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  const args = getQueryStringArgs();

  if (args.elrondAddress) {
    let params = '?';

    Object.keys(args).forEach((e) => {
      params += e + '=' + args[e] + '&';
    });
    window.location.assign(`${window.location.origin}${window.location.pathname}${params}/#/bridge/elrondToCrust`);
    // window.location.reload();
  }

  return (
    <Suspense fallback='...'>
      <ThemeProvider theme={theme}>
        <Queue>
          <QueryClientProvider client={client.current}>
            <Api
              store={store}
              url={settings.apiUrl}
            >
              <BlockAuthors>
                <Events>
                  <HashRouter>
                    <WindowDimensions>
                      <Apps />
                    </WindowDimensions>
                  </HashRouter>
                </Events>
              </BlockAuthors>
            </Api>
          </QueryClientProvider>
        </Queue>
      </ThemeProvider>
    </Suspense>
  );
}

export default React.memo(Root);
