// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const StorageMarket = ({ children, ...props }) => {
  const { i18n } = useTranslation();

  return <div className='w-60 center'>
    <img alt=''
      src={`/images/market${i18n.language === 'zh' ? '_zh' : ''}.png`}
      style={{ width: '100%' }}/>
  </div>;
};

export default StorageMarket;
