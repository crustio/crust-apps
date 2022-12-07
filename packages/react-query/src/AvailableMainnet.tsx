// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';

import { useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';
import { useMainnetApi } from '@polkadot/react-hooks/useMainnetApi';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function AvailableMainnetDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useMainnetApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={allBalances?.availableBalance}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(AvailableMainnetDisplay);
