// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
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
  const [cidNotValid, setCidNotValid] = useState(false);
  const { api, isApiReady } = useApi();
  const filePrice = useCall(isApiReady && api.query.market.filePrice);

  useEffect(() => {
    // 0.01cru + storagePrice + tip
    setPrice(formatBalance(filePrice?.mul(new BN(fileSize)).divn(1000000), { decimals: 12 }));
  }, [fileSize, filePrice]);
  useEffect(() => {
    setCidNotValid(fileCid && !isIPFS.cid(fileCid) && !isIPFS.path(fileCid));
  }, [fileCid]);

  return <Modal
    className='app--accounts-Modal'
    header={t(`actions.${title || 'order'}`)}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t('accountDesc', 'Storage fee will be subtracted from the selected account')}
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
          </Modal.Column>
          <Modal.Column>
            <p>{t('accountDesc')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              help={t('File Cid')}
              label={t('File Cid')}
              onChange={setFileCID}
              placeholder={t('File Cid')}
              value={fileCid}
            />
          </Modal.Column>
          <Modal.Column>
            {cidNotValid
              ? <p className='file-info'
                style={{ padding: 0 }}>{t('fileValid')}</p>
              : <p>{t('File Cid')}</p>}
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputNumber
              autoFocus
              help={t('File size')}
              label={t('fileSizeDesc')}
              maxLength={30}
              onChange={setFileSize}
              value={fileSize}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('fileSizeDesc')}, {Fsize(fileSize)}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              autoFocus
              defaultValue={tip}
              help={t('tipDesc')}
              label={t('tip')}
              onChange={setTip}
              onlyCru
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('tipDesc')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              help={t('priceDesc')}
              isDisabled
              label={t('File Price')}
              maxLength={32}
              onChange={setPrice}
              placeholder={t('File price')}
              value={price}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('priceDesc')}</p>

          </Modal.Column>
        </Modal.Columns>
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!fileCid || !fileSize || !account || !tip || cidNotValid}
        label={t('confirm')}
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
