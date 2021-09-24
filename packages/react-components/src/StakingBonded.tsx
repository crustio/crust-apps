// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveStakingAccount } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';

import { Guarantee } from '@polkadot/app-staking/Actions/Account';
import { useTranslation } from '@polkadot/apps/translate';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { Expander, Label } from '.';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingBonded ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const balance = stakingInfo?.stakingLedger?.active.unwrap();
  const stash = stakingInfo && stakingInfo.accountId.toString();

  const guarantors = useCall<Guarantee>(api.query.staking.guarantors, [stash]);
  const guarantorInfo = guarantors && JSON.parse(JSON.stringify(guarantors));

  if (!balance?.gtn(0)) {
    return null;
  }

  return (
    <Expander summary={
      <FormatBalance
        value={balance}
      />
    }>
      {guarantorInfo && <div className='ui--AddressInfo-expander'>
        <Label label={t<string>('guaranteed')} /><FormatBalance value={guarantorInfo.total}/>
        <Label label={t<string>('unguaranteed')} /><FormatBalance value={balance.sub(new BN(Number(guarantorInfo.total).toString()))}/>
      </div>}
      {/* <FormatBalance value={guarantorInfo.total}/> */}
    </Expander>
  );
}

export default React.memo(StakingBonded);
