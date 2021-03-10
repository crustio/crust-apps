// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccounts } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import {
  Dropdown,
  InputAddress,
  Modal,
  Button
} from '../../../../../react-components/src';
const options = [{
  text:"Crust Storage Explorer",
  value:"Crust Storage Explorer"
}]
const FetchModal = ({  onClose, onConfirm }) => {
  const {t} = useTranslation('order')
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const [dataSource] = useState('Crust Storage Explorer')
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
              label={t('transferrable')}
              params={account}
            />
          }
          defaultValue={account}
          onChange={setAccount}
          type='account'
        />
        <Dropdown
          className='js--Dropdown'
          label={t('Choose data source')}
          options={options}
          defaultValue={'Crust Storage Explorer'}
          value={dataSource}
        />
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <Button icon={'check'} isDisabled={!account} onClick={() => {
        onConfirm(account)
      }} className='tc'>{t('actions.submit')}</Button>
    </Modal.Actions>
  </Modal>;
};
export default  FetchModal
