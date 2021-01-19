// [object Object]
// SPDX-License-Identifier: Apache-2.0

import isIPFS from 'is-ipfs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../components/button/Button';

const WatchListInput = ({ doAddOrder, onAddWatchItem, onFilterWatchList, watchedCidList }) => {
  const [path, setPath] = useState('');
  const [pathValid, toggleValid] = useState(false);
  const [inputClass, setInputClass] = useState('focus-outline');
  const [isPathWatched, toggleWatched] = useState(undefined);
  const watchedCidListStr = watchedCidList.join('-');

  useEffect(() => {
    toggleWatched(undefined);

    if (!path) {
      setInputClass('focus-outline');
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
      placeholder='QmHash/bafyHash'
      style={{ borderRadius: '3px 0 0 3px' }}
      type='text'
      value={path} />
    <Button className='input-btn'
      disabled={isPathWatched || isPathWatched === undefined}
      onClick={() => {
        doAddOrder({ fileCid: path });
      }}>+&nbsp;添加</Button>
  </div>;
};

WatchListInput.propTypes = {
  onFilterWatchList: PropTypes.func.isRequired,
  onAddWatchItem: PropTypes.func.isRequired
};

export default connect('selectWatchedCidList', 'doAddOrder', WatchListInput);
