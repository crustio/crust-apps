// [object Object]
// SPDX-License-Identifier: Apache-2.0
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Cid from '@polkadot/apps-ipfs/components/cid/Cid';

import Icon from '../../../react-components/src/Icon';
import { useApi, useCall } from '../../../react-hooks/src';
import Checkbox from '../components/checkbox/Checkbox';

const WatchItem = ({ onSelect, selected, watchItem }) => {
  const { api, isApiReady } = useApi();
  const { t } = useTranslation('order');
  const checkBoxCls = classnames({
    'o-1': selected
  }, ['pl2 w2']);
  const status = useCall(isApiReady && api.query?.market.files, [watchItem.fileCid]);

  if (status) {
    // todo update items status
    // need to check trash to get correct status
    console.log(JSON.parse(JSON.stringify(status)));
  }

  const syncStatus = () => {
    // todo: get pins count
  };

  return <div
    className={'File b--light-gray relative  flex items-center bt'}
    // onContextMenu={handleCtxRightClick}
    style={{ overflow: 'hidden', height: 40 }}>
    <div className='justify-center tc flex items-center flex-grow-1 ph2 pv1 w-5'>
      <Checkbox aria-label={ t('checkboxLabel', { name })}
        checked={selected}
        className={checkBoxCls}
        onChange={() => {
          onSelect(watchItem.fileCid);
        }}/>
    </div>
    <div className='relative tc pointer  justify-center flex items-center flex-grow-1 ph2 pv1 w-20'>
      <div className=''>
        <Cid value={watchItem.fileCid} />
      </div>
    </div>
    <div className='relative tc pointer  justify-center flex items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.fileSize}
      </div>
    </div>

    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.startTime}
      </div>
    </div>
    <div className='relative tc pointer flex  justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.expireTime}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.pinsCount}
        <Icon className={'fill-teal-muted refresh-icon'}
          icon='sync'
          onClick={syncStatus} />
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.fileStatus}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-20'>
      <div className=''
        title='action'>
        <button>操作</button>
      </div>
    </div>
  </div>;
};

WatchItem.prototype = {
  watchItem: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.boolean
};

export default WatchItem;
