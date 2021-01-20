// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, Modal, TxButton } from '../../../../../react-components/src';

interface Props extends WithTranslation{
  file?: IFile
  className?: string;
  onChange: () => void;
  onClose: () => void;
  doAddOrder: (any) => void
}
type IFile = {
  cid: string,
  size: string,
  originalSize: string
}

const OrderModal: React.FC<Props> = ({ className = '', doAddOrder, file, onChange, onClose, t }) => {
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState<string>(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState<string>(file ? file.originalSize : '0');
  const [price, setPrice] = useState<string | undefined>('0 CRU');
  const [tip, setTip] = useState<BN | undefined>(BN_ZERO);
  const { api } = useApi();
  const filePrice = useCall<BN>(api.query.market.filePrice);

  useEffect(() => {
    console.log(filePrice);
    // 0.01cru + storagePrice + tip
    setPrice(formatBalance(filePrice?.mul(new BN(fileSize)).divn(1000000), { decimals: 12 }));
  }, [fileSize, filePrice]);

  return <Modal
    className='app--accounts-Modal'
    header={t('order')}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <InputAddress
          help={t<string>('The account you will send funds from.')}
          label={t<string>('send from account')}
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
          help={t<string>('The name that will be displayed in your accounts list.')}
          label={t<string>('fileCid')}
          maxLength={32}
          onChange={setFileCID}
          placeholder={t('My On-Chain Name')}
          value={fileCid}
        />
        <Input
          autoFocus
          help={t<string>('The name that will be displayed in your accounts list.')}
          label={t<string>('fileSize')}
          maxLength={32}
          onChange={setFileSize}
          placeholder={t('My On-Chain Name')}
          value={fileSize}
        />
        <InputBalance
          autoFocus
          defaultValue={tip}
          help={t<string>('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the free amount available)')}
          label={t<string>('Tip')}
          onChange={setTip}
          onlyCru
        />
        <Input
          help={t<string>('The name that will be displayed in your accounts list.')}
          isDisabled
          label={t<string>('Price')}
          maxLength={32}
          onChange={setPrice}
          placeholder={t('My On-Chain Name')}
          value={price}
        />
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!account || !price}
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

const OrderWithBundle = connect('doAddOrder', OrderModal);

export default withTranslation('order')(OrderWithBundle);
