// [object Object]
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line header/header
import _ from 'lodash';
import propTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { connect } from 'redux-bundler-react';
import { StatusContext } from '../../../react-components/src';
import WatchItem from '@polkadot/apps-ipfs/market/WatchItem';

import Checkbox from '../components/checkbox/Checkbox';
const itemList = [{
  name: 'fileSize',
  width: 10,
},
  {
    name: 'note',
    width: 20,
  },
  {
    name: 'expireTime',
    width: 15,
  },
  {
    name: 'confirmedReplicas',
    width: 10,
  },
  {
    name: 'fileStatus',
    width: 15,
  }];

const OrderList = ({ identity, ipfsReady, doUpdateWatchItem, doSelectedItems, onToggleBtn, selectedCidList, t, watchList, watchedCidList }) => {
  const [listSorting, setListSorting] = useState({ by: 'expireTime', asc: false });
  const [sortedList, setSortedList] = useState(watchList)
  const [editItem, setEditItem] = useState(undefined)

  const tableRef = useRef(null);

  useEffect (() => {
    setSortedList(watchList)
  }, [JSON.stringify(watchList)]);

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
      return <span style={{ color: '#ff8812', fontSize: 18, fontWeight: 700 }}>{listSorting.asc ? ' ↑' : ' ↓'}</span>;
    }

    return null;
  };

  const changeSort = (order) => {
    if (order === listSorting.by) {
      setListSorting({ by: order, asc: !listSorting.asc });
    } else {
      setListSorting({ by: order, asc: true });
    }
    const _list = _.orderBy(sortedList, [listSorting.by], [listSorting.asc ? 'asc' : 'desc'])
    setSortedList(_list)
    tableRef.current.forceUpdateGrid();
  };
  const nodata =() => {
    return <div className={'nodata'}>
    </div>
  }

  return (
    <div>
      <header className='gray pv3 flex items-center flex-none'
        style={{ paddingRight: '1px', paddingLeft: '1px' }}>
        <div className='ph2 pv1 flex-auto db-l tc w-5'>
          <Checkbox aria-label={t('selectAllEntries')}
            checked={isAllSelected()}
            onChange={toggleAll}/>
        </div>
        <div className='ph2 pv1 flex-auto db-l tc w-15 watch-list-header'>
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
          <div className={`ph2 pv1 flex-auto db-l  w-${item.width} watch-list-header tc`}
            key={item.name}>
            <button
              aria-label={t('sortBy', { name: t(`${item.name}`) })}
              onClick={() => {
                if (item.name === 'note') {
                  return
                }
                changeSort(item.name);
              }}
            >
              {t(`actions.${item.name}`)}{sortByIcon(item.name)}
            </button>
          </div>
        ))}
        <div className='ph2 pv1 flex-auto db-l tc w-10 watch-list-header'>{t('actions.action')}</div>
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
                  data={sortedList /* NOTE: this is a placebo prop to force the list to re-render */}
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  noRowsRenderer={nodata}
                  // onRowsRendered={this.onRowsRendered}
                  ref={tableRef}
                  rowCount={sortedList.length}
                  rowHeight={50}
                  rowRenderer={({ index, key }) => {
                    return <WatchItem
                      tableRef={tableRef}
                      key={key}
                      onSelect={toggleOne}
                      peerId={identity ? identity.id :''}
                      onToggleBtn={(type, file) => {
                        onToggleBtn(type, file);
                      }}
                      onEdit={() => {

                      }}
                      isEdit={editItem === sortedList[index].fileCid}
                      startEdit={() => {
                        setEditItem(sortedList[index].fileCid)
                      }}
                      confirmEdit={(comment) => {
                        //
                        setEditItem(undefined)
                        doUpdateWatchItem(sortedList[index].fileCid, {...sortedList[index], comment})
                      }}
                      selected={selectedCidList.indexOf(sortedList[index].fileCid) > -1}
                      watchItem={sortedList[index]} />;
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
  doSelectedItems: propTypes.func,
  selectSelectedCidList: propTypes.array,
  doUpdateWatchItem: propTypes.func
};

export default connect('selectWatchedCidList', 'selectIpfsReady', 'doRemoveWatchItems', 'selectIdentity', 'doFetchWatchList', 'doSelectedItems', 'selectSelectedCidList', 'doUpdateWatchItem', withTranslation('order')(OrderList));
