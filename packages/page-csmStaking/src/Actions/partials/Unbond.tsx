// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AmountValidateState, UnbondInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, InputCsmBalance, Modal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { CsmLocked } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

interface Props {
  className?: string;
  accountId: string | null | undefined;
  onChange: (info: UnbondInfo) => void;
  withSenders?: boolean;
}

const EMPTY_INFO = {
  unbondTx: null,
  accountId: null
};

function Bond ({ accountId, className = '', onChange, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [startBalance, setStartBalance] = useState<BN | null>(null);
  const accountBalance = useCall<any>(api.query.csmLocking.ledger, [accountId]);

  useEffect((): void => {
    onChange(
      (amount && amount.gtn(0) && !amountError?.error && accountId)
        ? {
          unbondTx: api.tx.csmLocking.unbond(amount),
          accountId
        }
        : EMPTY_INFO
    );
  }, [api, amount, amountError, accountId, onChange]);

  useEffect((): void => {
    accountBalance && setStartBalance(
      new BN(Number(accountBalance.total).toString()) .gt(BN_ZERO)
        ? new BN(Number(accountBalance.total).toString()).sub(new BN(Number(accountBalance.active).toString()))
        : BN_ZERO
    );
  }, [api, accountBalance]);

  useEffect((): void => {
    setStartBalance(null);
  }, [accountId]);

  const hasValue = !!amount?.gtn(0);

  return (
    <div className={className}>
      {withSenders && (<Modal.Columns>
        <InputAddress
          label={t<string>('account')}
          type='account'
          value={accountId}
        />
      </Modal.Columns>)}
      {startBalance && (
        <Modal.Columns>
          <InputCsmBalance
            autoFocus
            defaultValue={startBalance}
            help={t<string>('')}
            isError={!hasValue || !!amountError?.error}
            label={t<string>('value unbonded')}
            labelExtra={
              <CsmLocked
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
