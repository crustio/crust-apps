// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { SortedTargets } from '../../types';
import type { NominateInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputAddressMulti, InputBalance, Modal, Toggle } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import MaxCutGuarantee from './MaxCutGuarantee';
import { Guarantee } from '@polkadot/app-staking/Overview/Address';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onChange: (info: NominateInfo) => void;
  stashId: string;
  targets: SortedTargets;
  withSenders?: boolean;
}

function CutGuarantee ({ className = '', controllerId, onChange, stashId, targets, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const cutGuaranteeable = <span className='label'>{t<string>('cutGuaranteeable')}</span>;
  const guarantors = useCall<Guarantee>(api.query.staking.guarantors, [stashId]);
  const guarantorInfo = guarantors && JSON.parse(JSON.stringify(guarantors));
  const [selected, setSelected] = useState<string[]>([]);
  const available = guarantorInfo ? guarantorInfo.targets.map((e: { who: { toString: () => any; }; }) => e.who.toString()) : []

  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [maxBalance, setMaxBalance] = useState<BN>(new BN(0));
  const [withMax, setWithMax] = useState(false);
  const MAX_CUT = new BN(20_000_000).mul(new BN(1_000_000_000_000));

  useEffect((): void => {
    onChange({
      nominateTx: (selected && selected.length && amount) || withMax
        ? (withMax ? api.tx.staking.cutGuarantee([selected[0], MAX_CUT]) : api.tx.staking.cutGuarantee([selected[0], amount]))
        : null
    });
  }, [api, onChange, selected, amount, withMax]);

  useEffect(() => {
    if (selected.length) {
      api.query.staking
        .guarantors<any>(stashId)
        .then((guarantee): void => {
          const guaranteeInfo = JSON.parse(JSON.stringify(guarantee));

          if (guaranteeInfo) {
            for (const validate of guaranteeInfo.targets) {
              if (selected[0] == validate.who.toString()) {
                setMaxBalance(validate.value);
              }
            }
          }
        })
        .catch(console.error);
    }
  }, [api, selected, stashId]);

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
            availableLabel={t<string>('guaranteed accounts')}
            // defaultValue={nominating}
            help={t<string>('Filter available candidates based on name, address or short account index.')}
            maxCount={1}
            targets={targets}
            onChange={setSelected}
            valueLabel={t<string>('selected account')}
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
            <MaxCutGuarantee
              label={cutGuaranteeable}
              params={maxBalance}
            />
          }
          onChange={setAmount}
          withMax
        >
          <Toggle
            isOverlay
            label={t<string>('all cut')}
            onChange={setWithMax}
            value={withMax}
          />
        </InputBalance>
      </Modal.Columns>
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
