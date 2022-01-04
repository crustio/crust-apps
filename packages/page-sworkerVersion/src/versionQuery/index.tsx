// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, InputAddressSimple } from '@polkadot/react-components';

import { PKInfo } from '../SummaryInfo';
import HttpStatus from './HttpStatus';
import VersionsState from './VersionsState';

interface Props {
  className?: string;
  current: number;
  pkInfos: PKInfo[];
  isLoading: boolean;
}

function VersionQuery ({ className, current, isLoading, pkInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // const { value } = useParams<{ value: string }>();
  const [value, setValue] = useState<string | null>(null);
  const [validatorId, setValidatorId] = useState<string | null>(value || null);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const _onQuery = useCallback(
    (): void => {
      if (validatorId) {
        setValue(validatorId);
      }
    },
    [validatorId]
  );

  return (
    <div className={className}>
      <HttpStatus
        isStatusOpen={statusOpen}
        message={message}
        setStatusOpen={setStatusOpen}
        status={status}
      />
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
        value && (<VersionsState address={value}
          current={current}
          isLoading={isLoading}
          pkInfos={pkInfos}
          setMessage={setMessage}
          setStatus={setStatus}
          setStatusOpen={setStatusOpen}
        >
        </VersionsState>)
      }

    </div>
  );
}

export default React.memo(VersionQuery);
