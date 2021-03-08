// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '../../../../../react-components/src';
import { BitLengthOption } from '../../../../../react-components/src/constants';

const PoolModal = (file, onClose, onSuccess) => {
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [] = useState()
  // TODO: add pool balance


  return <Modal
    className='order--accounts-Modal'
    header={t(`actions.${title || 'order'}`, 'Order')}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t('accountDesc', 'Storage fee will be subtracted from the selected account')}
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
          </Modal.Column>
          <Modal.Column>
             {
               !hasAccounts && <p className='file-info' style={{padding: 0}}>{t('noAccount')}</p>
             }
            <p>{t('accountDesc')}</p>

          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              help={t('FileCidDesc')}
              label={t('File Cid')}
              onChange={setFileCID}
              placeholder={t('File Cid')}
              value={fileCid}
            />
          </Modal.Column>
        </Modal.Columns>
        {/*<Modal.Columns>*/}
        {/*  <Modal.Column>*/}
        {/*    <InputBalance*/}
        {/*      autoFocus*/}
        {/*      defaultValue={tip}*/}
        {/*      help={t('tipDesc')}*/}
        {/*      label={t('tipTitle')}*/}
        {/*      onChange={setTip}*/}
        {/*      onlyCru*/}
        {/*    />*/}
        {/*  </Modal.Column>*/}
        {/*  <Modal.Column>*/}
        {/*    <p>{t('tipDesc')}</p>*/}
        {/*  </Modal.Column>*/}
        {/*</Modal.Columns>*/}
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              autoFocus
              defaultValue={poolBalance}
              help={t('poolBalanceDesc')}
              label={t('poolBalanceTitle')}
              onChange={setPoolBalance}
              onlyCru
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('tipDesc')}</p>
          </Modal.Column>
        </Modal.Columns>

      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!fileCid || !fileSize || !account || !tip || cidNotValid}
        label={t('confirm')}
        onStart={() => {
          onClose();
        }}
        onSuccess={() => {
        }}
        params={
          [fileCid, fileSize, tip, false]
        }
        tx={ }
      />
    </Modal.Actions>
  </Modal>;
};

const OrderWithBundle = connect('doAddOrder', PoolModal);

export default withTranslation('order')(OrderWithBundle);
