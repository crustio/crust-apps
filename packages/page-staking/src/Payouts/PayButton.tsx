// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AddressMini, Button, InputAddress, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { EraIndex } from '@polkadot/types/interfaces';

import { useTranslation } from '../translate';
import { PayoutValidator } from './types';

// const DEFAULT_BATCH = 40;
const DEFAULT_PAYOUTS = 64;

interface Props {
  className?: string;
  isAll?: boolean;
  isDisabled?: boolean;
  payout?: PayoutValidator | PayoutValidator[];
}

interface SinglePayout {
  era: EraIndex;
  validatorId: string;
}

function createExtrinsic (api: ApiPromise, payout: PayoutValidator | PayoutValidator[], maxPayouts: number): SubmittableExtrinsic<'promise'> | null {
  // const batchSize = DEFAULT_BATCH * (DEFAULT_PAYOUTS / maxPayouts);

  if (Array.isArray(payout)) {
    if (payout.length === 1) {
      return createExtrinsic(api, payout[0], maxPayouts);
    }

    return api.tx.utility.batch(
      payout
        .reduce((payouts: SinglePayout[], { eras, validatorId }): SinglePayout[] => {
          eras.forEach(({ era }): void => {
            payouts.push({ era, validatorId });
          });

          return payouts;
        }, [])
        .sort((a, b) => a.era.cmp(b.era))
        // .filter((_, index) => index < batchSize)
        .map(({ era, validatorId }) => api.tx.staking.rewardStakers(validatorId, era))
    );
  }

  const { eras, validatorId } = payout;

  return eras.length === 1
    ? api.tx.staking.rewardStakers(validatorId, eras[0].era)
    : api.tx.utility.batch(
      eras
        .sort((a, b) => a.era.cmp(b.era))
        // .filter((_, index) => index < batchSize)
        .map(({ era }) => api.tx.staking.rewardStakers(validatorId, era))
    );
}

function PayButton ({ className, isAll, isDisabled, payout }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [isVisible, togglePayout] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  useEffect((): void => {
    api.tx.utility && payout && setExtrinsic(
      () => createExtrinsic(api, payout, DEFAULT_PAYOUTS)
    );
  }, [api, isDisabled, payout]);

  const isPayoutEmpty = !payout || (Array.isArray(payout) && payout.length === 0);

  return (
    <>
      {payout && isVisible && (
        <Modal
          className={className}
          header={t<string>('Payout all stakers')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  label={t<string>('request payout from')}
                  onChange={setAccount}
                  type='account'
                  value={accountId}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Any account can request payout for stakers, this is not limited to accounts that will be rewarded.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                {Array.isArray(payout)
                  ? (
                    <Static
                      label={t<string>('payout stakers for (multiple)')}
                      value={
                        payout.map(({ validatorId }) => (
                          <AddressMini
                            className='addressStatic'
                            key={validatorId}
                            value={validatorId}
                          />
                        ))
                      }
                    />
                  )
                  : (
                    <InputAddress
                      defaultValue={payout.validatorId}
                      isDisabled
                      label={t<string>('payout stakers for (single)')}
                    />
                  )
                }
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('All the listed validators and all their guarantors will receive their rewards.')}</p>
                <p>{t<string>('The UI puts a limit of 40 payouts at a time, where each payout is a single validator for a single era.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={togglePayout}>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsic}
              icon='credit-card'
              isDisabled={!extrinsic || !accountId}
              label={t<string>('Payout')}
              onStart={togglePayout}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='credit-card'
        isDisabled={isDisabled || isPayoutEmpty}
        label={
          (isAll || Array.isArray(payout))
            ? t<string>('Payout all')
            : t<string>('Payout')
        }
        onClick={togglePayout}
      />
    </>
  );
}

export default React.memo(styled(PayButton)`
  .ui--AddressMini.padded.addressStatic {
    padding-top: 0.5rem;

    .ui--AddressMini-info {
      min-width: 10rem;
      max-width: 10rem;
    }
  }
`);
