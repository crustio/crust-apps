// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { SlashingSpans, UnappliedSlash, IndividualExposure, Balance, EraIndex } from '@polkadot/types/interfaces';
import { StakerState } from '@polkadot/react-hooks/types';
import { SortedTargets } from '../../types';
import { Slash } from '../types';

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { AddressMini, AddressSmall, Button, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, StatusContext, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { Compact } from '@polkadot/types/codec';

import { useTranslation } from '../../translate';
import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionKey from './SetSessionKey';
import Unbond from './Unbond';
import Validate from './Validate';
import EffectiveStake from './EffectiveStake';
import EffectiveGuaranteed from './EffectiveGuaranteed';
import { BN_ZERO } from '@polkadot/util';
import CutGuarantee from './CutGuarantee';

interface Props {
  allSlashes?: [BN, UnappliedSlash[]][];
  className?: string;
  isDisabled?: boolean;
  info: StakerState;
  next?: string[];
  stashId: string;
  targets: SortedTargets;
  validators?: string[];
}

export interface Guarantee extends Codec {
  targets: IndividualExposure[];
  total: Compact<Balance>;
  submitted_in: number;
  suppressed: boolean;
}

function extractSlashes (stashId: string, allSlashes: [BN, UnappliedSlash[]][] = []): Slash[] {
  return allSlashes
    .map(([era, all]) => ({
      era,
      slashes: all.filter(({ others, validator }) =>
        validator.eq(stashId) || others.some(([nominatorId]) => nominatorId.eq(stashId))
      )
    }))
    .filter(({ slashes }) => slashes.length);
}

const transformSpan = {
  transform: (optSpans: Option<SlashingSpans>): number =>
    optSpans.isNone
      ? 0
      : optSpans.unwrap().prior.length + 1
};

function useStashCalls (api: ApiPromise, stashId: string) {
  const params = useMemo(() => [stashId], [stashId]);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, params);
  const spanCount = useCall<number>(api.query.staking.slashingSpans, params, transformSpan);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, params);

  return { balancesAll, spanCount, stakingAccount };
}

function Account ({ allSlashes, className = '', info: { controllerId, destination, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId }, isDisabled, targets, validators, next }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();
  const { balancesAll, spanCount, stakingAccount } = useStashCalls(api, stashId);
  const guarantors = useCall<Guarantee>(api.query.staking.guarantors, [stashId]);
  const isValidator = targets && (targets.validatorIds?.indexOf(stashId) != -1);
  const isGuarantor = guarantors && JSON.parse(JSON.stringify(guarantors)) != null;
  const isCandidate = next && (next?.indexOf(stashId) != -1);
  const [role, setRole ] = useState<string>('Bonded');
  const currentEra = useCall<EraIndex>(api.query.staking.currentEra);
  let guaranteeTargets: IndividualExposure[] = [];
  let stakeValue = new BN(0);
  if (guarantors && JSON.parse(JSON.stringify(guarantors)) != null) {
    guaranteeTargets = JSON.parse(JSON.stringify(guarantors)).targets;
    stakeValue = guaranteeTargets.reduce((total: BN, { value }) => { return total.add(new BN(Number(value).toString()))}, BN_ZERO)
  }
  const [isCutGuaranteeOpen, toggleCutGuarantee] = useToggle();

  const slashes = useMemo(
    () => extractSlashes(stashId, allSlashes),
    [allSlashes, stashId]
  );

  useEffect(() => {
    console.log('Guarantor, Validator, Candidate', isGuarantor, isValidator, isCandidate)
    if (isGuarantor) {
      setRole('Guarantor');
    } else if (isCandidate) {
      setRole('Candidate');
    } else if (isValidator) {
      setRole('Validator')
    }
  }, [isValidator, isGuarantor, isCandidate])

  const withdrawFunds = useCallback(
    () => {
      queueExtrinsic({
        accountId: controllerId,
        extrinsic: api.tx.staking.withdrawUnbonded.meta.args.length === 1
          ? api.tx.staking.withdrawUnbonded(spanCount || 0)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore (We are doing toHex here since we have a Vec<u8> input)
          : api.tx.staking.withdrawUnbonded()
      });
    },
    [api, controllerId, queueExtrinsic, spanCount]
  );

  const hasBonded = !!stakingAccount?.stakingLedger && !stakingAccount.stakingLedger.active.isEmpty;

  return (
    <tr className={className}>
      {/* <td className='badge together'>
        {slashes.length !== 0 && (
          <Badge
            color='red'
            hover={t<string>('Slashed in era {{eras}}', {
              replace: {
                eras: slashes.map(({ era }) => formatNumber(era)).join(', ')
              }
            })}
            icon='skull-crossbones'
          />
        )}
      </td> */}
      <td className='address'>
        <AddressSmall value={stashId} />
        {isBondExtraOpen && (
          <BondExtra
            controllerId={controllerId}
            onClose={toggleBondExtra}
            stakingInfo={stakingAccount}
            stashId={stashId}
          />
        )}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            nominating={nominating}
            onClose={toggleNominate}
            stashId={stashId}
            targets={targets}
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
            defaultDestination={destination}
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
        {isCutGuaranteeOpen && controllerId && (
          <CutGuarantee
            controllerId={controllerId}
            nominating={nominating}
            onClose={toggleCutGuarantee}
            stashId={stashId}
            targets={targets}
            validators={targets.validatorIds}
          />
        )}
      </td>
      <td className='address'>
        <AddressMini value={controllerId} />
      </td>
      <td className='start media--1200'>
        {destination?.isAccount
          ? <AddressMini value={destination.asAccount} />
          : destination?.toString()
        }
      </td>
      <td className='number'>
        <StakingBonded stakingInfo={stakingAccount} />
        <StakingUnbonding stakingInfo={stakingAccount} />
        <StakingRedeemable stakingInfo={stakingAccount} />
      </td>
      {currentEra && (role !== `Validator` && role !== `Candidate`) ? <EffectiveStake
        validators = {guaranteeTargets}
        stakeValue = {stakeValue}
        stashId= {stashId}
        currentEra = {currentEra}
        // stakeValue = { guaranteeTargets.length > 0 ? guaranteeTargets.reduce((total: BN, { value }) => { return JSON.parse(JSON.stringify(value)) ? total.add(value?.unwrap()) : total}, BN_ZERO) : BN_ZERO }
      /> : currentEra && (
          <EffectiveGuaranteed currentEra={currentEra}
            stashId={stashId}
          />
        )
      }
      <td className='number ui--media-1200'>{role}</td>

      {/* {isStashValidating
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
      } */}
      <td className='button'>
        {!isLoading && (
          <>
            {(isStashNominating || isStashValidating)
              ? (
                <TxButton
                  accountId={controllerId}
                  icon='stop'
                  isDisabled={!isOwnController || isDisabled}
                  key='stop'
                  label={t<string>('Stop')}
                  tx='staking.chill'
                />
              )
              : (
                <Button.Group>
                  {(!sessionIds.length || hexSessionIdNext === '0x')
                    ? (
                      <Button
                        icon='sign-in-alt'
                        isDisabled={!isOwnController || isDisabled}
                        key='set'
                        label={t<string>('Session Key')}
                        onClick={toggleSetSession}
                      />
                    )
                    : (
                      <Button
                        icon='certificate'
                        isDisabled={!isOwnController || isDisabled || !hasBonded}
                        key='validate'
                        label={t<string>('Validate')}
                        onClick={toggleValidate}
                      />
                    )
                  }
                  <Button
                    icon='hand-paper'
                    isDisabled={!isOwnController || isDisabled || !hasBonded}
                    key='nominate'
                    label={t<string>('Guarantee')}
                    onClick={toggleNominate}
                  />
                  <TxButton
                    accountId={controllerId}
                    icon='stop'
                    isDisabled={!isOwnController || isDisabled}
                    key='stop'
                    label={t<string>('Stop')}
                    tx='staking.chill'
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
                  icon='ellipsis-v'
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
                Bond
                <Menu.Item
                  disabled={!isOwnStash && !balancesAll?.freeBalance.gtn(0)}
                  onClick={toggleBondExtra}
                >
                  {t<string>('Bond more funds')}
                </Menu.Item>
                <Menu.Item
                  disabled={!isOwnController || !stakingAccount || !stakingAccount.stakingLedger || stakingAccount.stakingLedger.active.isEmpty}
                  onClick={toggleUnbond}
                >
                  {t<string>('Unbond funds')}
                </Menu.Item>
                <Menu.Item
                  disabled={!isOwnController || !stakingAccount || !stakingAccount.redeemable || !stakingAccount.redeemable.gtn(0)}
                  onClick={withdrawFunds}
                >
                  {t<string>('Withdraw unbonded funds')}
                </Menu.Item>
                <Menu.Divider />
                Validate
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
                {!isStashNominating &&
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleSetSession}
                  >
                    {t<string>('Change session keys')}
                  </Menu.Item>
                }
                {!isStashNominating &&
                  <Menu.Item onClick={toggleInject}>
                    {t<string>('Inject session keys (advanced)')}
                  </Menu.Item>
                }
                <Menu.Divider />
                
               
                { role !== 'Validator' && 'Guarantee' }
                { role !== 'Validator' &&
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleNominate}
                  >
                    {t<string>('Guarantee')}
                  </Menu.Item>
                }
                { role !== 'Validator' &&
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleCutGuarantee}
                  >
                    {t<string>('Cut guarantee')}
                  </Menu.Item>
                }
              </Menu>
            </Popup>
          </>
        )}
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

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: darkred;
    }
  }
`);
