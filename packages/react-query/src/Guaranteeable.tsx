// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Exposure, Balance, EraIndex } from '@polkadot/types/interfaces';
import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import FormatBalance from './FormatBalance';
import BN from 'bn.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function GuaranteeableDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const currentEra =  useCall<EraIndex>(api.query.staking.currentEra);
  const stakingInfo = useCall<Exposure>(api.query.staking.erasStakers, [JSON.stringify(currentEra), params]);
  const stakeLimit = useCall<Option<Balance>>(api.query.staking.stakeLimit, [params]);
  let guaranteeable = new BN(0)
  if (stakingInfo && stakeLimit?.isSome) {
    guaranteeable = stakingInfo && stakeLimit && stakeLimit.unwrap().sub(stakingInfo.total.unwrap())
  }

  return (
    <FormatBalance
      className={className}
      label={label}
      value={guaranteeable}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(GuaranteeableDisplay);
