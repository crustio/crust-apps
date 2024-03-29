// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isFunction } from '@polkadot/util';

import { FoundsType } from './types';

interface Props {
  className?: string;
  onClose: () => void;
  accountId?: string;
  onSuccess: () => void;
  foundsType: FoundsType;
}

function Bond ({ className = '', foundsType, onClose, onSuccess, accountId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setMaxTransfer] = useState<BN | null>(null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [senderId]);

  useEffect((): void => {
    if (balances && balances.accountId.eq(senderId) && senderId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.benefits
            .addBenefitFunds(balances.availableBalance, foundsType)
            .paymentInfo(senderId)
            .then(({ partialFee }): void => {
              const maxTransfer = balances.availableBalance.sub(partialFee);

              setMaxTransfer(
                maxTransfer.gt(api.consts.balances.existentialDeposit)
                  ? maxTransfer
                  : null
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer(null);
    }
  }, [api, balances, senderId]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Bond')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Content>
            <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will register')}
                isDisabled={!!propSenderId}
                label={t<string>('send from account')}
                labelExtra={
                  <Available
                    label={t<string>('transferable')}
                    params={senderId}
                  />
                }
                onChange={setSenderId}
                type='account'
              />
            </Modal.Columns>

          </Modal.Content>
          <Modal.Content>
            <Modal.Columns>
              {<InputBalance
                autoFocus
                help={foundsType == FoundsType.MARKET ? t<string>('Type the collateral amount you want to bond. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.') : t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                isError={!hasAvailable}
                isZeroable
                label={foundsType == FoundsType.MARKET ? t<string>('collateral amount') : t<string>('amount')}
                onChange={setAmount}
              />
              }
            </Modal.Columns>
          </Modal.Content>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !amount}
          label={t<string>('Bond')}
          onStart={onClose}
          onSuccess={onSuccess}
          params={[amount, foundsType]}
          tx={api.tx.benefits.addBenefitFunds}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Bond)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
