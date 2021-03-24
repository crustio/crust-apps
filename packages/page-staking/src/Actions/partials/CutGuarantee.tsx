// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import { NominateInfo } from './types';
import { SortedTargets } from '../../types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputAddress, InputAddressMulti, Modal, InputBalance, Toggle } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS, MAX_PAYOUTS, STORE_FAVS_BASE } from '../../constants';
import { useTranslation } from '../../translate';
import BN from 'bn.js';
import MaxCutGuarantee from './MaxCutGuarantee';

interface Props {
  className?: string;
  controllerId: string;
  next?: string[];
  nominating?: any[];
  onChange: (info: NominateInfo) => void;
  stashId: string;
  targets: SortedTargets;
  validators: string[];
  withSenders?: boolean;
}

function autoPick (targets: SortedTargets): string[] {
  return (targets.validators || []).reduce((result: string[], { key, numNominators }): string[] => {
    if (result.length < MAX_NOMINATIONS) {
      if (numNominators && (numNominators < MAX_PAYOUTS)) {
        result.push(key);
      }
    }

    return result;
  }, []);
}

function unique (arr: any[]) {
  return Array.from(new Set(arr))
}

function CutGuarantee ({ className = '', controllerId, next, nominating, onChange, stashId, targets, validators, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [selected, setSelected] = useState<string[]>([]);
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [available] = useState<string[]>((): string[] => {
    const shortlist = [
      // ensure that the favorite is included in the list of stashes
      ...favorites.filter((acc) => (validators || []).includes(acc) || (next || []).includes(acc)),
      // make sure the nominee is not in our favorites already
      ...(nominating || []).map(e => e.who).filter((acc) => !favorites.includes(acc))
    ];

    return unique(shortlist
      .concat(...(validators || []).filter((acc) => !shortlist.includes(acc)))
      .concat(...(next || []).filter((acc) => !shortlist.includes(acc))));
  });
  const [, setAutoSelected] = useState<string[]>([]);

  const [maxBalance, setMaxBalance] = useState<BN>(new BN(0));

  const cutGuaranteeable = <span className='label'>{t<string>('cutGuaranteeable')}</span>;
  const [withMax, setWithMax] = useState(false);
  const MAX_CUT = new BN(20_000_000).mul(new BN(1_000_000_000_000));

  useEffect(() => {
    if (selected.length) {
      api.query.staking
      .guarantors<any>(stashId)
      .then((guarantee): void => {
        const guaranteeInfo = JSON.parse(JSON.stringify(guarantee));

        if (guaranteeInfo) {
          for (const validate of guaranteeInfo.targets) {
            if (selected[0] == validate.who.toString()) {
              setMaxBalance(validate.value)
            }
          }
        }
      })
      .catch(console.error);
    }
  }, [api, selected, stashId])

  useEffect((): void => {
    setAutoSelected(
      targets.validators?.length
        ? autoPick(targets)
        : []
    );
  }, [targets]);

  useEffect((): void => {
    onChange({
      nominateTx: (selected && selected.length && amount) || withMax
        ? (withMax ? api.tx.staking.cutGuarantee([selected[0], MAX_CUT]) : api.tx.staking.cutGuarantee([selected[0], amount])) 
        : null
    });
  }, [api, onChange, selected, amount, withMax]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns>
          <Modal.Column>
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
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The stash that is to be affected. The transaction will be sent from the associated controller account.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      <Modal.Columns>
        <Modal.Column>
          <InputAddressMulti
              available={available}
              availableLabel={t<string>('candidate accounts')}
              help={t<string>('Filter available candidates based on name, address or short account index.')}
              maxCount={1}
              onChange={setSelected}
              valueLabel={t<string>('guaranteed accounts')}
            />
        </Modal.Column>

        <Modal.Column>
          <p>{t<string>('Guarantors can be selected automatically based on the current on-chain conditions or supplied manually as selected from the list of all currently available validators. In both cases, your favorites appear for the selection.')}</p>
          <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the guarantee will show as inactive.')}</p>
        </Modal.Column>
      </Modal.Columns>
      <Modal.Column>
        <InputBalance
          autoFocus
          help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
          isZeroable
          label={t<string>('amount')}
          withMax
          onChange={setAmount}
          isDisabled={withMax}
          labelExtra={
            selected[0] &&
            <MaxCutGuarantee
              label={cutGuaranteeable}
              params={maxBalance}
            />
          }
        >
          <Toggle
            isOverlay
            label={t<string>('all cut')}
            onChange={setWithMax}
            value={withMax}
          />
        </InputBalance>
      </Modal.Column>
    </div>
  );
}

export default React.memo(styled(CutGuarantee)`
  article.warning {
    margin-top: 0;
  }

  .auto--toggle {
    margin: 0.5rem 0 0;
    text-align: right;
    width: 100%;
  }

  .ui--Static .ui--AddressMini.padded {
    padding-top: 0.5rem;
  }

  .shortlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .candidate {
      border: 1px solid #eee;
      border-radius: 0.25rem;
      margin: 0.25rem;
      padding-bottom: 0.25rem;
      padding-right: 0.5rem;
      position: relative;

      &::after {
        content: '';
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
