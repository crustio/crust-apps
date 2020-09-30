// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveBalancesAll, DeriveDemocracyLock } from '@polkadot/api-derive/types';
import { ProxyDefinition, RecoveryConfig } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { AddressInfo, AddressMini, AddressSmall, Badge, Button, CryptoType, Icon, IdentityIcon, LinkExternal, Tags } from '@polkadot/react-components';
import { useAccountInfo, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';
import { Delegation } from '@polkadot/app-accounts/types';
import { useTranslation } from '@polkadot/app-accounts/translate';
import Pledge from './Pledge';
import PledgeExtra from './PledgeExtra';
import CutPledge from './CutPledge';
import Register from './Register';

interface Props {
  account: KeyringAddress;
  className?: string;
  delegation?: Delegation;
  filter: string;
  isFavorite: boolean;
  proxy?: [ProxyDefinition[], BN];
  setBalance: (address: string, value: BN) => void;
  toggleFavorite: (address: string) => void;
}

interface DemocracyUnlockable {
  democracyUnlockTx: SubmittableExtrinsic<'promise'> | null;
  ids: BN[];
}

function calcVisible (filter: string, name: string, tags: string[]): boolean {
  if (filter.length === 0) {
    return true;
  }

  const _filter = filter.toLowerCase();

  return tags.reduce((result: boolean, tag: string): boolean => {
    return result || tag.toLowerCase().includes(_filter);
  }, name.toLowerCase().includes(_filter));
}

function createClearDemocracyTx (api: ApiPromise, address: string, unlockableIds: BN[]): SubmittableExtrinsic<'promise'> {
  return api.tx.utility.batch(
    unlockableIds
      .map((id) => api.tx.democracy.removeVote(id))
      .concat(api.tx.democracy.unlock(address))
  );
}

const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function Account ({ account: { address, meta }, className = '', filter, isFavorite, setBalance, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();
  const bestNumber = useCall<BN>(api.api.derive.chain.bestNumber);
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all, [address]);
  const democracyLocks = useCall<DeriveDemocracyLock[]>(api.api.derive.democracy?.locks, [address]);
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], transformRecovery);
  const { name: accName, tags } = useAccountInfo(address);
  const [, setUnlockableIds] = useState<DemocracyUnlockable>({ democracyUnlockTx: null, ids: [] });
  const [, setVestingTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [isPledgeOpen, togglePledge] = useToggle();
  const [isPledgeExtraOpen, togglePledgeExtra] = useToggle();
  const [isCutPledgeOpen, toggleCutPledge] = useToggle();
  const [isRegisterOpen, toggleRegister] = useToggle();

  useEffect((): void => {
    if (balancesAll) {
      setBalance(address, balancesAll.freeBalance.add(balancesAll.reservedBalance));

      api.api.tx.vesting?.vest && setVestingTx(() =>
        balancesAll.vestingLocked.isZero()
          ? null
          : api.api.tx.vesting.vest()
      );
    }
  }, [address, api, balancesAll, setBalance]);

  useEffect((): void => {
    bestNumber && democracyLocks && setUnlockableIds(
      (prev): DemocracyUnlockable => {
        const ids = democracyLocks
          .filter(({ isFinished, unlockAt }) => isFinished && bestNumber.gt(unlockAt))
          .map(({ referendumId }) => referendumId);

        if (JSON.stringify(prev.ids) === JSON.stringify(ids)) {
          return prev;
        }

        return {
          democracyUnlockTx: createClearDemocracyTx(api.api, address, ids),
          ids
        };
      }
    );
  }, [address, api, bestNumber, democracyLocks]);

  const isVisible = useMemo(
    () => calcVisible(filter, accName, tags),
    [accName, filter, tags]
  );

  const _onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
  );





  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='favorite'>
        <Icon
          color={isFavorite ? 'orange' : 'gray'}
          icon='star'
          onClick={_onFavorite}
        />
      </td>
      <td className='together'>
        {recoveryInfo && (
          <Badge
            color='green'
            hover={
              <div>
                <p>{t<string>('This account is recoverable, with the following friends:')}</p>
                <div>
                  {recoveryInfo.friends.map((friend, index): React.ReactNode => (
                    <IdentityIcon
                      key={index}
                      value={friend}
                    />
                  ))}
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>{t<string>('threshold')}</td>
                      <td>{formatNumber(recoveryInfo.threshold)}</td>
                    </tr>
                    <tr>
                      <td>{t<string>('delay')}</td>
                      <td>{formatNumber(recoveryInfo.delayPeriod)}</td>
                    </tr>
                    <tr>
                      <td>{t<string>('deposit')}</td>
                      <td>{formatBalance(recoveryInfo.deposit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            icon='shield'
          />
        )}

      </td>
      <td className='address'>
        <AddressSmall value={address} />
        {isPledgeOpen && (
          <Pledge
            onClose={togglePledge}
            stashId={address}
          />
        )}
        {isPledgeExtraOpen && (
          <PledgeExtra
            onClose={togglePledgeExtra}
            stashId={address}
          />
        )}
        {isCutPledgeOpen && (
          <CutPledge
            onClose={toggleCutPledge}
            stashId={address}
          />
        )}
        {isRegisterOpen && (
          <Register
            onClose={toggleRegister}
            stashId={address}
          />
        )}
      </td>
      <td className='address media--1400'>
        {meta.parentAddress && (
          <AddressMini value={meta.parentAddress} />
        )}
      </td>
      <td className='number'>
        <CryptoType accountId={address} />
      </td>
      <td className='all'>
        <div className='tags'>
          <Tags value={tags} />
        </div>
      </td>
      <td className='number media--1500'>
        {balancesAll?.accountNonce.gt(BN_ZERO) && formatNumber(balancesAll.accountNonce)}
      </td>
      <td className='number'>
        <AddressInfo
          address={address}
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='button'>
        {api.api.tx.market?.pledge && (
          <Button
            icon='hand-paper'
            label={t<string>('Pledge')}
            onClick={togglePledge}
          />
        )}
        {api.api.tx.market?.pledgeExtra && (
          <Button
            icon='battery-three-quarters'
            label={t<string>('pledge extra')}
            onClick={togglePledgeExtra}
          />
        )}
        {api.api.tx.market?.cutPledge && (
          <Button
            icon='cut'
            label={t<string>('cut pledge')}
            onClick={toggleCutPledge}
          />
        )}
        {api.api.tx.market?.register && (
          <Button
            icon='sign-in-alt'
            label={t<string>('register')}
            onClick={toggleRegister}
          />
        )}
        {/* <Popup
          className='theme--default'
          isOpen={isSettingsOpen}
          onClose={toggleSettings}
          trigger={
            <Button
              icon='ellipsis-v'
              onClick={toggleSettings}
            />
          }
        >
          <Menu
            onClick={toggleSettings}
            text
            vertical
          >
            <ChainLock
              className='accounts--network-toggle'
              genesisHash={genesisHash}
              isDisabled={api.isDevelopment}
              onChange={onSetGenesisHash}
            />
          </Menu>
        </Popup> */}
      </td>
      <td className='links media--1400'>
        <LinkExternal
          className='ui--AddressCard-exporer-link'
          data={address}
          isLogo
          type='address'
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
