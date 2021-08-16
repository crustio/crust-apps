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
import CreateGroup from '../modals/CreateGroup';
import GroupOwner from './GroupOwner';
import Summary, { SummaryInfo } from './Summary';
import JoinGroup from '../modals/JoinGroup';
import QuitGroup from '../modals/QuitGroup';

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

function WorkReport ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [{ sortedAccounts }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
  const [ownOwners, setOwnOwners] = useState<SortedAccount[] | undefined>();
  const [isCreateOpen, toggleCreate] = useToggle();
  const [isJoinGroupOpen, toggleJoinGroup] = useToggle();
  const [isQuitGroupOpen, toggleQuitGroup] = useToggle();
  const [allOwners, setAllOwners] = useState<string[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo>({
    totalLockup: BN_ZERO,
    unlocking: BN_ZERO
  });

  const multiQuery = useCall<any[]>(api.query.benefits.sworkBenefits.multi, [ownOwners?.map(e => e.account.address)]);

  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('Group owner'), 'start', 2],
    [t('No. of Group members')],
    [t('Lockup/Recommended lock volume')],
    [t('Unlocking')],
    [t('Deduction of last Era')],
    []
  ]);

  const getGroups = () => {
    let unsub: (() => void) | undefined;
    const fns: any[] = [
      [api.query.swork.groups.entries]
    ];
    const allOwners: string[] = [];

    api.combineLatest<any[]>(fns, ([groups]): void => {
      if (Array.isArray(groups)) {
        groups.forEach(([{ args: [accountId] }]) => {
          allOwners.push(accountId.toString());
        });
        setAllOwners(allOwners);
      }
    }).then((_unsub): void => {
      unsub = _unsub;
    }).catch(console.error);

    return (): void => {
      unsub && unsub();
    };
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    const tmp: SortedAccount[] = [];

    if (sortedAccounts && allOwners) {
      for (const myAccount of sortedAccounts) {
        if (allOwners.includes(myAccount.account.address.toString())) {
          tmp.push(myAccount);
        }
      }

      setOwnOwners(tmp);
    }
  }, [sortedAccounts, allOwners]);

  useEffect(() => {
    const tmp = multiQuery && JSON.parse(JSON.stringify(multiQuery))
    if (tmp && tmp.length) {
        let total = BN_ZERO;
        let unlocking = BN_ZERO;
        for (const legder of tmp) {
          total = total.add(new BN(Number(legder.total_funds).toString()))
          for (const unlockingLegder of legder.unlocking_funds) {
            unlocking = unlocking.add(new BN(Number(unlockingLegder.value).toString()))
          }
        }
        setSummaryInfo({
          totalLockup: total,
          unlocking
        })
    }

  }, [multiQuery, ownOwners])

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
      {isCreateOpen && (
        <CreateGroup
          key='modal-transfer'
          onClose={toggleCreate}
          onSuccess={getGroups}
        /> 
      )}  
      {isJoinGroupOpen && (
        <JoinGroup
          key='modal-joinGroup'
          onClose={toggleJoinGroup}
          onSuccess={getGroups}
        /> 
      )}  
      {isQuitGroupOpen && (
        <QuitGroup
          key='modal-quitGroup'
          onClose={toggleQuitGroup}
          onSuccess={getGroups}
        /> 
      )}  
      <h2>
        {t<string>('Lock CRU to reduce the transaction fees of work reporting')}
      </h2>
      <Banner type='warning'>
        <p>{t<string>('Group Owners can reduce the transaction fees of work reporting for Group members by locking CRU. For each 3CRU locked up, the transaction fees can be reduced once for each Era. If the number of reduced transaction fees is exceeded, the transaction fee of Group members will be charged normally.')}</p>
      </Banner>
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Create group')}
          onClick={toggleCreate}
        />
        <Button
          icon='users'
          label={t<string>('Join group')}
          onClick={toggleJoinGroup}
        />
        <Button
          icon='sign-in-alt'
          label={t<string>('Quit group')}
          onClick={toggleQuitGroup}
        />
      </Button.Group>
      <Summary isLoading={isLoading} summaryInfo={summaryInfo} />
      
      <Table
        empty={(!hasAccounts || (!isLoading)) && t<string>("You don't have group accounts. Some features are currently hidden and will only become available once you have group accounts.")}
        header={headerRef.current}
        filer={filter}
      >
        {!isLoading && ownOwners?.map(({ account, delegation, isFavorite }, index): React.ReactNode => (
          <GroupOwner
            account={account}
            delegation={delegation}
            filter={filterOn}
            isFavorite={isFavorite}
            key={account.address}
            setBalance={_setBalance}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(WorkReport)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
