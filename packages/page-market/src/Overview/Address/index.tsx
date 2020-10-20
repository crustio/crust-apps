// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ValidatorInfo } from '../../types';

import React, { useEffect, useMemo, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressSmall } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatCapacity } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';

import Favorite from './Favorite';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  isFavorite: boolean;
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity: boolean;
}

interface WorkReport extends Codec {
  block_number: 'u64',
  used: 'u64',
  reserved: 'u64',
  cached_reserved: 'u64',
  files: 'Vec<(Vec<u8>, u64)>'
}

interface MerchantInfo extends Codec {
  address: 'Vec<u8>',
  storage_price: 'Balance',
  file_map: 'Vec<(Vec<u8>, Vec<Hash>)>'
}

interface CapacityInfo {
  free: BN,
  used: BN
}

function useAddressCalls (api: ApiPromise, address: string) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, params);

  const workReport = useCall<Option<WorkReport>>(api.query.swork.workReports, params);
  const merchantInfo = useCall<Option<MerchantInfo>>(api.query.market.merchants, params);

  return { accountInfo, workReport, merchantInfo };
}

async function loadMerchantInfo(api: ApiPromise, accountId: string) {

  let free = new BN(0);
  let used = new BN(0);
  const idBonds = (await (await api.query.swork.idBonds(accountId)).toHuman());
  if (Array.isArray(idBonds)) {
    for (const pk of idBonds) {
      const workReports = JSON.parse(JSON.stringify(await api.query.swork.workReports(pk?.toString())));
      free = free.add(new BN(workReports?.free));
      used = used.add(new BN(workReports?.used));
    }
  }

  return { free, used };
}

function Address ({ address, className = '', filterName, isFavorite, toggleFavorite, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, merchantInfo } = useAddressCalls(api, address);
  const [ orderCount, setOrderCount ] = useState<Number>(0);
  const [ info, setInfo ] = useState<CapacityInfo>();

  useEffect(() => {
    let count = 0;
    const fm = merchantInfo?.unwrap().file_map
    if (fm && fm.length) {
      for (const map of fm) {
        count += map[1].length;
      }
    }
    setOrderCount(count);

  }, [merchantInfo])

  useEffect(() => {
    loadMerchantInfo(api, address).then(setInfo);
  }, [api])

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number media--1100'>
        {info && (
          <FormatCapacity value={info.free.add(info.used)} />
        )}
      </td>
      <td className='number media--1100'>
        {merchantInfo && (
          formatBalance(merchantInfo.unwrap().storage_price)
        )}
      </td>
      <td className='number'>
        {orderCount}
      </td>
      <td className='links media--1200'>

      </td>
    </tr>
  );
}

export default React.memo(Address);
