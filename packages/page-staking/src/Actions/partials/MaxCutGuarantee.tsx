// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import React from 'react';

import { useTranslation } from '@polkadot/react-components/translate';

import { formatBalance } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: BN;
}

function MaxCutGuaranteeDisplay ({ params }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <span className='highlight'>{t<string>('cutGuaranteeable')} {formatBalance(params, {withUnit: "CRU"})}</span>
    </>
  );
}

export default React.memo(MaxCutGuaranteeDisplay);
