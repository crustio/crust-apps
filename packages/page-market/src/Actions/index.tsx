// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { AccountId, ProxyDefinition, ProxyType, Voting } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useApi, useAccounts, useCall, useFavorites, useLoadingDelay } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Input, Table } from '@polkadot/react-components';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import Account from './Account';
import { Delegation, SortedAccount } from '@polkadot/app-accounts/types';
import { sortAccounts } from '@polkadot/app-accounts/util';

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

// query the ledger for the address, adding it to the keyring

function Overview ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [{ balanceTotal }, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [sortedAccountsWithDelegation, setSortedAccountsWithDelegation] = useState<SortedAccount[] | undefined>();
  const [{ sortedAccounts, sortedAddresses }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
  const delegations = useCall<Voting[]>(api.query.democracy?.votingOf?.multi, [sortedAddresses]);
  const proxies = useCall<[ProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [sortedAddresses], {
    transform: (result: [([AccountId, ProxyType] | ProxyDefinition)[], BN][]): [ProxyDefinition[], BN][] =>
      api.tx.proxy.addProxy.meta.args.length === 3
        ? result as [ProxyDefinition[], BN][]
        : (result as [[AccountId, ProxyType][], BN][]).map(([arr, bn]): [ProxyDefinition[], BN] =>
          [arr.map(([delegate, proxyType]): ProxyDefinition => api.createType('ProxyDefinition', { delegate, proxyType })), bn]
        )
  });
  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('accounts'), 'start', 3],
    [t('parent'), 'address media--1400'],
    [t('type')],
    [t('tags'), 'start'],
    [t('transactions'), 'media--1500'],
    [t('balances')],
    [],
    [undefined, 'media--1400']
  ]);

  useEffect((): void => {
    const sortedAccounts = sortAccounts(allAccounts, favorites);
    const sortedAddresses = sortedAccounts.map((a) => a.account.address);

    setSorted({ sortedAccounts, sortedAddresses });
  }, [allAccounts, favorites]);

  useEffect(() => {
    if (api.query.democracy?.votingOf && !delegations?.length) {
      return;
    }

    setSortedAccountsWithDelegation(
      sortedAccounts?.map((account, index) => {
        let delegation: Delegation | undefined;

        if (delegations && delegations[index]?.isDelegating) {
          const { balance: amount, conviction, target } = delegations[index].asDelegating;

          delegation = {
            accountDelegated: target.toString(),
            amount,
            conviction
          };
        }

        return ({
          ...account,
          delegation
        });
      })
    );
  }, [api, delegations, sortedAccounts]);

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

  const footer = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <td className='media--1400' />
      <td colSpan={2} />
      <td className='media--1500' />
      <td className='number'>
        {balanceTotal && <FormatBalance value={balanceTotal} />}
      </td>
      <td />
      <td className='media--1400' />
    </tr>
  ), [balanceTotal]);

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
      <Table
        empty={(!hasAccounts || (!isLoading && sortedAccountsWithDelegation)) && t<string>("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}
        filter={filter}
        footer={footer}
        header={headerRef.current}
      >
        {isLoading ? undefined : sortedAccountsWithDelegation?.map(({ account, delegation, isFavorite }, index): React.ReactNode => (
          <Account
            account={account}
            delegation={delegation}
            filter={filterOn}
            isFavorite={isFavorite}
            key={account.address}
            proxy={proxies?.[index]}
            setBalance={_setBalance}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
