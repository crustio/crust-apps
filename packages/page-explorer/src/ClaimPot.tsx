// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountInfo } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

const CLAIM_POT_ADDR = 'cTJp8A3DSBpyJth1HsyKtAqJ4KHqMUBqrJm9cXSqrDLTC9DHv';

function ClaimPot ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const accountInfo = useCall<AccountInfo>(api.query.system?.account, [CLAIM_POT_ADDR]);

  return (
    <div className={className}>
      {label || ''}
      <FormatBalance
        value={accountInfo?.data.free}
        withSi
      />
      {children}
    </div>
  );
}

export default React.memo(ClaimPot);
