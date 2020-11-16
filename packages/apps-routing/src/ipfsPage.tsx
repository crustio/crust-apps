// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import IpfsApp from '@polkadot/apps-ipfs/';
import { KeyedEvent } from '@polkadot/react-query/src/types';
import { useTranslation as useTranslationBase, UseTranslationResponse } from 'react-i18next';
import { useApi } from '@polkadot/react-hooks';
interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function useTranslation (): UseTranslationResponse {
  return useTranslationBase(['apps-routing']);
}

const IpfsPage: React.FC<Props> = (props) => {
  const { api } = useApi();
  const { t } = useTranslation();
  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'status',
      text: t<string>('nav.status')
    },
    {
      hasParams: true,
      name: 'files',
      text: t<string>('nav.files')
    },
    {
      name: 'explorer',
      text: t<string>('nav.explore')
    },
    {
      name: 'peers',
      text: t<string>('nav.peers')
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

export default React.memo(IpfsPage);
