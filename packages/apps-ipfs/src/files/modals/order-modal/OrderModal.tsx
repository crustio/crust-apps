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

interface Props extends WithTranslation{
  file?: IFile
  className?: string;
  onChange: () => void;
  onClose: () => void;
  doAddOrder: (any) => void;
  title?: string
}
type IFile = {
  cid: string,
  size: string,
  originalSize: string
}

const OrderModal: React.FC<Props> = ({ className = '', doAddOrder, file, onChange, onClose, t, title = 'order' }) => {
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState<string>(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState<string>(file ? file.originalSize : '0');
  const [price, setPrice] = useState<string | undefined>('0 CRU');
  const [tip, setTip] = useState<BN | undefined>(BN_ZERO);
  const { api, isApiReady } = useApi();
  const filePrice = useCall<BN>(isApiReady && api.query.market.filePrice);

  useEffect(() => {
    // 0.01cru + storagePrice + tip
    setPrice(formatBalance(filePrice?.mul(new BN(fileSize)).divn(1000000), { decimals: 12 }));
  }, [fileSize, filePrice]);

  return <Modal
    className='app--accounts-Modal'
    header={t(`${title}`, 'order')}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <InputAddress
          help={t<string>('Storage fee will be subtracted from the selected account')}
          label={t<string>('Please choose account')}
          labelExtra={
            <Available
              label={t<string>('transferrable')}
              params={account}
            />
          }
          onChange={setAccount}
          type='account'
        />
        <Input
          autoFocus
          help={t<string>('File Cid')}
          label={t<string>('FileCid')}
          onChange={setFileCID}
          placeholder={t('My On-Chain Name')}
          value={fileCid}
        />
        <InputNumber
          autoFocus
          help={t<string>('File size')}
          label={t<string>('fileSize (byte)')}
          maxLength={30}
          onChange={setFileSize}
          value={fileSize}
        />
        <InputBalance
          autoFocus
          defaultValue={tip}
          help={t<string>('files would be stored by more merchants with higher tips.')}
          label={t<string>('Tip')}
          onChange={setTip}
          onlyCru
        />
        <Input
          help={t<string>('The minimum storage price that needs to be paid for this file.')}
          isDisabled
          label={t<string>('File Price')}
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
        label={t<string>('Make Transfer')}
        onStart={() => {
          doAddOrder({
            fileCid,
            fileSize
          });
          onClose();
        }}
        params={
          [fileCid, fileSize, tip, false]
        }
        tx={api.tx.market.placeStorageOrder }
      />
    </Modal.Actions>
  </Modal>;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const OrderWithBundle = connect('doAddOrder', OrderModal);

export default withTranslation('order')(OrderWithBundle);
