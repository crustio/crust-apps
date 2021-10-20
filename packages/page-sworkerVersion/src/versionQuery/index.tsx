// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Button, InputAddressSimple } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import VersionsState from './VersionsState';
import { PKInfo } from '../SummaryInfo';

interface Props {
  className?: string;
  current: number;
  pkInfos: PKInfo[];
  isLoading: boolean;
}

function VersionQuery ({ className, current, pkInfos, isLoading }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // const { value } = useParams<{ value: string }>();
  const [value, setValue] = useState<string | null>(null);
  const [validatorId, setValidatorId] = useState<string | null>(value || null);

  const _onQuery = useCallback(
    (): void => {
      if (validatorId) {
        setValue(validatorId)
      }
    },
    [validatorId]
  );

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        help={t<string>('')}
        label={t<string>('Enter the address to be queried')}
        onChange={setValidatorId}
        onEnter={_onQuery}
      >
        <Button
          icon='play'
          isDisabled={!validatorId || isLoading}
          onClick={_onQuery}
        />
      </InputAddressSimple>
      {
        value && (<VersionsState current={current} address={value} pkInfos={pkInfos} isLoading={isLoading}></VersionsState>)
      }
      
    </div>
  );
}

export default React.memo(VersionQuery);
