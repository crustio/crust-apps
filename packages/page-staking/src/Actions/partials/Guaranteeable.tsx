// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import React from 'react';

import { Guarantee } from '@polkadot/app-staking/Actions/Account';
import { useTranslation } from '@polkadot/react-components/translate';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { AccountId, AccountIndex, ActiveEraInfo, Address, Balance, Exposure, StakingLedger } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';

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
};

function GuaranteeableDisplay ({ params }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { api } = useApi();
  const stakeLimit = useCall<Option<Balance>>(api.query.staking.stakeLimit, [params]);
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);

  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);

  const accountIdBonded = useCall<string | null>(api.query.staking.bonded, [params], transformBonded);
  const controllerActive = useCall<Balance | null>(api.query.staking.ledger, [accountIdBonded], transformLedger);
  const erasStakersStashExposure = useCall<Option<Exposure>>(api.query.staking.erasStakers, [activeEra, params]);
  const erasStakersStash = erasStakersStashExposure && (parseObj(erasStakersStashExposure).others.map((e: { who: any; }) => e.who));

  const stakersGuarantees = useCall<Guarantee[]>(api.query.staking.guarantors.multi, [erasStakersStash]);
  let totalStaked = new BN(Number(controllerActive).toString());

  if (stakersGuarantees) {
    for (const stakersGuarantee of stakersGuarantees) {
      if (parseObj(stakersGuarantee)) {
        for (const target of parseObj(stakersGuarantee)?.targets) {
          if (target.who.toString() == params?.toString()) {
            totalStaked = totalStaked?.add(new BN(Number(target.value).toString()));
          }
        }
      }
    }
  }

  return (
    <>
      <span className='highlight'>{t<string>('total stakes')} {formatBalance(totalStaked, { withUnit: true })} / {t<string>('stake limit')} { formatBalance(new BN(Number(stakeLimit).toString()))}</span>
    </>
  );
}

export default React.memo(GuaranteeableDisplay);
