// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveStakingAccount } from '@polkadot/api-derive/types';

import React from 'react';
import { FormatBalance } from '@polkadot/react-query';
import BN from 'bn.js';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingBonded ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {

  const stakingLedger = stakingInfo && JSON.parse(JSON.stringify(stakingInfo));
  let balance = new BN(0);
  if (stakingInfo && stakingLedger) {
    balance = new BN((Number(stakingLedger?.active)).toString());
  }

  if (!balance?.gtn(0)) {
    return null;
  }

  return (
    <FormatBalance
      className={className}
      value={balance}
    />
  );
}

export default React.memo(StakingBonded);
