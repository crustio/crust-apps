// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import './index.css';

import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { Input, InputAddress, MarkWarning, Modal, TxButton } from '../../../../react-components/src';

interface Props { fileCid: string, onClose: () => void, onSuccess: () => void }

function parserStrToObj (str: any) {
  if (!str) {
    return null;
  } else {
    return JSON.parse(JSON.stringify(str));
  }
}

const SettleModal: React.FC<Props> = ({ fileCid, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState<string|null>('');
  const { api, isApiReady } = useApi();
  const [txFee, setTxfee] = useState<any>();
  const currentBenefits = useCall(isApiReady && api.query.benefits.currentBenefits);
  const marketBenefits = useCall(isApiReady && api.query.benefits.marketBenefits, [account]);
  const benefits = useMemo(() => {
    const total_market_active_funds = currentBenefits ? _.get(parserStrToObj(currentBenefits), 'total_market_active_funds') : 1;
    const total_fee_reduction_quota = marketBenefits ? _.get(parserStrToObj(currentBenefits), 'total_fee_reduction_quota') : 0;
    const active_funds = marketBenefits ? _.get(parserStrToObj(marketBenefits), 'active_funds') : 0;

    return active_funds / total_market_active_funds * total_fee_reduction_quota;
  }, [currentBenefits, marketBenefits]);

  useEffect(() => {
    account && api.tx.market.calculateReward(fileCid)
      .paymentInfo(account)
      .then(({ partialFee }): void => {
        setTxfee(partialFee);
      }).catch(() => {
        setTxfee(0);
      });
  }, [fileCid, account]);
  const showWarning = useMemo(() => {
    // return benefits !== 0 && txFee <= benefits
    return true;
  }, [benefits, txFee]);

  return <Modal
    className='order--accounts-Modal'
    header={t('Order Settlement', 'Order Settlement')}
    size='large'
  >
    <Modal.Content>
      <div>
        <InputAddress
          defaultValue={account}
          isDisabled={!hasAccounts}
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

        <Input
          autoFocus
          help={t('FileCidDesc')}
          isDisabled={true}
          label={t('File Cid')}
          placeholder={t('File Cid')}
          value={fileCid}
        />
        {showWarning && <MarkWarning content={t('The account does not have enough free funds (excluding' +
          ' locked/bonded/reserved) available to cover the transaction  without dropping the balance below the account existential amount.')}/>}
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!account}
        label={t('confirm')}
        onStart={() => {
          onClose();
        }}
        onSuccess={onSuccess}
        params={
          [fileCid]
        }
        tx={api.tx.market.calculateReward}
      />
    </Modal.Actions>
  </Modal>;
};

export default SettleModal;
