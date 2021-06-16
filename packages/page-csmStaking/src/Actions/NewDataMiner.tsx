// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { } from 'react';

import { Button } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';

function NewDataMiner (): React.ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <Button
        icon='plus'
        key='new-data-miner'
        label={t<string>('New data miner')}
      />

    </>
  );
}

export default React.memo(NewDataMiner);
