// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance, IndividualExposure } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';
import BN from 'bn.js';
import { Compact } from '@polkadot/types/codec';
import { BN_ZERO } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  target?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  guarantor?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

interface Guarantee {
  targets: IndividualExposure[];
  total: Compact<Balance>;
  submitted_in: number;
  suppressed: boolean;
}

function CutGuaranteeableDisplay ({ children, className = '', label, target, guarantor }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const guaranteeRel = useCall<Guarantee>(api.query.staking.guarantors, [guarantor]);
  
  let cutGuaranteeable = new BN(0);
  if (guaranteeRel) {
    const tmpRes: IndividualExposure[] = JSON.parse(JSON.stringify(guaranteeRel)).targets;
    console.log('tmpRes', tmpRes)
    cutGuaranteeable = tmpRes.filter(e => e.who === target).reduce((total: BN, { value }) => { return total.add(new BN(Number(value).toString()))}, BN_ZERO)
  }
  
  return (
    <FormatBalance
      className={className}
      label={label}
      value={cutGuaranteeable}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(CutGuaranteeableDisplay);
