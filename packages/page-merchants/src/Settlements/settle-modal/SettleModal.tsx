// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccounts, useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { Input, InputAddress, Modal, TxButton } from '../../../../react-components/src';

interface Props { fileCid: string, onClose: () => void, onSuccess: () => void }

const SettleModal: React.FC<Props> = ({ fileCid, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState<string|null>('');
  const { api } = useApi();

  return <Modal
    className='order--accounts-Modal'
    header={t('Order Settlement', 'Order Settlement')}
    size='large'
  >
    <Modal.Content>
      <div>
        <InputAddress
          defaultValue={account}
          isDisabled={!hasAccounts}
          label={t('Please choose account')}
          labelExtra={
            <Available
              label={t('transferrable')}
              params={account}
            />
          }
          onChange={setAccount}
          type='account'
        />

        <Input
          autoFocus
          help={t('FileCidDesc')}
          isDisabled={true}
          label={t('File Cid')}
          placeholder={t('File Cid')}
          value={fileCid}
        />
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!account}
        label={t('confirm')}
        onStart={() => {
          onClose();
        }}
        onSuccess={onSuccess}
        params={
          [fileCid]
        }
        tx={api.tx.market.calculateReward}
      />
    </Modal.Actions>
  </Modal>;
};

export default SettleModal;
