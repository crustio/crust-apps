// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';

import React, { useRef } from 'react';

import CrustFiles from '@polkadot/app-files/CrustFiles';
import { useLoginUser } from '@polkadot/app-files/hooks';
import Login from '@polkadot/app-files/Login';
import User from '@polkadot/app-files/User';
import { Spinner, Tabs } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function FilesApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'crust',
      text: t<string>('Your Files')
    }
  ]);
  const wUser = useLoginUser();
  const isLoad = wUser.isLoad;

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      {wUser.isLoad && <Spinner/>}
      {!isLoad && wUser.account && <CrustFiles user={wUser}/>}
      {!isLoad && !wUser.account && <Login user={wUser}/>}
      {!isLoad && wUser.account && <User user={wUser}/>}
    </main>
  );
}

export default React.memo(FilesApp);
