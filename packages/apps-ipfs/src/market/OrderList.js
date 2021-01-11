// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import WatchItem from '@polkadot/apps-ipfs/market/WatchItem';

const OrderList = () => {
  const { t } = useTranslation('order');

  const [watchList, setWatchList] = useState([{
    hash: '123',
    startTime: '12312',
    expireTime: '1221',
    pins: 2
  }, {
    hash: '123',
    startTime: '2121',
    expireTime: '121',
    pins: 2
  }, {
    hash: '123',
    startTime: '2112',
    expireTime: '2121',
    pins: 2
  }, {
    hash: '123',
    startTime: '1212',
    expireTime: '2112',
    pins: 2
  }]);

  return <WindowScroller>
    {({ height, isScrolling, onChildScroll, scrollTop }) => (
      <div className='flex-auto'>
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              aria-label={t('filesListLabel')}
              autoHeight
              className='outline-0'
              data={watchList /* NOTE: this is a placebo prop to force the list to re-render */}
              height={height}
              isScrolling={isScrolling}
              // noRowsRenderer={this.emptyRowsRenderer}
              // onRowsRendered={this.onRowsRendered}
              onScroll={onChildScroll}
              // ref={this.listRef}
              rowCount={watchList.length}
              rowHeight={55}
              rowRenderer={({ index, key, style }) => {
                return <WatchItem watchItem={watchList[index]} />;
              }}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    )}
  </WindowScroller>;
};

export default OrderList;
