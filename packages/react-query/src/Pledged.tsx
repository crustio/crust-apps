// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

interface Pledge {
  total: Balance,
  used: Balance
}

function PledgedDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const pledges = useCall<Pledge>(api.query.market.pledges, [params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={pledges?.total}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(PledgedDisplay);
