// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../../types';
import type { NominateInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { validatorApy } from '@polkadot/app-staking';
import { InputAddress, InputAddressMulti, InputBalance, Modal } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../../constants';
import { useTranslation } from '../../translate';
import Guaranteeable from './Guaranteeable';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onChange: (info: NominateInfo) => void;
  stashId: string;
  targets: SortedTargets;
  withSenders?: boolean;
}

function Nominate ({ className = '', controllerId, onChange, stashId, targets: { nominateIds = [] }, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [selected, setSelected] = useState<string[]>([]);
  const guaranteeable = <span className='label'>{t<string>('guaranteeable')}</span>;
  const [available] = useState<string[]>((): string[] => {
    const shortlist = [
      // ensure that the favorite is included in the list of stashes
      ...favorites.filter((acc) => nominateIds.includes(acc))
    ];

    return shortlist
      .concat(...(nominateIds.filter((acc) => !shortlist.includes(acc))));
  });

  const [amount, setAmount] = useState<BN | undefined>(new BN(0));

  const [reward, setReward] = useState<number>(0);

  const [showReward, setShowReward] = useState<boolean>(false);

  useEffect(() => {
    if (selected && selected.length) {
      setShowReward(true);

      if (amount) {
        const amountNumber = Number(amount.toString()) / 1000000000000.0;

        setReward((validatorApy[selected[0]] + 1) * amountNumber - amountNumber);
      }
    } else {
      setShowReward(false);
    }
  }, [amount, selected]);

  useEffect((): void => {
    onChange({
      nominateTx: selected && selected.length && amount && selected[0]
        ? api.tx.staking.guarantee([selected[0], amount])
        : null
    });
  }, [api, onChange, selected, amount]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Content>
          <Modal.Columns hint={t<string>('The stash that is to be affected. The transaction will be sent from the associated controller account.')}>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('stash account')}
            />
            <InputAddress
              defaultValue={controllerId}
              isDisabled
              label={t<string>('controller account')}
            />
          </Modal.Columns>
        </Modal.Content>
      )}
      <Modal.Content>
        <Modal.Columns hint={[t<string>('Guarantors can be selected manually from the list of all currently available validators.'), t<string>('Once transmitted the new selection will only take effect in 2 eras taking the new validator election cycle into account. Until then, the nominations will show as inactive.')]}>
          <InputAddressMulti
            available={available}
            availableLabel={t<string>('candidate accounts')}
            // defaultValue={nominating}
            help={t<string>('Filter available candidates based on name, address or short account index.')}
            maxCount={1}
            onChange={setSelected}
            valueLabel={t<string>('selected accounts')}
            withApy={true}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Columns>
        <InputBalance
          autoFocus
          help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
          isZeroable
          label={t<string>('amount')}
          labelExtra={
            selected[0] &&
            <Guaranteeable
              label={guaranteeable}
              params={selected[0]}
            />
          }
          onChange={setAmount}
          withMax
        />
      </Modal.Columns>
      <Modal.Content>
        <Modal.Columns>
          {showReward && (validatorApy[selected[0]] !== undefined
            ? <Banner type='warning'>
              <p>{t<string>('Estimated return (1day): {{ reward }} CRU', {
                replace: {
                  reward: reward
                }
              })}</p>
            </Banner>
            : <Banner type='error'>
              <p>{t<string>('Browse the Overview and Waiting pages, you can get the validator(candidate)\'s APY')}</p>
            </Banner>)}
        </Modal.Columns>
      </Modal.Content>
    </div>
  );
}

export default React.memo(styled(Nominate)`
  article.warning {
    margin-top: 0;
  }

  .auto--toggle {
    margin: 0.5rem 0 0;
    text-align: right;
    width: 100%;
  }

  .ui--Static .ui--AddressMini.padded.addressStatic {
    padding-top: 0.5rem;

    .ui--AddressMini-info {
      min-width: 10rem;
      max-width: 10rem;
    }
  }

  .shortlist {
    display: flex;
    flex-wrap: wrap;
    justify-Columns: center;

    .candidate {
      border: 1px solid #eee;
      border-radius: 0.25rem;
      margin: 0.25rem;
      padding-bottom: 0.25rem;
      padding-right: 0.5rem;
      position: relative;

      &::after {
        Columns: '';
        position: absolute;
        top: 0;
        right: 0;
        border-color: transparent;
        border-style: solid;
        border-radius: 0.25em;
        border-width: 0.25em;
      }

      &.isAye {
        background: #fff;
        border-color: #ccc;
      }

      &.member::after {
        border-color: green;
      }

      &.runnerup::after {
        border-color: steelblue;
      }

      .ui--AddressMini-icon {
        z-index: 1;
      }

      .candidate-right {
        text-align: right;
      }
    }
  }
`);
