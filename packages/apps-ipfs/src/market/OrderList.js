// [object Object]
// SPDX-License-Identifier: Apache-2.0
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { connect } from 'redux-bundler-react';

import WatchItem from '@polkadot/apps-ipfs/market/WatchItem';

import Checkbox from '../components/checkbox/Checkbox';

const OrderList = ({ watchList, watchedCidList }) => {
  const { t } = useTranslation();
  const itemList = ['fileSize', 'startTime', 'expireTime', 'pinsCount', 'fileStatus'];
  const [selectedList, setSelected] = useState([]);
  const tableHeight = 300;
  const tableRef = useRef(null);

  const toggleOne = (fileCid) => {
    const index = selectedList.indexOf(fileCid);

    if (index < 0) {
      selectedList.push(fileCid);
      setSelected(selectedList);
    } else {
      selectedList.splice(selectedList.indexOf(fileCid), 1);
    }

    setSelected(selectedList);
    tableRef.current.forceUpdateGrid();
  };

  const toggleAll = () => {
    const isSelected = isAllSelected();

    console.log(isSelected);

    if (isSelected) {
      setSelected([]);
    } else {
      setSelected(watchedCidList);
    }
  };

  const isAllSelected = () => {
    if (_.isEqual(watchedCidList, selectedList)) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <header className='gray pv3 flex items-center flex-none'
        style={{ paddingRight: '1px', paddingLeft: '1px' }}>
        <div className='ph2 pv1 flex-auto db-l tc w-5'>
          <Checkbox aria-label={t('selectAllEntries')}
            checked={isAllSelected()}
            onChange={toggleAll}/>
        </div>
        <div className='ph2 pv1 flex-auto db-l tc w-20'>{t('order:fileCid')}</div>
        {itemList.map((item) => (
          <div className='ph2 pv1 flex-auto db-l tc w-10'
            key={item}>
            <button
              aria-label={t('sortBy', { name: t(`order:${item}`) })}
              onClick={() => {
                console.log(123);
              }}
            >
              {t(`order:${item}`)}
            </button>
          </div>
        ))}
        <div className='ph2 pv1 flex-auto db-l tc w-20'>{t('order:action')}</div>
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
                  onScroll={onChildScroll}
                  // noRowsRenderer={this.emptyRowsRenderer}
                  // onRowsRendered={this.onRowsRendered}
                  ref={tableRef}
                  rowCount={watchList.length}
                  rowHeight={40}
                  rowRenderer={({ index, key, style }) => {
                    return <WatchItem onSelect={toggleOne}
                      selected={selectedList.indexOf(watchList[index].fileCid) > -1}
                      watchItem={watchList[index]} />;
                  }}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          </div>
        )}
      </WindowScroller>
    </div>
  );
};

export default connect('selectWatchedCidList', OrderList);
