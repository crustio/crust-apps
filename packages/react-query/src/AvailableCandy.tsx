// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address, Balance } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import FormatCandy from './FormatCandy';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function AvailableDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<Balance>(api.query.candy?.balances, [params]);

  return (
    <FormatCandy
      className={className}
      label={label}
      value={allBalances}
    >
      {children}
    </FormatCandy>
  );
}

export default React.memo(AvailableDisplay);
