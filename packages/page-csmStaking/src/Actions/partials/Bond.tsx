// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AmountValidateState, BondInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, InputCsmBalance, Modal } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { CsmFree } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

interface Props {
  className?: string;
  onChange: (info: BondInfo) => void;
  isGuarantor?: boolean;
}

export const EMPTY_INFO = {
  bondTx: null,
  accountId: null
};

function Bond ({ className = '', onChange, isGuarantor }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [startBalance, setStartBalance] = useState<BN | null>(null);
  const accountBalance = useCall<any>(api.query.csm.account, [accountId]);
  const { allAccounts } = useAccounts();

  useEffect((): void => {
    onChange(
      !isGuarantor || (amount && amount.gtn(0) && !amountError?.error && accountId)
        ? {
          bondTx: api.tx.csmLocking.bond(amount),
          accountId
        }
        : EMPTY_INFO
    );
  }, [api, amount, amountError, accountId, onChange, isGuarantor]);

  useEffect((): void => {
    accountBalance && setStartBalance(
      accountBalance.free.gt(api.consts.balances.existentialDeposit)
        ? accountBalance.free.sub(api.consts.balances.existentialDeposit)
        : BN_ZERO
    );
  }, [api, accountBalance]);

  useEffect((): void => {
    setStartBalance(null);
  }, [accountId]);
  const hasValue = isGuarantor ? !!amount?.gtn(0) : true ;

  return (
    <div className={className}>
      <Modal.Columns>
        <InputAddress
          filter={allAccounts}
          label={t<string>('account')}
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
      </Modal.Columns>
      {startBalance && (
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
      )}
    </div>
  );
}

export default React.memo(Bond);
