// [object Object]
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */
// @ts-ignore
import classnames from 'classnames';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Cid from '@polkadot/apps-ipfs/components/cid/Cid';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';

import { useApi, useCall } from '../../../react-hooks/src';
import Checkbox from '../components/checkbox/Checkbox';
import CopyButton from '@polkadot/apps-ipfs/components/copy-button';
import { Icon } from '../../../react-components/src';

import Popup from 'reactjs-popup';
import Pen from '@polkadot/apps-ipfs/icons/Pen';

const fileStatusEnum = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRE: 'EXPIRE'
};
const Comment = ({ isEdit, comment, startEdit, confirmEdit }) => {
  const [value, setValue] = useState(comment)
  return <div style={{width: "100%", overflow: 'hidden'}}>
    {isEdit ?
      <div style={{textAlign:'left', display:'flex', justifyContent: 'left', alignItems: 'center', overflow: 'hidden'}}>
        <Pen className={'custom-icon'}/>
        &nbsp;
        <input style={{display: 'inline-block', width: '80%'}} className={'no-border'} autoFocus type="text" value={value} onBlur={() => {
        confirmEdit(value)
      }} onChange={(e) => {
        setValue(e.target.value)
      }}/></div> :
      <div style={{textAlign:'left', display:'flex', overflow: 'hidden', alignItems: 'center'}} className={'pointer'} onClick={() => {
        startEdit()
      }}>
        <Pen className={`custom-icon ${value ? '' : 'gray-fill'}`}/>
        &nbsp;&nbsp;
        <span style={{display:'inline-block', width: '80%'}}>{value || '请添加备注'}</span>
      </div>}
  </div>
}
const WatchItem = ({ ipfsConnected, tableRef, isEdit, onSelect, startEdit, confirmEdit, doUpdateWatchItem, onToggleBtn, selected, watchItem }) => {
  const { api, isApiReady } = useApi();
  const { t } = useTranslation('order');
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
        replicas,
        reported_replica_count } = _fileStatus[0];

      watchItem.expireTime = expired_on;
      watchItem.startTime = expired_on ? expired_on - 216000 : 0;
      watchItem.fileSize = file_size;
      watchItem.confirmedReplicas = reported_replica_count

      if (expired_on && expired_on < bestNumber || (trash1 && trash2)) {
        // expired
        status = fileStatusEnum.EXPIRE;
      }

      if (!expired_on && expired_on > bestNumber && reported_replica_count < 1) {
        // pending
        status = fileStatusEnum.PENDING;
      }

      if (expired_on && expired_on > bestNumber && reported_replica_count > 0) {
        // success
        status = fileStatusEnum.SUCCESS;
      }
    } else {
      if (!trash1 && !trash2) {
        // failed
        status = fileStatusEnum.FAILED;
        watchItem.expireTime = 0;
        watchItem.status = status;
        watchItem.startTime = 0;
        watchItem.fileSize = 0;
        watchItem.confirmedReplicas = 0
      }
    }
  }

  watchItem.fileStatus = status;
  const readableSize = watchItem.fileSize ? filesize(watchItem.fileSize, { round: 2 }) : '-';

  const buttonTextEnm = {

    PENDING: 'speed',
    SUCCESS: 'renew',
    FAILED: 'retry',
    EXPIRE: 'renew'

  };

  return <div
    className={'File b--light-gray relative  flex items-center bt'}
    style={{ overflow: 'hidden', height: 40 }}>
    <div className='justify-center tc flex justify-center items-center  ph2 pv1 w-5'>
      <Checkbox aria-label={ t('checkboxLabel', { name })}
        checked={selected}
        className={checkBoxCls}
        onChange={() => {
          onSelect(watchItem.fileCid);
        }}/>
    </div>
    <div className='relative tc pointer  justify-center flex items-center  ph2 pv1 w-15'>
      <div className=''>
        <Cid value={watchItem.fileCid} />
        <CopyButton text={watchItem.fileCid} message={t('fileCidCopied')}>
          <StrokeCopy className='fill-aqua' style={{ width: 18 }} />
        </CopyButton>
      </div>
    </div>
    <div className='relative tc   justify-center flex items-center  ph2 pv1 w-10'>
      <div className=''>
        {readableSize  || '-'}
      </div>
    </div>

    <div className='relative tc  flex justify-center items-center  ph2 pv1 w-15'>
      <Comment isEdit={isEdit} startEdit={startEdit} confirmEdit={confirmEdit} comment={watchItem.comment}/>
    </div>
    <div className='relative tc flex  justify-center items-center  ph2 pv1 w-15'>
      <div className=''>
        {watchItem.expireTime || '-'}
      </div>
    </div>
    <div className='relative tc flex justify-center items-center  ph2 pv1 w-10'>
      {watchItem.confirmedReplicas || '-'}
    </div>
    <div className='relative tc pointer flex justify-center items-center  ph2 pv1 w-15'>{
      watchItem.fileStatus === fileStatusEnum.PENDING ?
        <Popup
          className="my-popup"
          trigger={<abbr title='' style={{textTransform: 'capitalize'}}>{t(`status.${watchItem.fileStatus}`)}</abbr>}
          position={['top left']}
          closeOnDocumentClick
          on={['hover', 'focus']}
        >
     <Trans i18nKey="tips.tip1" t={t}>
            <div>
                  * If your order is "Pending" more than 30 mins, you can check whether the local IPFS is closed, or try to turn-off your firewall, please refer to  <span className={'aqua pointer'} onClick={() => {
                    window.open('https://wiki.crust.network/en', '_blank')
                  }}>WIKI</span> for detailed solutions.
            </div>
          </Trans>

  </Popup>
      :
      <div style={{textTransform: 'capitalize'}}>{t(`status.${watchItem.fileStatus}`)}</div>
    }</div>
    <div className='relative tc  flex justify-center items-center  ph2 pv1 w-15'>
      {
        !ipfsConnected && watchItem.fileStatus !== fileStatusEnum.SUCCESS ?
          <Popup position={['top right']} on={['hover', 'focus']} className={'my-popup'} contentStyle={{width: 'auto'}} trigger={
            <button className={'watch-item-btn'}
                    style={{  backgroundColor: "#d9dbe2", cursor: "not-allowed", color: "#eef"}}
            >{t(`actions.${buttonTextEnm[watchItem.fileStatus]}`)}</button>}>
          <div>{t('tips.tip2')} </div>
        </Popup> : <button className={'watch-item-btn'}
                           onClick={() => {
                             onToggleBtn(buttonTextEnm[watchItem.fileStatus], watchItem);
                           }}>{t(`actions.${buttonTextEnm[watchItem.fileStatus]}`)}</button>
      }
    </div>
  </div>;
};

WatchItem.prototype = {
  peerId: PropTypes.string.isRequired,
  watchItem: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  onToggleBtn: PropTypes.func.isRequired,
  ipfsConnected: PropTypes.bool.isRequired
};

export default connect('selectIpfsConnected', WatchItem);
