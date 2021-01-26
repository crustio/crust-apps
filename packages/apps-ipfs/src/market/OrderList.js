// [object Object]
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line header/header
import _ from 'lodash';
import propTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { connect } from 'redux-bundler-react';

import WatchItem from '@polkadot/apps-ipfs/market/WatchItem';

import Checkbox from '../components/checkbox/Checkbox';

const OrderList = ({ doFetchWatchList, doSelectedItems, onToggleBtn, selectedCidList, t, watchList, watchedCidList }) => {
  const [listSorting, setListSorting] = useState({ by: null, asc: true });
  const itemList = ['fileSize', 'startTime', 'expireTime', 'pinsCount', 'fileStatus'];
  const tableRef = useRef(null);

  useEffect(() => {
    setListSorting({ by: 'startTime', asc: false });
  }, []);

  const toggleOne = (fileCid) => {
    const index = selectedCidList.indexOf(fileCid);

    if (index < 0) {
      selectedCidList.push(fileCid);
    } else {
      selectedCidList.splice(selectedCidList.indexOf(fileCid), 1);
    }

    doSelectedItems(selectedCidList);
    tableRef.current.forceUpdateGrid();
  };

  const toggleAll = () => {
    const isSelected = isAllSelected();

    if (isSelected) {
      doSelectedItems([]);
    } else {
      doSelectedItems(watchedCidList);
    }
  };

  const isAllSelected = () => {
    if (!_.isEmpty(watchedCidList) && _.isEqual(watchedCidList, selectedCidList)) {
      return true;
    }

    return false;
  };

  const sortByIcon = (order) => {
    if (listSorting.by === order) {
      return <span style={{ color: '#ff8812', fontSize: 13 }}>{listSorting.asc ? '↑' : '↓'}</span>;
    }

    return null;
  };

  useEffect(() => {
    const _list = _.orderBy(watchList, [listSorting.by], [listSorting.asc ? 'asc' : 'desc']);

    doFetchWatchList(_list);
    tableRef.current.forceUpdateGrid();
  }, [listSorting]);

  const changeSort = (order) => {
    if (order === listSorting.by) {
      setListSorting({ by: order, asc: !listSorting.asc });
    } else {
      setListSorting({ by: order, asc: true });
    }
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
        <div className='ph2 pv1 flex-auto db-l tc w-20 watch-list-header'>
          <button
            aria-label={t('sortBy', { name: t('fileCid') })}
            onClick={() => {
              changeSort('fileCid');
            }}
          >
            {t('actions.fileCid')}{sortByIcon('fileCid')}
          </button>
        </div>
        {itemList.map((item) => (
          <div className='ph2 pv1 flex-auto db-l tc w-10 watch-list-header'
            key={item}>
            <button
              aria-label={t('sortBy', { name: t(`${item}`) })}
              onClick={() => {
                changeSort(item);
              }}
            >
              {t(`actions.${item}`)}{sortByIcon(item)}
            </button>
          </div>
        ))}
        <div className='ph2 pv1 flex-auto db-l tc w-20 watch-list-header'>{t('actions.action')}</div>
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
                  rowHeight={50}
                  rowRenderer={({ index, key }) => {
                    return <WatchItem key={key} onSelect={toggleOne}
                      onToggleBtn={(type, file) => {
                        onToggleBtn(type, file);
                      }}
                      selected={selectedCidList.indexOf(watchList[index].fileCid) > -1}
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

OrderList.propTypes = {
  selectWatchedCidList: propTypes.array,
  onToggleBtn: propTypes.func.isRequired,
  doRemoveWatchItems: propTypes.func.isRequired,
  doFetchWatchList: propTypes.func,
  doSelectedItems: propTypes.array.isRequired,
  selectSelectedCidList: propTypes.array.isRequired
};

export default connect('selectWatchedCidList', 'doRemoveWatchItems', 'doFetchWatchList', 'doSelectedItems', 'selectSelectedCidList', withTranslation('order')(OrderList));
