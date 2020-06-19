// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { EraIndex, Nominations } from '@polkadot/types/interfaces';
import { Option } from '@polkadot/types';
import { StakerState } from '@polkadot/react-hooks/types';
import { SortedTargets } from '../../types';

import React from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressSmall, Button, Menu, Popup, StakingBonded, StakingEffected, StakingRedeemable, StakingUnbonding, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import ListNominees from './ListNominees';
import Nominate from './Nominate';
import CutGuarantee from './CutGuarantee';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionKey from './SetSessionKey';
import Unbond from './Unbond';
import Validate from './Validate';
import { RewardDestination } from '@polkadot/types/interfaces/staking';


interface Props {
  activeEra?: EraIndex;
  className?: string;
  isDisabled?: boolean;
  info: StakerState;
  next?: string[];
  stashId: string;
  targets: SortedTargets;
  validators?: string[];
}

function Account ({ className = '', info: { controllerId, destination, destinationId, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId }, isDisabled, next, targets, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [stashId]);
  // const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, [stashId]);
  const stakingAccount = useCall<DeriveStakingAccount>(api.query.staking.ledger, [controllerId]);
  const rewardDestination = useCall<RewardDestination>(api.query.staking.payee, [stashId]);
  destination = rewardDestination && rewardDestination.toString();
  const guarantors = useCall<Option<Nominations>>(api.query.staking.guarantors, [stashId]);
  const effected = stakingAccount && JSON.parse(JSON.stringify(stakingAccount)).valid != 0;
  const isValidator = validators && (validators?.indexOf(stashId) != -1);
  const isGuarantor = guarantors && JSON.parse(JSON.stringify(guarantors)) != null;
  const role = effected ? (isValidator ? 'Validator' : (isGuarantor ? 'Guarantor' : 'Bonded')) : 'Bonded';
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isCutGuaranteeOpen, toggleCutGuarantee] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={stashId} />
        {isBondExtraOpen && (
          <BondExtra
            onClose={toggleBondExtra}
            stashId={stashId}
          />
        )}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            next={next}
            nominating={nominating}
            onClose={toggleNominate}
            stashId={stashId}
            targets={targets}
            validators={validators}
          />
        )}
        {isCutGuaranteeOpen && controllerId && (
          <CutGuarantee
            controllerId={controllerId}
            next={next}
            nominating={nominating}
            onClose={toggleCutGuarantee}
            stashId={stashId}
            targets={targets}
            validators={validators}
          />
        )}
        {isSetControllerOpen && controllerId && (
          <SetControllerAccount
            defaultControllerId={controllerId}
            onClose={toggleSetController}
            stashId={stashId}
          />
        )}
        {isRewardDestinationOpen && controllerId && (
          <SetRewardDestination
            controllerId={controllerId}
            defaultDestination={destinationId}
            onClose={toggleRewardDestination}
            stashId={stashId}
          />
        )}
        {isSetSessionOpen && controllerId && (
          <SetSessionKey
            controllerId={controllerId}
            onClose={toggleSetSession}
            stashId={stashId}
          />
        )}
        {isUnbondOpen && (
          <Unbond
            controllerId={controllerId}
            onClose={toggleUnbond}
            stakingLedger={stakingLedger}
            stashId={stashId}
          />
        )}
        {isValidateOpen && controllerId && (
          <Validate
            controllerId={controllerId}
            onClose={toggleValidate}
            stashId={stashId}
          />
        )}
      </td>
      <td className='address'>
        <AddressMini value={controllerId} />
      </td>
      <td className='number ui--media-1200'>{destination}</td>
      <td className='number'>
        <StakingBonded stakingInfo={stakingAccount} />
        <StakingUnbonding stakingInfo={stakingAccount} />
        <StakingRedeemable stakingInfo={stakingAccount} />
      </td>
      <td className='number'>
        <StakingEffected stakingInfo={stakingAccount} />
      </td>
      <td className='number ui--media-1200'>{role}</td>
      {isStashValidating
        ? (
          <td className='all'>
            <AddressInfo
              address={stashId}
              withBalance={false}
              withHexSessionId={hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
              withValidatorPrefs
            />
          </td>
        )
        : (
          <td className='all'>
            {isStashNominating && (
              <ListNominees
                nominating={nominating}
                stashId={stashId}
              />
            )}
          </td>
        )
      }
      <td className='button'>
        {isLoading
          ? null
          : (
            <>
              {(isStashNominating || isStashValidating)
                ? (
                  <TxButton
                    accountId={controllerId}
                    icon='stop'
                    isDisabled={!isOwnController || isDisabled}
                    isPrimary={false}
                    key='stop'
                    label={t<string>('Stop')}
                    tx='staking.chill'
                  />
                )
                : (
                  <Button.Group>
                    {(sessionIds &&!sessionIds.length || hexSessionIdNext === '0x')
                      ? (
                        <Button
                          icon='sign-in'
                          isDisabled={!isOwnController || isDisabled}
                          key='set'
                          label={t<string>('Session Key')}
                          onClick={toggleSetSession}
                        />
                      )
                      : (
                        <Button
                          icon='check circle outline'
                          isDisabled={!isOwnController || isDisabled}
                          key='validate'
                          label={t<string>('Validate')}
                          onClick={toggleValidate}
                        />
                      )
                    }
                    <Button
                      icon='hand paper outline'
                      isDisabled={!isOwnController || isDisabled}
                      key='nominate'
                      label={t<string>('Nominate')}
                      onClick={toggleNominate}
                    />
                  </Button.Group>
                )
              }
              <Popup
                isOpen={isSettingsOpen}
                key='settings'
                onClose={toggleSettings}
                trigger={
                  <Button
                    icon='ellipsis vertical'
                    isDisabled={isDisabled}
                    onClick={toggleSettings}
                  />
                }
              >
                <Menu
                  onClick={toggleSettings}
                  text
                  vertical
                >
                  <Menu.Item
                    disabled={!isOwnStash && !balancesAll?.freeBalance.gtn(0)}
                    onClick={toggleBondExtra}
                  >
                    {t<string>('Bond more funds')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleUnbond}
                  >
                    {t<string>('Unbond funds')}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    disabled={!isOwnStash}
                    onClick={toggleSetController}
                  >
                    {t<string>('Change controller account')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleRewardDestination}
                  >
                    {t<string>('Change reward destination')}
                  </Menu.Item>
                  {isStashValidating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleValidate}
                    >
                      {t<string>('Change validator preferences')}
                    </Menu.Item>
                  }
                  <Menu.Divider />
                  {isStashNominating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleSetSession}
                    >
                      {t<string>('Change session keys')}
                    </Menu.Item>
                  }
                  {isStashNominating && validators && validators?.indexOf(stashId) == -1 &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleNominate}
                    >
                      {t<string>('Set guarantee')}
                    </Menu.Item>
                  }
                  {isStashNominating && validators && validators?.indexOf(stashId) == -1 &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleCutGuarantee}
                    >
                      {t<string>('Cut guarantee')}
                    </Menu.Item>
                  }
                  {!isStashNominating &&
                    <Menu.Item onClick={toggleInject}>
                      {t<string>('Inject session keys (advanced)')}
                    </Menu.Item>
                  }
                </Menu>
              </Popup>
            </>
          )
        }
      </td>
    </tr>
  );
}

export default React.memo(styled(Account)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
