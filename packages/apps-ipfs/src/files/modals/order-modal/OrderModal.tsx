// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '../../../../../react-components/src';
import React, { useCallback, useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Available, BalanceFree } from '@polkadot/react-query';
interface Props extends WithTranslation{
  file: IFile
  className?: string;
  onChange: () => void;
  onClose: () => void
}
type IFile = {
  CID: string,
  size: string,
  originalSize: string
}

const OrderModal: React.FC<Props> = ({ className = '', file, onChange, onClose, t }) => {
  const [account, setAccount] = useState(null);
  const [fileCID, setFileCID] = useState<string>(file.CID);
  const [fileSize, setFileSize] = useState<string>(file.originalSize);
  const [price, setPrice] = useState<string>('0');
  const [tip, setTip] = useState<string>('0');

  useEffect(() => {
    setPrice('100');
  }, [fileSize]);

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
          label={t<string>('fileCID')}
          maxLength={32}
          onChange={setFileCID}
          placeholder={t('My On-Chain Name')}
          value={fileCID}
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
          defaultValue={price}
          help={t<string>('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the free amount available)')}
          isDisabled
          label={t<string>('Price')}
        />
        <InputBalance
          autoFocus
          defaultValue={tip}
          help={t<string>('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the free amount available)')}
          label={t<string>('Tip')}
          onChange={setTip}
          onlyCru
        />
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!account || !price}
        label={t<string>('Make Transfer')}
        onStart={onClose}
        params={
          [account, fileSize, tip]
        }
        tx={
          'balances.transfer' }
      />
    </Modal.Actions>
  </Modal>;
};

export default withTranslation('order')(OrderModal);
