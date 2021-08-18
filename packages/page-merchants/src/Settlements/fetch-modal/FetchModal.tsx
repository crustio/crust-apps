// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dropdown, InputAddress,
  Modal
} from '../../../../react-components/src';
import {Available} from "@polkadot/react-query";
import {useAccounts} from "@polkadot/react-hooks";
import Checkbox from "../../../../react-components/src/Checkbox";

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
  const [expireOptions, setExpireOptions] = useState<{[k:string]:boolean}>({valid: false, expiredWithin15Days: false, expired15Days: false})
  const checkboxList = ["valid", "expiredWithin15Days", "expired15Days"]
  const _setCheckboxOption = useCallback((item: string, value: any) => {
      setExpireOptions({
          ...expireOptions,
          [item]: value,
      })
  }, [expireOptions])

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
          <Modal.Columns hint={!hasAccounts && <p className='file-info' style={{padding: 0}}>{t('noAccount')}</p>}>
            <InputAddress
                isMultiple
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
            <div style={{paddingLeft: 15}}>{
                checkboxList.map((item) => <Checkbox key={item} value={expireOptions[item]}
                                                 className='pv3 pl3 pr1 flex-none'
                                                 label={t(item)}
                                                 onChange={(value: any) => { _setCheckboxOption(item, value) }} />)
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
