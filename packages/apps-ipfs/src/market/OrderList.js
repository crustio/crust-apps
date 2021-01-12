// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import WatchItem from '@polkadot/apps-ipfs/market/WatchItem';

const OrderList = () => {
  const { t } = useTranslation();

  const [watchList, setWatchList] = useState([{
    fileCID: '123',
    fileSize: '123121',
    startTime: '12312',
    expireTime: '1221',
    fileStatus: 1,
    pinsCount: 2
  }, {
    fileCID: '123',
    startTime: '2121',
    fileSize: '123121',
    expireTime: '121',
    fileStatus: 1,
    pinsCount: 2
  }, {
    fileCID: '123',
    startTime: '2112',
    fileSize: '123121',
    expireTime: '2121',
    fileStatus: 1,
    pinsCount: 2
  }, {
    fileCID: '123',
    startTime: '1212',
    fileSize: '123121',
    fileStatus: 1,
    expireTime: '2112',
    pinsCount: 2
  }]);
  const itemList = ['fileSize', 'startTime', 'expireTime', 'pinsCount', 'fileStatus'];

  return <div>
    <header
      className='gray pv3 flex items-center flex-none'
      style={{ paddingRight: '1px', paddingLeft: '1px' }}
    >
      {/* <div className={checkBoxCls}> */}
      {/*  <Checkbox aria-label={t('selectAllEntries')} */}
      {/*    checked={allSelected} */}
      {/*    onChange={this.toggleAll} /> */}
      {/* </div> */}
      <div className='ph2 pv1 flex-auto db-l tc'>
        {t('order:fileCID')}
      </div>
      {
        itemList.map((item) => (<div className='ph2 pv1 flex-auto db-l tc'
          key={item}>
          <button aria-label={t('sortBy', { name: t(`order:${item}`) })}
            onClick={() => {
              console.log(123);
            }}>
            {t(`order:${item}`)}
          </button>
        </div>))
      }
      <div className='ph2 pv1 flex-auto db-l tc'>
        {t('order:action')}
      </div>
      <div className='pa2'
        style={{ width: '2.5rem' }} />
    </header>
    <WindowScroller>
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
                }}
                scrollTop={scrollTop}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
      )}
    </WindowScroller></div>;
};

export default OrderList;
