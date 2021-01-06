// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import { FormatCapacity } from '.';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function TotalStorage ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const used = useCall<BN>(api.query.swork?.used);
  const free = useCall<BN>(api.query.swork?.free);
  const totalStorage = used && free && used.add(free);

  return (
    <div className={className}>
      {label || ''}
      <FormatCapacity
        value={totalStorage}
        withSi
      />
      {children}
    </div>
  );
}

export default React.memo(TotalStorage);
