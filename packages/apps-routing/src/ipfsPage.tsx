// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// @ts-ignore
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
  const history = useHistory();
  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'status',
      text: t('status', 'Status')
    },
    {
      hasParams: true,
      name: 'files',
      text: t('files', 'Files')
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
      name: 'market',
      text: t('market', 'Storage Market')
    },
    {
      name: 'settings',
      text: t('settings', 'IPFS Setting')
    }
  ]);

  useEffect(() => {
    history.push('/storage');
  }, []);

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
