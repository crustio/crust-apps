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
  const reportedFilesSize = useCall<BN>(api.query.swork?.reportedFilesSize);
  const free = useCall<BN>(api.query.swork?.free);

  let totalStorage = 0;
  if (free && reportedFilesSize) {
    totalStorage = new BN(free.toString()).add(new BN(reportedFilesSize.toString()).muln(2)).toNumber()
  }

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
