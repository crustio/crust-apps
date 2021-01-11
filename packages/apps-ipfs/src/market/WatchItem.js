// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

const WatchItem = ({ watchItem }) => {
  const { t } = useTranslation('order');
  // const checkBoxCls = classnames({
  //   'o-70 glow': !cantSelect,
  //   'o-1': selected || focused
  // }, ['pl2 w2']);

  return <div
    // onContextMenu={handleCtxRightClick}
    style={{ height: 55, overflow: 'hidden' }}>
    {/* <div className={checkBoxCls}> */}
    {/* <Checkbox aria-label={ t('checkboxLabel', { name })} */}
    {/*   checked={selected} */}
    {/*   disabled={cantSelect} */}
    {/*   onChange={select} /> */}
    {/* </div> */}
    <div className='ph2 pv1 flex-none dn db-l tr mw3'>
      <div className='bg-snow br-100 o-70'>
        {watchItem.hash}
      </div>
    </div>

    <div className='ph2 pv1 flex-none dn db-l tr mw3'>
      <div className='bg-snow br-100 o-70'>
        {watchItem.startTime}
      </div>
    </div>
    <div className='ph2 pv1 flex-none dn db-l tr mw3'>
      <div className='bg-snow br-100 o-70'>
        {watchItem.expireTime}
      </div>
    </div>
    <div className='ph2 pv1 flex-none dn db-l tr mw3'>
      <div className='bg-snow br-100 o-70'>
        {watchItem.pins}
      </div>
    </div>
  </div>;
};

WatchItem.prototype = {
  watchItem: PropTypes.array.isRequired
};

export default WatchItem;
