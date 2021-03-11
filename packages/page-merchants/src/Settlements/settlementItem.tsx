// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react/index';

import Cid from '@polkadot/apps-ipfs/components/cid/Cid';
import CopyButton from '@polkadot/apps-ipfs/components/copy-button';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';
import { headersList, ISettlementItem } from '@polkadot/apps-merchants/Settlements/settlementList';

interface Props {
  settlementItem:ISettlementItem
}

const SettlementItem:React.FC<Props> = ({ settlementItem }) => {
  return <div className={'File b--light-gray relative  flex items-center bt'}>
    {
      headersList.map((item) => {
        return <div className={`relative tc justify-center flex items-center  ph2 pv1 w-${item.width}`}>
          {
            item.name === 'cid' &&
            <Cid value={settlementItem.cid} />
          }
        </div>;
      })
    }
  </div>;
};

export default SettlementItem;
