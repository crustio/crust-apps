// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button,
  Dropdown,
  Modal } from '../../../../react-components/src';

const options = [{
  text: 'Crust Storage Explorer',
  value: 'Crust Storage Explorer'
}];

interface Props { onClose:() => void, onConfirm: () => void }

const FetchModal:React.FC<Props> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [dataSource] = useState('Crust Storage Explorer');

  return <Modal
    className='order--accounts-Modal'
    header={t('Choose Data Source', 'Choose Data Source')}
    size='large'
  >
    <Modal.Content>
      <div>
        <Dropdown
          className='js--Dropdown'
          defaultValue={'Crust Storage Explorer'}
          label={t('Choose data source')}
          options={options}
          value={dataSource}
        />
      </div>
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
