// Copyright 2017-2021 @polkadot/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import IpfsApp from '@polkadot/apps-ipfs/';
import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { KeyedEvent } from '@polkadot/react-query/src/types';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

const IpfsPage: React.FC<Props> = (props) => {
  const { api } = useApi();
  const { t } = useTranslation('apps-routing');
  const itemsRef = useRef([
    {
      isRoot: true,
      name: '/',
      text: t('status', 'Status')
    },
    {
      hasParams: true,
      name: 'files',
      text: t('files', 'Files')
    },
    {
      name: 'market',
      text: t('market', 'Storage Market')
    },
    {
      name: 'explore',
      text: t('explore', 'Explore')
    },
    {
      name: 'peers',
      text: t('peers', 'Peers')
    },
    {
      name: 'settings',
      text: t('settings', 'IPFS Setting')
    }
  ]);

  return (
    <main>
      <header>
        <Tabs basePath={'/storage'}
          hidden={api.query.babe ? undefined : []}
          isRoot
          items={itemsRef.current} />
      </header>
      <IpfsApp />
    </main>
  );
};

export default IpfsPage;
