// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { ElectionStatus } from '@polkadot/types/interfaces';
import ApiPromise from '@polkadot/api/promise';

import React, { useEffect, useMemo, useState } from 'react';
// import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts, useApi, useCall, useFavorites } from '@polkadot/react-hooks';
// import { isFunction } from '@polkadot/util';
import Actions from './Actions';
import Overview from './Overview';
import Summary from './Overview/Summary';
import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import { MerchantSortInfo } from './types';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';

const HIDDEN_ACC = ['actions', 'payouts', 'query'];
const HIDDEN_QUE = ['returns', 'query'];

const transformElection = {
  transform: (status: ElectionStatus) => status.isOpen
};

export interface AccountMerchantInfo {
  accountId: string
  merchantInfo: MerchantInfo,
  free: BN
}

interface MerchantInfo extends Codec {
  [x: string]: any;
  address: 'Vec<u8>',
  storage_price: 'Balance',
  file_map: 'Vec<(Vec<u8>, Vec<Hash>)>'
}

// interface WorkReport extends Codec {
//   [x: string]: any;
//   block_number: 'u64',
//   used: 'u64',
//   reserved: 'u64',
//   cached_reserved: 'u64',
//   files: 'Vec<(Vec<u8>, u64)>'
// }

// async function loadMerchants(api: ApiPromise) {
//   const result: any[] = [];
//   const keys = await api.query.market.merchants.keys();
//   keys.forEach(e => {
//     const keyStr = e.toHuman();
//     if (Array.isArray(keyStr)) {
//       result.push(keyStr[0]);
//     } else {
//       result.push(keyStr);
//     }
//   })
//   return result;
// }

async function loadMerchantsInfo(api: ApiPromise) {
  const result: any[] = [];
  const entries = await api.query.market.merchants.entries();
  // const workReports = await api.query.swork.workReports.entries();
  // entries.forEach(([account, info]) => {
  //   let accountId = account.toHuman();
  //   if (Array.isArray(accountId)) {
  //     accountId = accountId[0];
  //   }
  //   const workReport = workReports.find(([reporter]) => { 
  //     return reporter.toHuman()?.toString() === account.toHuman()?.toString() });
  //   result.push({
  //     accountId,
  //     merchantInfo: info,
  //     workReport: workReport?.[1]
  //   })
  // })

  for (const [account, info] of entries) {
    let free = new BN(0);
    let accountId = account.toHuman();
    if (Array.isArray(accountId)) {
      accountId = accountId[0];
    }
    const idBonds = (await api.query.swork.idBonds(accountId?.toString())).toHuman();
    if (Array.isArray(idBonds)) {
      for (const pk of idBonds) {
        const workReports = JSON.parse(JSON.stringify(await api.query.swork.workReports(pk?.toString())));
        free = free.add(new BN(workReports?.free));
      }
    }
    result.push({
      accountId,
      merchantInfo: info,
      free
    })
  }

  return result;
}

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const isInElection = useCall<boolean>(api.query.staking?.eraElectionStatus, undefined, transformElection);
  const [ merchants, setMerchants ] = useState<string[]>([]);
  const reserved = useCall<any>(api.query.swork.free);
  const used = useCall<any>(api.query.swork.used);
  const [ accountMerchants, setAccountMerchants ] = useState<AccountMerchantInfo[]>([]);
  const [ totalOrderCount, setTotalOrderCount ] = useState<Number>(0);
  const [ merchantSortInfo, setMerchantSortInfo ] = useState<MerchantSortInfo[]>([]);

  const hasQueries = useMemo(
    () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
    [api, hasAccounts]
  );

  useEffect(() => {
    if (accountMerchants.length) {
      const tmpMerchantInfo: MerchantSortInfo[] = [];
      setMerchants(accountMerchants.map(e => e.accountId));
      let total = 0;
      for (const merchant of accountMerchants) {
        let m = JSON.parse(JSON.stringify(merchant.merchantInfo));
        let tmpCount = 0;
        if (m.file_map.length) {
          let m_file_map = m.file_map;
          for (const file of m_file_map) {
            total += file[1].length;
            tmpCount += file[1].length;
          }
        }

        tmpMerchantInfo.push({
          accountId: merchant.accountId, 
          rankCapacity: merchant.free.toNumber(), 
          rankPrice: merchant.merchantInfo.unwrap().storage_price, 
          rankOrderCount: tmpCount,
          isFavorite: favorites.includes(merchant.accountId)
        })

      }
      setMerchantSortInfo(tmpMerchantInfo)
      setTotalOrderCount(total);
    }
  }, [accountMerchants, favorites]);

  useEffect(() => {
    loadMerchantsInfo(api).then(setAccountMerchants);
  }, [api])

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
  ].filter((q): q is { name: string; text: string } => !!q), [api, t]);

  return (
    <main className={`staking--App ${className}`}>
      {/* <HelpOverlay md={basicMd as string} /> */}
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
        used={used}
        reserved={reserved}
        totalOrderCount={totalOrderCount}
      />
      <Actions
        className={pathname === `${basePath}/actions` ? '' : 'staking--hidden'}
        isInElection={isInElection}
      />
      <Overview
        className={basePath === pathname ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        toggleFavorite={toggleFavorite}
        merchants={merchants}
        merchantSortInfo={merchantSortInfo}
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
