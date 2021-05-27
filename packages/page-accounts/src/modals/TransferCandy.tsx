// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputCandyBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

function TransferCandy ({ className = '', onClose, recipientId: propRecipientId, senderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [maxBalance] = useState(BN_ZERO);
  const [recipientId, setRecipientId] = useState<string | null>(propRecipientId || null);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Send Candy')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Content>
            <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
              <InputAddress
                defaultValue={senderId}
                help={t<string>('The account you will send funds from.')}
                isDisabled={!!senderId}
                label={t<string>('send from account')}
                type='account'
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Content>
            <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}>
              <InputAddress
                defaultValue={propRecipientId}
                help={t<string>('Select a contact or paste the address you want to send funds to.')}
                isDisabled={!!propRecipientId}
                label={t<string>('send to address')}
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Content>
            <Modal.Columns>
              <InputCandyBalance
                autoFocus
                help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                isError={!hasAvailable}
                isZeroable
                label={t<string>('amount')}
                maxValue={maxBalance}
                onChange={setAmount}
                withMax
              />
            </Modal.Columns>
          </Modal.Content>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !recipientId || !amount}
          label={t<string>('Make Transfer')}
          onStart={onClose}
          params={[recipientId, amount]}
          tx={api.tx.candy.transfer}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(TransferCandy)`
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

  .aliveToggle {
    text-align: right;
  }
`);
