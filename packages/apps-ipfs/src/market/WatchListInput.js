// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import isIPFS from 'is-ipfs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useApi, useCall } from '../../../react-hooks/src';
import Button from '../components/button/Button';

const WatchListInput = ({ doAddOrder, doRemoveWatchItems, onFilterWatchList, selectedCidList, t, watchedCidList, handleFileChange, handleExport, emitFetchModal }) => {
  const { api, isApiReady } = useApi();
  const [path, setPath] = useState('');
  const [inputClass, setInputClass] = useState('focus-outline');
  const [isPathWatched, toggleWatched] = useState(undefined);
  const watchedCidListStr = watchedCidList.join('-');
  const fileStatus = JSON.stringify(useCall(isApiReady && api.query?.market && api.query?.market.files, [path]));

  useEffect(() => {
    toggleWatched(undefined);

    if (!path) {
      setInputClass('focuss-outline');
      onFilterWatchList(null);
    }

    if (path !== '' && (isIPFS.cid(path) || isIPFS.path(path))) {
      setInputClass('b--green-muted focus-outline-green');
      onFilterWatchList(path);

      if (watchedCidListStr.indexOf(path) > -1) {
        toggleWatched(true);
      } else {
        toggleWatched(false);
      }
    } else {
      setInputClass('b--red-muted focus-outline-red');
    }
  }, [path]);

  const onChange = (e) => {
    setPath(e.target.value);
  };

  return <div className='add-watch-list-wrapper'>
    <input aria-describedby='ipfs-path-desc'
      className={`input-reset bn pa2 dib w-30 f6 br-0 placeholder-light ${inputClass}`}
      id='ipfs-path'
      onChange={onChange}
      placeholder='file CID'
      style={{ borderRadius: '3px 0 0 3px' }}
      type='text'
      value={path} />
    <Button className='input-btn'
      disabled={isPathWatched || isPathWatched === undefined || !fileStatus || fileStatus === 'null' }
      onClick={() => {
        doAddOrder({ fileCid: path });
      }}>+&nbsp;{t('actions.add')}</Button>
    <Button className='input-btn input-btn-delete'
      disabled={selectedCidList.length < 1}
      onClick={() => {
        doRemoveWatchItems(selectedCidList);
      }}>{t('actions.delete')}</Button>
    {
      path && (!fileStatus || fileStatus === 'null')
        ? <p className='file-info'>
          {t('fileValid')}
        </p>
        : ''
    }
    <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
      <input type="file" id="upload" size="60" onClick={(e) => {
        e.target.value = null;
      }} style={{ opacity: 0, position: 'absolute', zIndex: -1 }} onChange={handleFileChange}/>
      <label className="btn btn2" htmlFor="upload" style={{ cursor: 'pointer' }}>
        {t('importBtn')}
      </label>
      &nbsp;&nbsp;
      <button className='btn btn2' onClick={_.throttle(() => {
        handleExport();
      }, 2000)
      }>{t('exportBtn')}</button>
      &nbsp;&nbsp;
      <button className='btn btn2' onClick={_.throttle(() => {
        emitFetchModal();
      }, 2000)
      }>{t('Fetch', 'Fetch')}</button>
    </div>
  </div>;
};

WatchListInput.propTypes = {
  onFilterWatchList: PropTypes.func.isRequired
};

export default connect('selectWatchedCidList', 'doAddOrder', 'doRemoveWatchItems', 'selectSelectedCidList', withTranslation('order')(WatchListInput));
