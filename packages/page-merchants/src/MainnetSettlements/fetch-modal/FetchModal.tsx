// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button,
  Dropdown, InputAddress,
  Modal
} from '../../../../react-components/src';
import {Available} from "@polkadot/react-query";
import {useAccounts, useApi} from "@polkadot/react-hooks";
import Checkbox from "../../../../react-components/src/Checkbox";

const options = [{
  text: 'Subscan Storage Explorer (Coming Soon)',
  value: 'Subscan Storage Explorer'
}];

interface Props { 
  onClose: () => void, 
  onConfirm: () => void,
  onChangeExpiredStatus: (value: any) => void;
  onChangeAddress: (value: any) => void;
}

const FetchModal: React.FC<Props> = ({ onClose, onConfirm, onChangeExpiredStatus, onChangeAddress }) => {
  const { t } = useTranslation();
  const [dataSource] = useState('Subscan Storage Explorer');
  const { hasAccounts } = useAccounts();
  const [account] = useState<any>();
  const [isAllOrders, setIsAllOrders] = useState(true)
  const [expireOptions, setExpireOptions] = useState<{[k:string]: boolean}>({valid: false, expiredWithin15Days: false, expired15Days: false})
  const { systemChain } = useApi();
  const isMaxwell = systemChain === 'Crust Maxwell';
  const checkboxList = ["valid", "expiredWithin15Days", "expired15Days"]
  const _setCheckboxOption = useCallback((item: string, value: any) => {
    setExpireOptions({
      ...expireOptions,
      [item]: value
    });
    onChangeExpiredStatus({
      ...expireOptions,
      [item]: value
    })
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
                label={t('Choose data source')}
                options={options}
                value={dataSource}
            />
          </Modal.Columns>
        </Modal.Content>
        {
            !isMaxwell && <>
            <Modal.Content>
          <Modal.Columns hint={!hasAccounts && <p className='file-info' style={{padding: 0}}>{t('noAccount')}</p>}>
            <InputAddress
                isMultiple
                label={t('Please choose account')}
                isDisabled={!hasAccounts || isAllOrders}
                labelExtra={
                    <Available
                        params={account}
                    />
                }
                defaultValue={account}
                onChangeMulti={onChangeAddress}
                type='account'
            />
          </Modal.Columns>
          <Modal.Content>
            <div style={{paddingLeft: 15}}>
              <Checkbox value={isAllOrders}
                        className='pv3 pl3 pr1 flex-none'
                        label={t("All orders")}
                        onChange={(value: any) => { setIsAllOrders(value) }} />
            </div>
          </Modal.Content>
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
            </>
        }
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <Button className='tc'
        icon={'check'}
        // isDisabled={true}
        label={t<string>('Submit')}
        onClick={() => {
          onConfirm();
        }}/>
    </Modal.Actions>
  </Modal>;
};

export default FetchModal;
