// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '../../../../../react-components/src';
import { BitLengthOption } from "../../../../../react-components/src/constants"

const OrderModal = ({ className = '', doAddOrder, file, onClose, t, title = 'order' }) => {
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState(file ? file.originalSize.toString() : '0');
  const [price, setPrice] = useState('0 CRU');
  const [tip, setTip] = useState(0);
  const [cidNotValid, setCidNotValid] = useState(false);
  const { api, isApiReady } = useApi();
  const filePrice = useCall(isApiReady && api.query.market.filePrice) || new BN(0);
  const fileBaseFee = useCall(isApiReady && api.query.market.fileBaseFee)
  const basePrice = fileBaseFee ? fileBaseFee.toString() : 0
  const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC;

  useEffect(() => {
    const tipFee= new BN(tip.toString())
    setPrice(formatBalance(filePrice?.mul(new BN(fileSize)).divn(1024*1024).add(new BN(basePrice)).add(tipFee), { decimals: 12, forceUnit: 'CRU' }));
  }, [fileSize, filePrice, tip, basePrice]);
  useEffect(() => {
    setCidNotValid(fileCid && !isIPFS.cid(fileCid) && !isIPFS.path(fileCid));
  }, [fileCid]);

  return <Modal
    className='order--accounts-Modal'
    header={t(`actions.${title || 'order'}`, 'Order')}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <Modal.Content>
          <Modal.Columns hint={!hasAccounts && <p className='file-info' style={{padding: 0}}>{t('noAccount')}</p>}>
            <InputAddress
              label={t('Please choose account')}
              isDisabled={!hasAccounts}
              labelExtra={
                <Available
                  label={t('transferrable')}
                  params={account}
                />
              }
              defaultValue={account}
              onChange={setAccount}
              type='account'
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={cidNotValid
            ? <p className='file-info'
                 style={{ padding: 0 }}>{t('fileCidValid')}</p>
            : <p>{t('FileCidDesc')}</p>}>
            <Input
              autoFocus
              help={t('FileCidDesc')}
              label={t('File Cid')}
              onChange={setFileCID}
              placeholder={t('File Cid')}
              value={fileCid}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={<p>{t('fileSizeDesc')}, {Fsize(fileSize)}</p>}>
            <InputNumber
              autoFocus
              bitLength={DEFAULT_BITLENGTH}
              isError={false}
              help={t('fileSizeDesc')}
              isDisabled={title === 'speed' || title === 'renew'}
              label={t('fileSizeTitle')}
              onChange={setFileSize}
              value={fileSize}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={t('tipDesc')}>
            <InputBalance
              autoFocus
              defaultValue={tip}
              help={t('tipDesc')}
              label={t('tipTitle')}
              onChange={setTip}
              onlyCru
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={t('priceDesc')}>
            <Input
              help={t('priceDesc')}
              isDisabled
              label={t('File price')}
              maxLength={32}
              onChange={setPrice}
              placeholder={t('File price')}
              value={price}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={t('durationDesc')}>
            <Input
              help={t('durationDesc')}
              isDisabled
              label={t('durationLabel')}
              value={6}
            />
          </Modal.Columns>
        </Modal.Content>
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
            fileSize,
          });
        }}
        params={
          [fileCid, fileSize, tip]
        }
        tx={api.tx.market.placeStorageOrder }
      />
    </Modal.Actions>
  </Modal>;
};

const OrderWithBundle = connect('doAddOrder', OrderModal);

export default withTranslation('order')(OrderWithBundle);
