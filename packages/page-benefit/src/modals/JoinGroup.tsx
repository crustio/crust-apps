// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, MarkError, Modal, TxButton } from '@polkadot/react-components';
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
  const [isDisable, setIsDisable] = useState<boolean>(true);

  useEffect(() => {
    const address = JSON.parse(JSON.stringify(senderId));
    if (address) {  
      api.query.swork
      .identities<any>(address)
      .then((identity): void => {
        const identityOpt = JSON.parse(JSON.stringify(identity));
        if (identityOpt) {
          setIsDisable(false)
        } else {
          setIsDisable(true)
        }
      })
      .catch((): void => setIsDisable(true));
    }

  }, [api, senderId])

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Join group')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Content>
            <Modal.Columns>
              <InputAddress
                defaultValue={propRecipientId}
                help={t<string>('Select a contact or paste the group owner you want to join.')}
                isDisabled={!!propRecipientId}
                label={t<string>('group onwer account')}
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Content>
            <Modal.Columns hint={t<string>('The transaction fees will be subtracted from the sender account.')}>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will join group.')}
                isDisabled={!!propSenderId}
                label={t<string>('member account')}
                onChange={setSenderId}
                type='account'
              />
              {isDisable && (<MarkError content={t<string>('Please wait for member account to report the first work report and then join the group')} />)}
            </Modal.Columns>
          </Modal.Content>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          label={t<string>('Join group')}
          isDisabled={isDisable}
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
