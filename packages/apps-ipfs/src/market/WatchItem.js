// [object Object]
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */
import classnames from 'classnames';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Cid from '@polkadot/apps-ipfs/components/cid/Cid';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';

import Icon from '../../../react-components/src/Icon';
import { useApi, useCall } from '../../../react-hooks/src';
import Checkbox from '../components/checkbox/Checkbox';

const fileStatusEnum = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRE: 'EXPIRE'
};

const WatchItem = ({peerId,  doFindProvs, doUpdateWatchItem, onSelect, onToggleBtn, selected, watchItem }) => {
  const { api, isApiReady } = useApi();
  const { t } = useTranslation('order');
  const [spin, setSpin] = useState(false);
  const checkBoxCls = classnames({
    'o-1': selected
  }, ['pl2 w2']);
  const fileStatus = useCall(isApiReady && api.query?.market && api.query?.market.files, [watchItem.fileCid]);
  let bestNumber = useCall(isApiReady && api.derive.chain.bestNumber);
  const trash1 = useCall(isApiReady && api.query?.market.transh1, [watchItem.fileCid]);
  const trash2 = useCall(isApiReady && api.query?.market.transh2, [watchItem.fileCid]);

  bestNumber = bestNumber && JSON.parse(JSON.stringify(bestNumber));
  let status = fileStatusEnum.PENDING;

  if (fileStatus) {
    const _fileStatus = JSON.parse(JSON.stringify(fileStatus));

    if (_fileStatus && Array.isArray(_fileStatus)) {
      const { amount,
        claimed_at,
        expired_on,
        file_size,
        replicas } = _fileStatus[0];

      watchItem.expireTime = expired_on;
      watchItem.startTime = expired_on ? expired_on - 216000 : '-';
      watchItem.fileSize = file_size;
      watchItem.confirmedReplicas = replicas ? replicas.length : '-'

      if (expired_on < bestNumber || (trash1 && trash2)) {
        // expired
        status = fileStatusEnum.EXPIRE;
      }

      if (expired_on > bestNumber && replicas.length < 1) {
        // pending
        status = fileStatusEnum.PENDING;
      }

      if (expired_on && replicas.length > 0) {
        // success
        status = fileStatusEnum.SUCCESS;
      }
    } else {
      if (!trash1 && !trash2) {
        // failed
        status = fileStatusEnum.FAILED;
      }
    }
  }

  watchItem.fileStatus = status;
  const readableSize = watchItem.fileSize ? filesize(watchItem.fileSize, { round: 2 }) : '-';

  const syncStatus = async () => {
    if (spin) {
      return;
    }

    try {
      setSpin(true);
      const globalReplicas = await doFindProvs(watchItem.fileCid, peerId);

      setSpin(false);
      doUpdateWatchItem(watchItem.fileCid, { globalReplicas });
    } catch (e) {
      setSpin(false);
    }
  };

  const buttonTextEnm = {

    PENDING: 'speed',
    SUCCESS: 'renew',
    FAILED: 'retry',
    EXPIRE: 'renew'

  };

  return <div
    className={'File b--light-gray relative  flex items-center bt'}
    style={{ overflow: 'hidden', height: 40 }}>
    <div className='justify-center tc flex justify-center items-center flex-grow-1 ph2 pv1 w-5'>
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
        <CopyToClipboard text={watchItem.fileCid}>
          <StrokeCopy className='fill-aqua'
            style={{ width: 18 }} />
        </CopyToClipboard>
      </div>
    </div>
    <div className='relative tc pointer  justify-center flex items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {readableSize}
      </div>
    </div>

    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.startTime || '-'}
      </div>
    </div>
    <div className='relative tc pointer flex  justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.expireTime || '-'}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.confirmedReplicas}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {watchItem.globalReplicas}
        <Icon className={`fill-teal-muted refresh-icon ${spin ? 'spin' : ''}`}
          icon='sync'
          onClick={syncStatus} />
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-10'>
      <div className=''>
        {t(`status.${watchItem.fileStatus}`)}
      </div>
    </div>
    <div className='relative tc pointer flex justify-center items-center flex-grow-1 ph2 pv1 w-20'>
      <div className=''
        title='action'>
        <button className={'watch-item-btn'}
          onClick={() => {
            onToggleBtn(buttonTextEnm[watchItem.fileStatus], watchItem);
          }}>{t(`actions.${buttonTextEnm[watchItem.fileStatus]}`)}</button>
      </div>
    </div>
  </div>;
};

WatchItem.prototype = {
  peerId: PropTypes.string.isRequired,
  watchItem: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.boolean,
  onToggleBtn: PropTypes.func.onToggleBtn
};

export default connect('doFindProvs', 'doUpdateWatchItem', WatchItem);
