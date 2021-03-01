// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function AvailableCollateral ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<any>(api.query.market.merchantLedgers, [params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={allBalances?.collateral}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(AvailableCollateral);
