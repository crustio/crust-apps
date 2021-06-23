// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import FormatCsmBalance from './FormatCsmBalance';
import BN from 'bn.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function CsmFree ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<any>(api.query.csm.account, [params]);

  return (
    <FormatCsmBalance
      className={className}
      label={label}
      value={new BN(Number(allBalances?.free).toString()).sub(new BN(Number(allBalances?.feeFrozen).toString())) }
    >
      {children}
    </FormatCsmBalance>
  );
}

export default React.memo(CsmFree);
