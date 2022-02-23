// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';

import CsmFree from '@polkadot/react-query/CsmFree';

export interface Props {
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function AvailableCsmDisplay ({ className = '', label, params }: Props): React.ReactElement<Props> | null {
  if (!params) {
    return null;
  }

  return (
    <CsmFree
      className={`ui--Available ${className}`}
      label={label}
      params={params}
    />
  );
}

export default React.memo(AvailableCsmDisplay);
