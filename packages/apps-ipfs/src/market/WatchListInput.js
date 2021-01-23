// [object Object]
// SPDX-License-Identifier: Apache-2.0

import isIPFS from 'is-ipfs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useApi, useCall } from '../../../react-hooks/src';
import Button from '../components/button/Button';

const WatchListInput = ({ doAddOrder, doRemoveWatchItems, onFilterWatchList, selectedCidList, t, watchedCidList }) => {
  const { api, isApiReady } = useApi();
  const [path, setPath] = useState('');
  const [pathValid, toggleValid] = useState(true);
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
      toggleValid(true);
      setInputClass('b--green-muted focus-outline-green');
      onFilterWatchList(path);

      if (watchedCidListStr.indexOf(path) > -1) {
        toggleWatched(true);
      } else {
        toggleWatched(false);
      }
    } else {
      toggleValid(false);
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
      placeholder='fileCid'
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
      !fileStatus || fileStatus === 'null'
        ? <p className='file-info'>
          {t('fileValid')}
        </p>
        : ''
    }
  </div>;
};

WatchListInput.propTypes = {
  onFilterWatchList: PropTypes.func.isRequired
};

export default connect('selectWatchedCidList', 'doAddOrder', 'doRemoveWatchItems', 'selectSelectedCidList', withTranslation('order')(WatchListInput));
