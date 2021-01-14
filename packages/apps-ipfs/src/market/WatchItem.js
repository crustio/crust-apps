// [object Object]
// SPDX-License-Identifier: Apache-2.0
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const WatchItem = ({ watchItem }) => {
  const { t } = useTranslation('order');
  // const checkBoxCls = classnames({
  //   'o-70 glow': !cantSelect,
  //   'o-1': selected || focused
  // }, ['pl2 w2']);

  return <div
    className={'File b--light-gray relative  flex items-center bt'}
    // onContextMenu={handleCtxRightClick}
    style={{ height: 55, overflow: 'hidden' }}>
    {/* <div className={checkBoxCls}> */}
    {/* <Checkbox aria-label={ t('checkboxLabel', { name })} */}
    {/*   checked={selected} */}
    {/*   disabled={cantSelect} */}
    {/*   onChange={select} /> */}
    {/* </div> */}
    <div className='relative tc pointer  justify-center flex items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''>
        {watchItem.fileCID}
      </div>
    </div>
    <div className='relative tc pointer  justify-center flex items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''>
        {watchItem.fileSize}
      </div>
    </div>

    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''>
        {watchItem.startTime}
      </div>
    </div>
    <div className='relative tc pointer flex  justify-center items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''>
        {watchItem.expireTime}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''>
        {watchItem.pinsCount}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''>
        {watchItem.fileStatus}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-40'>
      <div className=''
        title='action'>
        <button>操作</button>
      </div>
    </div>
  </div>;
};

WatchItem.prototype = {
  watchItem: PropTypes.array.isRequired
};

export default WatchItem;
