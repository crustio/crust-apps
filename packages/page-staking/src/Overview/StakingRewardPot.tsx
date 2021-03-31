// Copyright 2017-2020 @polkadot/react-query authors & contributors
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

function StakingRewardPot ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const accountInfo = useCall<AccountInfo>(api.query.system.account, ['5EYCAe5g8Nk91uGKxvfL8xdY7VwfUP9JJDdBbDuGFB6cy4cY']);

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

export default React.memo(StakingRewardPot);
