// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { SortedAccount } from '@polkadot/app-accounts/types';
import { sortAccounts } from '@polkadot/app-accounts/util';
import { useTranslation } from '@polkadot/apps/translate';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import Banner from '../Banner';
import Summary from './Summary';
import { FoundsType } from '../modals/types';
import Bond from '../modals/Bond';
import Merchant from './Merchant';

interface Balances {
  accounts: Record<string, BN>;
  balanceTotal?: BN;
}

interface Sorted {
  sortedAccounts: SortedAccount[];
  sortedAddresses: string[];
}

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

const STORE_FAVS = 'accounts:favorites';

function StorageMarket ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [{ sortedAccounts }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
  const [ownMerchants, setOwnMerchants] = useState<SortedAccount[] | undefined>();
  const [isBondOpen, toggleBond] = useToggle();
  const [allMerchants, setAllMerchants] = useState<string[]>([]);
  const [totalLockup, setTotalLockup] = useState<BN>(BN_ZERO);
  const [unlocking, setUnlocking] = useState<BN>(BN_ZERO);
  const [reductionQuota, setReductionQuota] = useState<BN>(BN_ZERO);
  const currentBenefits = useCall<any>(api.query.benefits.currentBenefits);

  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('Merchant'), 'start', 2],
    [t('Collateral')],
    [t('Unlocking')],
    [t('Maximum Receivable Income')],
    [t('Order Discount Ratio')],
    [t('Settlement Free Funds (Current Era)')],
    []
  ]);

  const getMarketBenifits = () => {
    let unsub: (() => void) | undefined;
    const fns: any[] = [
      [api.query.benefits.marketBenefits.entries]
    ];
    const allMerchants: string[] = [];

    api.combineLatest<any[]>(fns, ([ledger]): void => {
      if (Array.isArray(ledger)) {
        let unlocking = BN_ZERO;
        ledger.forEach(([{ args: [accountId] }, value]) => {
          allMerchants.push(accountId.toString());
          for (const unlockingLegder of value.unlocking_funds) {
            unlocking = unlocking.add(new BN(Number(unlockingLegder.value).toString()));
          }
        });
        setUnlocking(unlocking);
        setAllMerchants(allMerchants);
      }
    }).then((_unsub): void => {
      unsub = _unsub;
    }).catch(console.error);

    return (): void => {
      unsub && unsub();
    };
  };

  useEffect(() => {
    getMarketBenifits();
  }, []);

  useEffect(() => {
    const tmp: SortedAccount[] = [];

    if (sortedAccounts && allMerchants) {
      for (const myAccount of sortedAccounts) {
        if (allMerchants.includes(myAccount.account.address.toString())) {
          tmp.push(myAccount);
        }
      }

      setOwnMerchants(tmp);
    }
  }, [sortedAccounts, allMerchants]);

  useEffect(() => {
    const benefit = currentBenefits && JSON.parse(JSON.stringify(currentBenefits))
    if (benefit) {
      // let total = BN_ZERO;
      setTotalLockup(benefit.total_market_active_funds)
      setReductionQuota(benefit.total_fee_reduction_quota)
    }

  }, [currentBenefits])

  useEffect((): void => {
    const sortedAccounts = sortAccounts(allAccounts, favorites);
    const sortedAddresses = sortedAccounts.map((a) => a.account.address);

    setSorted({ sortedAccounts, sortedAddresses });
  }, [allAccounts, favorites]);

  const _setBalance = useCallback(
    (account: string, balance: BN) =>
      setBalances(({ accounts }: Balances): Balances => {
        accounts[account] = balance;
        return {
          accounts,
          balanceTotal: Object.values(accounts).reduce((total: BN, value: BN) => total.add(value), BN_ZERO)
        };
      }),
    []
  );

  const filter = useMemo(() => (
    <div className='filter--tags'>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name or tags')}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  ), [filterOn, t]);

  return (
    <div className={className}>
      {isBondOpen && (
        <Bond
          onClose={toggleBond}
          onSuccess={getMarketBenifits}
          foundsType={FoundsType.MARKET}
        />
      )}  
      <h2>
        {t<string>('Lock CRU Tokens to obtain Storage Market Benefits')}
      </h2>
      <Banner type='warning'>
        <p>{t<string>('Users can obtain storage order discounts and reductions of order settlement transaction fees by locking CRU tokens as storage market collateral. As a storage merchant, the collateral is a necessary condition for receiving the storage market income. The collateal can obtain the same amount of income limit, accumulated storage market income will not increase after the  reaches the income limit, and the storage merchant needs to get income in time.')}</p>
      </Banner>
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Register')}
          onClick={toggleBond}
        />
        {/* <Button
          icon='users'
          label={t<string>('Join group')}
          onClick={toggleJoinGroup}
        />
        <Button
          icon='sign-in-alt'
          label={t<string>('Quit group')}
          onClick={toggleQuitGroup}
        /> */}
      </Button.Group>
      <Summary isLoading={isLoading} summaryInfo={{
        unlocking,
        totalLockup,
        reductionQuota
      }} />
      
      <Table
        empty={(!hasAccounts || (!isLoading)) && t<string>("You don't have merchant accounts. Some features are currently hidden and will only become available once you have merchant accounts.")}
        header={headerRef.current}
        filer={filter}
      >
        {!isLoading && ownMerchants?.map(({ account, delegation, isFavorite }): React.ReactNode => (
          <Merchant
            account={account}
            delegation={delegation}
            filter={filterOn}
            isFavorite={isFavorite}
            key={account.address}
            setBalance={_setBalance}
            toggleFavorite={toggleFavorite}
            reductionQuota={reductionQuota}
            totalLockup={totalLockup}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(StorageMarket)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
