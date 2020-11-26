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
  activeEra: EraIndex;
}

function EffectiveGuaranteed ({ activeEra, stashId }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  console.log('123 cnm')
  const exposure = useCall<Exposure>(api.query.staking.erasStakers, [JSON.stringify(activeEra), stashId])
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
  )
}

export default React.memo(EffectiveGuaranteed);