// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IndividualExposure } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { EraIndex, Exposure } from '@polkadot/types/interfaces';
import { BN_ZERO } from '@polkadot/util';
import { useCall, useApi } from '@polkadot/react-hooks';

interface Props {
  stakeValue?: BN;
  validators: IndividualExposure[];
  stashId: string;
  currentEra: EraIndex;
}

function EffectiveStake ({ validators, stakeValue, currentEra, stashId }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  let guaranteeTargets: [string, BN, BN][] = [];
  if (validators && JSON.parse(JSON.stringify(validators)) !== null && currentEra && JSON.parse(JSON.stringify(currentEra)) !== null) {
    let tmpTargets = JSON.parse(JSON.stringify(validators));
    let params = tmpTargets.map((e: { who: any; }) => e.who);
    let query = [];
    for (const param of params) {
      query.push([currentEra.toHuman(), param]);
    }
    const multiQuery = useCall<Exposure[]>(api.query.staking.erasStakers.multi, [query]);

    if (multiQuery) {
      for (let index = 0; index < tmpTargets?.length; index++) {
        let guaranteeTarget:[string, BN, BN] = [tmpTargets[index].who, new BN(0), tmpTargets[index].value];
        const exposure = multiQuery[index];
        if (exposure) {
          for (const other of exposure.others) {
            if (other.who.toString() === stashId) {
              guaranteeTarget[1] = other.value.unwrap();
            }
          }
        }
        guaranteeTargets.push(guaranteeTarget);
      }
    }
    stakeValue = guaranteeTargets.reduce((total: BN, [who, value]) => { return total.add(new BN(Number(value).toString()))}, BN_ZERO);
  }


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
            {guaranteeTargets.map(([who, value, stake]): React.ReactNode =>
              <AddressMini
                bonded={value}
                key={who.toString()}
                value={who}
                balance={stake}
                withBonded
                withBalance
              />
            )}
          </Expander>
        </>
      )}
    </td>
  );
}

export default React.memo(EffectiveStake);
