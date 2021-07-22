// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

function JoinGroup ({ className = '', onClose, recipientId: propRecipientId, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [recipientId, setRecipientId] = useState<string | null>(propRecipientId || null);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Join group')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Content>
            <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will send funds from.')}
                isDisabled={!!propSenderId}
                label={t<string>('send from account')}
                onChange={setSenderId}
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
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          label={t<string>('Join group')}
          onStart={onClose}
          params={[recipientId]}
          tx={api.tx.swork.joinGroup}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(JoinGroup)`
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
