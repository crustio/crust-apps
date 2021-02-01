// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import { IndividualExposure, EraIndex, Exposure } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';
import { useCall, useApi } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

interface Props {
  stakeValue?: BN;
  validators: IndividualExposure[];
  stashId: string;
  activeEra: EraIndex;
}

function EffectiveStake ({ activeEra, stakeValue, stashId, validators }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const guaranteeTargets: [string, BN, BN][] = [];

  if (validators && JSON.parse(JSON.stringify(validators)) !== null && activeEra && JSON.parse(JSON.stringify(activeEra)) !== null) {
    let tmpTargets = JSON.parse(JSON.stringify(validators));
    let params = tmpTargets.map((e: { who: any; }) => e.who);
    let query = [];
    for (const param of params) {
      query.push([activeEra, param]);
    };
    const multiQuery = useCall<Exposure[]>(api.query.staking.erasStakers.multi, [query]);

    if (multiQuery) {
      for (let index = 0; index < tmpTargets?.length; index++) {
        let guaranteeTarget:[string, BN, BN] = [tmpTargets[index].who, new BN('0'), new BN(tmpTargets[index].value?.toString())];
        const exposure = multiQuery[index];
        if (exposure) {
          for (const other of exposure.others) {
            if (other.who.toString() === stashId) {
              guaranteeTarget[1] = new BN(other.value.toString());
            }
          }
        }
        guaranteeTargets.push(guaranteeTarget);
      }
    }
    stakeValue = guaranteeTargets.reduce((total: BN, [who, value]) => { return total.add(new BN(value.toString()))}, BN_ZERO);
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
