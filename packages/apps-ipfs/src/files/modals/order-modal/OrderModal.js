// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '../../../../../react-components/src';

const OrderModal = ({ className = '', doAddOrder, file, onChange, onClose, t, title = 'order' }) => {
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState(file ? file.originalSize.toString() : '0');
  const [price, setPrice] = useState('0 CRU');
  const [tip, setTip] = useState(BN_ZERO);
  const { api, isApiReady } = useApi();
  const filePrice = useCall(isApiReady && api.query.market.filePrice);

  useEffect(() => {
    // 0.01cru + storagePrice + tip
    setPrice(formatBalance(filePrice?.mul(new BN(fileSize)).divn(1000000), { decimals: 12 }));
  }, [fileSize, filePrice]);

  return <Modal
    className='app--accounts-Modal'
    header={t(`actions.${title || 'order'}`)}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <InputAddress
          help={t('Storage fee will be subtracted from the selected account')}
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
          help={t('File Cid')}
          label={t('FileCid')}
          onChange={setFileCID}
          placeholder={t('File Cid')}
          value={fileCid}
        />
        <InputNumber
          autoFocus
          help={t('File size')}
          label={t('fileSize (byte)')}
          maxLength={30}
          onChange={setFileSize}
          value={fileSize}
        />
        <InputBalance
          autoFocus
          defaultValue={tip}
          help={t('files would be stored by more merchants with higher tips.')}
          label={t('tip')}
          onChange={setTip}
          onlyCru
        />
        <Input
          help={t('The minimum storage price that needs to be paid for this file.')}
          isDisabled
          label={t('File Price')}
          maxLength={32}
          onChange={setPrice}
          placeholder={t('File price')}
          value={price}
        />
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!fileCid || !fileSize || !account || !tip}
        label={t('Make Transfer')}
        onStart={() => {
          onClose();
        }}
        onSuccess={() => {
          doAddOrder({
            fileCid,
            fileSize
          });
        }}
        params={
          [fileCid, fileSize, tip, false]
        }
        tx={api.tx.market.placeStorageOrder }
      />
    </Modal.Actions>
  </Modal>;
};

const OrderWithBundle = connect('doAddOrder', OrderModal);

export default withTranslation('order')(OrderWithBundle);
