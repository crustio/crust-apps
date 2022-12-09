// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, { useEffect, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '../../../../../react-components/src';
import { formatBalance } from '@polkadot/util';

const PoolModal = ({ file, onClose, onSuccess }) => {
  const {t} = useTranslation('order')
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [prepaid, setPrepaid] = useState(0)
  const { api, isApiReady } = useApi();
  return <Modal
    className='order--accounts-Modal'
    header={t('Add Balance', 'Add Balance')}
    size='large'
  >
    <Modal.Content>
      <div>
        <InputAddress
          label={t('Please choose account')}
          isDisabled={!hasAccounts}
          labelExtra={
            <Available
              label={t('transferable')}
              params={account}
            />
          }
          defaultValue={account}
          onChange={setAccount}
          type='account'
        />
        <Input
          autoFocus
          help={t('FileCidDesc')}
          label={t('File Cid')}
          onChange={setFileCID}
          placeholder={t('File Cid')}
          value={fileCid}
        />
        <InputBalance
          labelExtra={`Current balance ${formatBalance(file.prepaid, { decimals: 12, forceUnit: 'CRU' })}`}
          autoFocus
          onlyCru
          defaultValue={prepaid}
          label={t('Amount')}
          onChange={setPrepaid}
        />
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!fileCid || !account || !prepaid}
        label={t('confirm')}
        onStart={() => {
          onClose();
        }}
        onSuccess={() => {
        }}
        params={
          [fileCid, prepaid]
        }
        tx={api.tx.market.addPrepaid}
      />
    </Modal.Actions>
  </Modal>;
};

const OrderWithBundle = connect('doAddOrder', PoolModal);

export default withTranslation('order')(OrderWithBundle);
