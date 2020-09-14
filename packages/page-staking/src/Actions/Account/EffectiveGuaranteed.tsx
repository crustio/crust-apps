// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { FormatBalance } from '@polkadot/react-query';
import { useApi, useCall } from '@polkadot/react-hooks';
import { EraIndex, Exposure } from '@polkadot/types/interfaces';

interface Props {
  stashId: string;
  currentEra: EraIndex;
}

function EffectiveGuaranteed ({ currentEra, stashId }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const exposure = useCall<Exposure>(api.query.staking.erasStakers, [currentEra.toHuman(), stashId])
  let stakeValue = new BN(0);
  if (exposure && JSON.parse(JSON.stringify(exposure)) !== null && currentEra && JSON.parse(JSON.stringify(currentEra)) !== null) {
    stakeValue = exposure.own.unwrap();
  }

  return (
    <td className='number media--1100'>
      {(
        <FormatBalance value={stakeValue} />
      )}
    </td>
  )
}

export default React.memo(EffectiveGuaranteed);