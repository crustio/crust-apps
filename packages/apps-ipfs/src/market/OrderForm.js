// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import isIPFS from 'is-ipfs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@polkadot/apps-ipfs/components/button/Button';
import StrokeFolder from '@polkadot/apps-ipfs/icons/StrokeFolder';
import StrokeIpld from '@polkadot/apps-ipfs/icons/StrokeIpld';

const OrderList = () => {
  const [path, setPath] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [inputClass, setInputClass] = useState('focus-outline');
  const { t } = useTranslation('order');

  useEffect(() => {
    setIsValid(path !== '' && (isIPFS.cid(path) || isIPFS.path(path)));
  }, [path]);
  useEffect(() => {
    if (isValid) {
      setInputClass('b--green-muted focus-outline-green');
    } else {
      setInputClass('b--green-muted focus-outline-green');
    }
  }, [isValid]);

  const onChange = (evt) => {
    const _path = evt.target.value;

    setPath(_path);
  };

  const onSearch = () => {
    console.log(path);
  };

  return <div className='sans-serif black-80 flex'>
    <div className='flex-auto'>
      <div className='relative'>
        <input aria-describedby='ipfs-path-desc'
          className={`input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light ${inputClass}`}
          id='ipfs-path'
          onChange={onChange}
          placeholder='QmHash/bafyHash'
          style={{ borderRadius: '3px 0 0 3px' }}
          type='text'
          value={path} />
        <small className='o-0 absolute f6 black-60 db mb2'
          id='ipfs-path-desc'>Paste in a CID or IPFS path</small>
      </div>
    </div>
    <div className='flex flex-row-reverse mb2'>
      <Button
        bg='bg-teal'
        className='ExploreFormButton button-reset pv1 ph2 ba f7 fw4 white overflow-hidden tc'
        disabled={!isValid}
        minWidth={0}
        onClick={onSearch}
        style={{ borderRadius: '0 3px 3px 0' }}
        title={t('actions.add')} >
        <StrokeIpld className='dib fill-current-color v-mid'
          style={{ height: 24 }} />
        <span className='ml2'>{t('actions.add')}</span>
      </Button>
      <Button
        bg='bg-teal'
        className='ExploreFormButton button-reset pv1 ph2 ba f7 fw4 white overflow-hidden tc'
        disabled={!isValid}
        minWidth={0}
        onClick={onSearch}
        style={{ borderRadius: '0 3px 3px 0' }}
        title={t('actions.search')} >
        <StrokeIpld className='dib fill-current-color v-mid'
          style={{ height: 24 }} />
        <span className='ml2'>{t('actions.search')}</span>
      </Button>
    </div>
  </div>;
};

export default OrderList;
