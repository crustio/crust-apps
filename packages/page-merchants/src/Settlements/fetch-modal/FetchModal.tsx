// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button,
  Dropdown, Modal
} from '../../../../react-components/src';

const options = [{
  text: 'Subscan Storage Explorer (Coming Soon)',
  value: 'Subscan Storage Explorer'
}];

interface Props { onClose: () => void, onConfirm: () => void }

const FetchModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [dataSource] = useState('Subscan Storage Explorer');

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