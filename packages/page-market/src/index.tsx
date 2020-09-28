// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AppProps as Props } from '@polkadot/react-components/types';
import { ElectionStatus } from '@polkadot/types/interfaces';
import ApiPromise from '@polkadot/api/promise';

import React, { useEffect, useMemo, useState } from 'react';
// import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts, useApi, useAvailableSlashes, useCall, useFavorites, useOwnStashInfos, useStashIds } from '@polkadot/react-hooks';
// import { isFunction } from '@polkadot/util';
import basicMd from './md/basic.md';
import Actions from './Actions';
import Overview from './Overview';
import Summary from './Overview/Summary';
import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import useSortedTargets from './useSortedTargets';

const HIDDEN_ACC = ['actions', 'payouts', 'query'];
const HIDDEN_QUE = ['returns', 'query'];

const transformElection = {
  transform: (status: ElectionStatus) => status.isOpen
};

async function loadMerchants(api: ApiPromise) {
  const result: any[] = [];
  const keys = await api.query.market.merchants.keys();
  keys.forEach(e => {
    const keyStr = e.toHuman();
    if (Array.isArray(keyStr)) {
      result.push(keyStr[0]);
    } else {
      result.push(keyStr);
    }
  })
  return result;
}

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const allStashes = useStashIds();
  const ownStashes = useOwnStashInfos();
  const slashes = useAvailableSlashes();
  const targets = useSortedTargets(favorites);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const isInElection = useCall<boolean>(api.query.staking?.eraElectionStatus, undefined, transformElection);
  const [merchants, setMerchants ] = useState<string[]>([]);
  const reserved = useCall<any>(api.query.swork.reserved);
  const used = useCall<any>(api.query.swork.used);

  const hasQueries = useMemo(
    () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
    [api, hasAccounts]
  );

  useEffect(() => {
    loadMerchants(api).then(setMerchants);
  }, [api])

  const next = useMemo(
    () => (allStashes && stakingOverview)
      ? allStashes.filter((address) => !stakingOverview.validators.includes(address as any))
      : undefined,
    [allStashes, stakingOverview]
  );

  // const ownValidators = useMemo(
  //   () => (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
  //   [ownStashes]
  // );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Market overview')
    },
    {
      name: 'actions',
      text: t<string>('Account actions')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, slashes, t]);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            !hasAccounts
              ? HIDDEN_ACC
              : !hasQueries
                ? HIDDEN_QUE
                : undefined
          }
          items={items}
        />
      </header>
      <Summary
        isVisible={pathname === basePath}
        next={next}
        used={used}
        reserved={reserved}
        nominators={targets.nominators}
        stakingOverview={stakingOverview}
      />
      <Actions
        className={pathname === `${basePath}/actions` ? '' : 'staking--hidden'}
        isInElection={isInElection}
        ownStashes={ownStashes}
        targets={targets}
        next={next}
      />
      <Overview
        className={basePath === pathname ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        next={next}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
        merchants={merchants}
      />
    </main>
  );
}

export default React.memo(styled(StakingApp)`
  .staking--hidden {
    display: none;
  }

  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    text-align: right;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: darkred;
    }
  }
`);
