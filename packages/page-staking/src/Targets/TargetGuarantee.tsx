// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { AddressMini, InputBalance } from '@polkadot/react-components';
import { useTranslation } from '../translate';

interface Props {
  validatorId: string;
  targetAmount: Map<string, BN>;
  setTargetAmount: (targetAmount: Map<string, BN>) => void;
}

function TargetGuarantee ({ validatorId, targetAmount, setTargetAmount}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));

  useEffect( () => {
    const tmp = new Map<string, BN>();
    for (const entry of targetAmount.entries()) {
      tmp.set(entry[0], entry[1]);
    }
    amount && tmp.set(validatorId, amount);
    setTargetAmount(tmp);
  }, [amount])

  return (
        <div>
         <AddressMini
          className='addressStatic'
          key={validatorId}
          value={validatorId}
        />
          <InputBalance
            className='addressStatic'
            autoFocus
            help={t<string>('Type the amount you want to guarantee. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
            isZeroable
            label={t<string>('amount')}
            onChange={setAmount}
            withMax
          />
        </div>
      )

}

export default React.memo(TargetGuarantee);
