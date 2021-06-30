// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { SetGuaranteePrefInfo } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';

import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_HUNDRED as MAX_COMM } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';

interface Props {
  className?: string;
  accountId: string;
  onChange: (info: SetGuaranteePrefInfo) => void;
  withSenders?: boolean;
}

const COMM_MUL = new BN(1e7);

function SetGuaranteePref ({ className = '', accountId, onChange, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [prefs, setPrefs] = useState<BN | number>(1);

  useEffect((): void => {
    try {
      onChange({
        guaranteePrefTx: api.tx.csmLocking.setGuaranteePref(
           new BN(prefs).isZero()
            // small non-zero set to avoid isEmpty
            ? '0'
            : prefs
        )
      });
    } catch {
      onChange({ guaranteePrefTx: null });
    }
  }, [api, prefs, onChange]);

  const _setPrefs = useCallback(
    (value?: BN) => value && setPrefs(
      value.isZero()
        ? 0 // small non-zero set to avoid isEmpty
        : value.mul(COMM_MUL)
    ),
    []
  );

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns hint={t<string>('')}>
          <InputAddress
            defaultValue={accountId}
            isDisabled
            label={t<string>('account')}
          />
        </Modal.Columns>
      )}
      <Modal.Columns hint={''}>
        <InputNumber
          help={t<string>('The percentage reward (0-100) that should be applied for the provider')}
          isZeroable
          label={t<string>('reward percentage')}
          maxValue={MAX_COMM}
          onChange={_setPrefs}
        />
      </Modal.Columns>
    </div>
  );
}

export default React.memo(SetGuaranteePref);
