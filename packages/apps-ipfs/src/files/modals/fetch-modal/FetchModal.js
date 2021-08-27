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
  text:"Subscan Storage Explorer (Coming Soon)",
  value:"Subscan Storage Explorer"
}]
const FetchModal = ({  onClose, onConfirm }) => {
  const {t} = useTranslation('order')
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const [dataSource] = useState('Subscan Storage Explorer')
  const isComingSoon = true;
  return <Modal
    className='order--accounts-Modal'
    header={t('Fetch Orders', 'Fetch Orders')}
    size='large'
  >
    <Modal.Content>
      <div>
        <Modal.Columns hint={t("fetchTips", "1.The Fetch function is provided by Subscan Storage Explorer, which is a public service and may cause certain delay or time gap. Results shown on this page doe not necessarily reflect the latest network status.")}>
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
        <Modal.Columns hint={t("fetchTips2", "2.There will be soon a new Subscan service going live to enhance Fetch" +
          " performance.")}>
          <Dropdown
            className='js--Dropdown'
            label={t('Choose data source')}
            options={options}
            value={dataSource}
          />
        </Modal.Columns>
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <Button icon={'check'} isDisabled={!account || isComingSoon} label={t('actions.submit')} onClick={() => {
        onConfirm(account)
      }} className='tc'/>
    </Modal.Actions>
  </Modal>;
};
export default  FetchModal
