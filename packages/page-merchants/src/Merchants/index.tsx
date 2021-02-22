// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { AccountId, ProxyDefinition, ProxyType, Voting } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Input, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import { Delegation, SortedAccount } from '@polkadot/app-accounts/types';
import { useTranslation } from '@polkadot/apps/translate';
import { sortAccounts } from '@polkadot/app-accounts/util';
import Merchant from './Merchant';
import Register from '../modals/Register';

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

  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('accounts'), 'start', 3],
    [t('reward'), 'start'],
    [t('collateral'), 'start'],
    [t('balances'), 'expand'],
    [undefined, 'media--1400']
  ]);

  useEffect(() => {
      let unsub: (() => void) | undefined;
      if (sortedAccountsWithDelegation) {
        const query: string[] = [];
        for (const v of sortedAccountsWithDelegation) {
            query.push(v.account.address.toString());
        }
        const fns: any[] = [
            [api.query.market.merchantLedgers.multi as any, query]
        ];
        api.combineLatest<any[]>(fns, ([ledgers]): void => {
            const tmp: SortedAccount[] = [];
            if (Array.isArray(ledgers) && ledgers.length && ledgers.length === query.length) {
                for (const key in ledgers) {
                    const ledger = JSON.parse(JSON.stringify(ledgers[key]));
                    if (ledger?.collateral == 0) {
                        tmp.push(sortedAccountsWithDelegation[key]);
                    } 
                }
                setOwnMerchants(tmp);
            }
        }).then((_unsub): void => {
            unsub = _unsub;
        }).catch(console.error);
      }

      return (): void => {
        unsub && unsub();
      };
  }, [api, sortedAccountsWithDelegation])

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
