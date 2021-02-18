// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance, StakingLedger } from '@polkadot/types/interfaces';
import type { DeriveStakingOverview, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import React, { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { Guarantee } from '@polkadot/app-staking/Actions/Account';
import { useTranslation } from '@polkadot/react-components/translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

const transformBonded = {
  transform: (value: Option<AccountId>): string | null =>
    value.isSome
      ? value.unwrap().toString()
      : null
};

const transformLedger = {
  transform: (value: Option<StakingLedger>): Balance | null =>
    value.isSome
      ? value.unwrap().active.unwrap()
      : null
};

const parseObj = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}

function BalanceUnbond ({ params }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo);
  const [validators, setValidators] = useState<string[]>([]);
  const isOwnValidator = validators.includes(params?.toString() as string);

  useEffect(() => {
    if (stakingOverview && waitingInfo) {
      const overview = JSON.parse(JSON.stringify(stakingOverview));
      const waiting = JSON.parse(JSON.stringify(waitingInfo));

      setValidators([...waiting.waiting, ...overview.nextElected]);
    }
  }, [stakingOverview, waitingInfo]);

  const accountIdBonded = useCall<string | null>(api.query.staking.bonded, [params], transformBonded);
  const controllerActive = useCall<Balance | null>(api.query.staking.ledger, [accountIdBonded], transformLedger);
  const ownGuarantors = useCall<Option<Guarantee>>(api.query.staking.guarantors, [params]);
  const totalStaked = ownGuarantors && parseObj(ownGuarantors)?.total;
  const totalActive = new BN(Number(controllerActive).toString());
  
  if (isOwnValidator) {
    return null;
  }

  return (
    <>
      <span className='highlight'>{t<string>('total guarantee')} { formatBalance(totalStaked)}/{t<string>('total stakes')} {formatBalance(totalActive, {withUnit: true})}</span>      
    </>
  );
}

export default React.memo(BalanceUnbond);