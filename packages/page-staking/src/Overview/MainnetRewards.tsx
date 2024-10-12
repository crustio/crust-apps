// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import {ActiveEraInfo} from '@polkadot/types/interfaces';

import React, {useEffect, useState} from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import BN from 'bn.js';
import {Icon, Spinner, Tooltip} from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import { formatBalance } from '@polkadot/util';
import {ApiPromise} from "@polkadot/api/promise";

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

async function getStakingRewards(api: ApiPromise , idx: number): Promise<BN> {
  const erasp = await api.query.staking.erasStakingPayout(idx);
  const erasStakingPayout = JSON.parse(JSON.stringify(erasp));
  const keys = await api.query.staking.erasAuthoringPayout.keys(idx);

  let totalValue = new BN(0);
  for (const key of keys) {
    const [_, accountId] = key.args;
    const value = await api.query.staking.erasAuthoringPayout(idx, accountId);
    totalValue = totalValue.add(new BN(value.toString()));
  }

  return totalValue.add(new BN(erasStakingPayout as string));
}

function MainnetReward ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true)
  const [stakingRewards, setStakingRewards] = useState<BN>(new BN(0))
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);

  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);
  const marketPayout = useCall<any>(api.query.staking.erasMarketPayout, [activeEra]);
  // const stakingRewards = new BN(3011.635871031734).mul(UNIT)
  const total = marketPayout && stakingRewards.add(new BN(Number(marketPayout).toString()))

  useEffect(() => {
    if (!activeEra) return
    getStakingRewards(api, activeEra as number - 1).then((res: BN) => {
      setLoading(false)
      setStakingRewards(res);
    })
  }, [activeEra]);

  return (
    <div className={className}>
      {label || ''}
      {loading && <Spinner noLabel />}
      {!loading &&
        <FormatBalance
          value={total}
          withSi
          label={
            <Icon
              icon='info-circle'
              tooltip={`mainnet-reward-trigger`}
            />
          }
        >
          <Tooltip
            text={
              <>
                <div>
                  <div className='faded'>{t('staking payout: {{stakingRewards}}', {
                    replace: {
                      stakingRewards: formatBalance(stakingRewards)
                    }
                  })}</div>
                  <div className='faded'>{t('market payout: {{marketPayout}}', {
                    replace: {
                      marketPayout: marketPayout && formatBalance(new BN(Number(marketPayout).toString()))
                    }
                  })}</div>
                </div>
              </>
            }
            trigger={`mainnet-reward-trigger`}
          />
        </FormatBalance>
      }
      {children}
    </div>
  );
}

export default React.memo(MainnetReward);
