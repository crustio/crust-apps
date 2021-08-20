// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import queryString from 'query-string';
import React, { useCallback, useEffect } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { Input, Toggle } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isString } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  nameFilter: string;
  setNameFilter: (value: string, isQuery: boolean) => void;
  setWithCollateral: (value: boolean) => void;
  withCollateral: boolean;
}

function Filtering ({ children, className, nameFilter, setNameFilter, setWithCollateral, withCollateral }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  // on load, parse the query string and extract the filter
  useEffect((): void => {
    const queryFilter = queryString.parse(location.href.split('?')[1]).filter;

    if (isString(queryFilter)) {
      setNameFilter(queryFilter, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _setNameFilter = useCallback(
    (value: string) => setNameFilter(value, false),
    [setNameFilter]
  );

  return (
    <div className={className}>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name, address or index')}
        onChange={_setNameFilter}
        value={nameFilter}
      />
      <div className='market--filter--optionsBar'>
        {children}
        {api.query.identity && (
          <Toggle
            className='market--filter--buttonToggle'
            label={t<string>('Only accounts with collateral')}
            onChange={setWithCollateral}
            value={withCollateral}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(Filtering);
