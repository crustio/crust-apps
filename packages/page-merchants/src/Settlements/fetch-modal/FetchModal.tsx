// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccounts } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { Button,
  Dropdown, InputAddress,
  Modal } from '../../../../react-components/src';
import Checkbox from '../../../../react-components/src/Checkbox';

const options = [{
  text: 'Crust Storage Explorer',
  value: 'Crust Storage Explorer'
}];

interface Props { onClose: () => void, onConfirm: () => void }

const FetchModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [dataSource] = useState('Crust Storage Explorer');
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState<any>();
  const [expireOptions, setExpireOptions] = useState<{[k: string]: boolean}>({ valid: false, expiredWithin15Days: false, expired15Days: false });
  const checkboxList = ['valid', 'expiredWithin15Days', 'expired15Days'];
  const _setCheckboxOption = useCallback((item: string, value: any) => {
    setExpireOptions({
      ...expireOptions,
      [item]: value
    });
  }, [expireOptions]);

  return <Modal
    className='order--accounts-Modal'
    header={t('Choose Data Source', 'Choose Data Source')}
    size='large'
  >
    <Modal.Content>
      <Modal.Content>
        <Modal.Columns>
          <Dropdown
            className='js--Dropdown'
            defaultValue={'Crust Storage Explorer'}
            label={t('Choose data source')}
            options={options}
            value={dataSource}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Content>
        <Modal.Columns hint={!hasAccounts && <p className='file-info'
          style={{ padding: 0 }}>{t('noAccount')}</p>}>
          <InputAddress
            defaultValue={account}
            isDisabled={!hasAccounts}
            isMultiple
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
        </Modal.Columns>
      </Modal.Content>
      <Modal.Content>
        <div style={{ paddingLeft: 15 }}>{
          checkboxList.map((item) => <Checkbox className='pv3 pl3 pr1 flex-none'
            key={item}
            label={t(item)}
            onChange={(value: any) => { _setCheckboxOption(item, value); }}
            value={expireOptions[item]} />)
        }
        </div>
      </Modal.Content>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <Button className='tc'
        icon={'check'}
        label={t<string>('Submit')}
        onClick={() => {
          onConfirm();
        }}/>
    </Modal.Actions>
  </Modal>;
};

export default FetchModal;
