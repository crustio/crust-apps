// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React, { useEffect, useState } from 'react';

import { InputAddress, Modal, InputCsmBalance } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { useApi } from '@polkadot/react-hooks';
import { CsmFree } from '@polkadot/react-query';

import { AmountValidateState, BondInfo } from './types';
import { EMPTY_INFO } from './Bond';
import BN from 'bn.js';

interface Props {
  className?: string;
  accountId: string;
  onChange: (info: BondInfo) => void;
  withSenders?: boolean;
}

function SetBond({ accountId, className = '', onChange, withSenders }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);

  useEffect((): void => {
    onChange(
      (amount && amount.gtn(0) && !amountError?.error && accountId)
        ? {
          bondTx: api.tx.csmLocking.bond(amount),
          accountId
        }
        : EMPTY_INFO
    );
  }, [api, amount, amountError, accountId, onChange]);

  const hasValue = !!amount?.gtn(0);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Content>
          <Modal.Columns hint={t<string>('The account that is to be affected.')}>
            <InputAddress
              defaultValue={accountId}
              isDisabled
              label={t<string>('account')}
            />
          </Modal.Columns>
        </Modal.Content>
      )}
      <Modal.Columns>
        <InputCsmBalance
          autoFocus
          help={t<string>('')}
          isError={!hasValue || !!amountError?.error}
          label={t<string>('value bonded')}
          labelExtra={
            <CsmFree
              label={<span className='label'>{t<string>('balance')}</span>}
              params={accountId}
            />
          }
          onChange={setAmount}
          onError={setAmountError}
        />
      </Modal.Columns>  
    </div>
  );
}

export default React.memo(SetBond);


