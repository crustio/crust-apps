// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountInfo } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isFunction } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';


interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

function Register ({ className = '', onClose, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [isProtected] = useState(true);
  const [isAll] = useState(false);
  const [maxTransfer, setMaxTransfer] = useState<BN | null>(null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [senderId]);
  const accountInfo = useCall<AccountInfo>(api.query.system.account, [senderId]);

  useEffect((): void => {
    if (balances && balances.accountId.eq(senderId) && senderId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.market
            .register(balances.availableBalance)
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

  const canToggleAll = !isProtected && balances && balances.accountId.eq(senderId) && maxTransfer && (!accountInfo || !accountInfo.refcount || accountInfo.refcount.isZero());

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Merchant register')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns>
            <Modal.Column>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will register')}
                isDisabled={!!propSenderId}
                label={t<string>('send from account')}
                labelExtra={
                  <Available
                    label={t<string>('transferrable')}
                    params={senderId}
                  />
                }
                onChange={setSenderId}
                type='account'
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              {canToggleAll && isAll
                ? (
                  <InputBalance
                    autoFocus
                    defaultValue={maxTransfer}
                    help={t<string>('The full account balance to be transferred, minus the transaction fees')}
                    isDisabled
                    key={maxTransfer?.toString()}
                    label={t<string>('transferrable minus fees')}
                  />
                )
                : (
                  <>
                    <InputBalance
                      autoFocus
                      help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                      isError={!hasAvailable}
                      isZeroable
                      label={t<string>('amount')}
                      onChange={setAmount}
                    />
                    <InputBalance
                      defaultValue={api.consts.balances.existentialDeposit}
                      help={t<string>('The minimum amount that an account should have to be deemed active')}
                      isDisabled
                      label={t<string>('existential deposit')}
                    />
                  </>
                )
              }
            </Modal.Column>
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !amount}
          label={t<string>('Make Transfer')}
          onStart={onClose}
          params={[amount]}
          tx={api.tx.market.register}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Register)`
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
