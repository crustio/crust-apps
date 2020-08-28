// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IndividualExposure } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  stakeValue?: BN;
  validators: IndividualExposure[];
}

function EffectedStake ({ validators, stakeValue }: Props): React.ReactElement<Props> {

  return (
    <td className='number all'>
      {(
        <>
          <Expander summary={
            <FormatBalance
              labelPost={` (${validators.length})`}
              value={stakeValue}
            />
          }>
            {validators.map(({who, value}): React.ReactNode =>
              <AddressMini
                bonded={value}
                key={who.toString()}
                value={who}
                withBonded
              />
            )}
          </Expander>
        </>
      )}
    </td>
  );
}

export default React.memo(EffectedStake);
