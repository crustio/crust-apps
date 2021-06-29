// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */


import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Expander } from '@polkadot/react-components';
import { FormatCsmBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';
import { useCall, useApi } from '@polkadot/react-hooks';
import AddressMiniForStake from './AddressMiniForStake';

interface Props {
  guarantors: string[];
}

interface Guarantor {
    account: string;
    stakes: BN;
}

function GuarantorStake ({ guarantors }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const multiQuery = useCall<any[]>(api.query.csmLocking.ledger.multi, [guarantors]);
  const [guarantorStakes, setGuarantorStakes] = useState<Guarantor[]>([]);
  const [stakeValue, setStakeValue] = useState<BN>(BN_ZERO);

  useEffect(() => {
    const tmp = multiQuery && JSON.parse(JSON.stringify(multiQuery))
    if (tmp && tmp.length) {
        let total = BN_ZERO
        const tmpGuarantor = [];
        for (const index in guarantors) {
            const stakes = new BN(Number(tmp[index].active).toString());
            total = total.add(stakes)
            tmpGuarantor.push({
                account: guarantors[index],
                stakes
            })
        }
        setStakeValue(total);
        setGuarantorStakes(tmpGuarantor);
    }

  }, [multiQuery, guarantors])

  return (
    <td className='number'>
      {(
        <>
          <Expander summary={
            <FormatCsmBalance
              labelPost={` (${guarantors.length})`}
              value={stakeValue}
            />
          }>
            {guarantorStakes.map(({account, stakes}): React.ReactNode =>               
              <AddressMiniForStake key={account} value={account} totalStake={stakes} />
            )}
          </Expander>
        </>
      )}
    </td>
  );
}

export default React.memo(GuarantorStake);
