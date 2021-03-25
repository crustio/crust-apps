// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { EraIndex, Exposure } from '@polkadot/types/interfaces';

interface Props {
  stashId: string;
  activeEra: EraIndex;
}

function EffectiveStake ({ activeEra, stashId }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const exposure = useCall<Exposure>(api.query.staking.erasStakers, [JSON.stringify(activeEra), stashId]);
  let stakeValue = new BN(0);

  if (exposure && JSON.parse(JSON.stringify(exposure)) !== null) {
    stakeValue = exposure.own.unwrap();
  }

  return (
    <td className='number all'>
      {(
        <FormatBalance value={stakeValue} />
      )}
    </td>
  );
}

export default React.memo(EffectiveStake);
