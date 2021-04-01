// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { AccountId, ProxyDefinition, ProxyType, Voting } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Delegation, SortedAccount } from '@polkadot/app-accounts/types';
import { sortAccounts } from '@polkadot/app-accounts/util';
import { useTranslation } from '@polkadot/apps/translate';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import Register from '../modals/Register';
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

function Overview ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [{ sortedAccounts, sortedAddresses }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
  const [sortedAccountsWithDelegation, setSortedAccountsWithDelegation] = useState<SortedAccount[] | undefined>();
  const [ownMerchants, setOwnMerchants] = useState<SortedAccount[] | undefined>();
  const delegations = useCall<Voting[]>(api.query.democracy?.votingOf?.multi, [sortedAddresses]);
  const proxies = useCall<[ProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [sortedAddresses], {
    transform: (result: [([AccountId, ProxyType] | ProxyDefinition)[], BN][]): [ProxyDefinition[], BN][] =>
      api.tx.proxy.addProxy.meta.args.length === 3
        ? result as [ProxyDefinition[], BN][]
        : (result as [[AccountId, ProxyType][], BN][]).map(([arr, bn]): [ProxyDefinition[], BN] =>
          [arr.map(([delegate, proxyType]): ProxyDefinition => api.createType('ProxyDefinition', { delegate, proxyType })), bn]
        )
  });
  const [isRegisterOpen, toggleRegister] = useToggle();
  const [allMerchants, setAllMerchants] = useState<string[]>([]);

  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('accounts'), 'start', 3],
    [t('reward')],
    [t('maximum receivable income')],
    [t('collateral')],
    // [t('balances'), 'expand'],
    []
  ]);

  const getAllMerchants = () => {
    let unsub: (() => void) | undefined;
    const fns: any[] = [
      [api.query.market.merchantLedgers.entries]
    ];
    const allMerchants:string[] = [];

    api.combineLatest<any[]>(fns, ([ledgers]): void => {
      if (Array.isArray(ledgers)) {
        ledgers.forEach(([{ args: [accountId] }]) => {
          allMerchants.push(accountId.toString());
        });
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
    getAllMerchants();
  }, []);

  useEffect(() => {
    const tmp: SortedAccount[] = [];

    if (sortedAccountsWithDelegation && allMerchants) {
      for (const myAccount of sortedAccountsWithDelegation) {
        if (allMerchants.includes(myAccount.account.address.toString())) {
          tmp.push(myAccount);
        }
      }

      setOwnMerchants(tmp);
    }
  }, [sortedAccountsWithDelegation, allMerchants]);

  useEffect((): void => {
    const sortedAccounts = sortAccounts(allAccounts, favorites);
    const sortedAddresses = sortedAccounts.map((a) => a.account.address);

    setSorted({ sortedAccounts, sortedAddresses });
  }, [allAccounts, favorites]);

  useEffect(() => {
    // TODO: to confirm
    if ( !delegations?.length) {
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
      {isRegisterOpen && (
        <Register
          key='modal-transfer'
          onClose={toggleRegister}
          onSuccess={getAllMerchants}
        />
      )}
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Register')}
          onClick={toggleRegister}
        />
      </Button.Group>
      <Table
        empty={(!hasAccounts || (!isLoading && sortedAccountsWithDelegation)) && t<string>("You don't have merchant accounts. Some features are currently hidden and will only become available once you have merchant accounts.")}
        filter={filter}
        header={headerRef.current}
      >
        {!isLoading && ownMerchants?.map(({ account, delegation, isFavorite }, index): React.ReactNode => (
          <Merchant
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
