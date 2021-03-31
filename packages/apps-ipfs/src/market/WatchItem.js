// [object Object]
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */
// @ts-ignore
import classnames from 'classnames';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import dayjs from 'dayjs';

import Cid from '@polkadot/apps-ipfs/components/cid/Cid';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';

import { useApi, useCall } from '../../../react-hooks/src';
import Checkbox from '../components/checkbox/Checkbox';
import CopyButton from '@polkadot/apps-ipfs/components/copy-button';

import Popup from 'reactjs-popup';
import { formatBalance } from '@polkadot/util';
import GlyphRenew from '@polkadot/apps-ipfs/icons/GlyphRenew';
import GlyphPrepaid from '@polkadot/apps-ipfs/icons/GlyphPrepaid';
import GlyphSpeedup from '@polkadot/apps-ipfs/icons/GlyphSpeedup';
import GlyphRetry from '@polkadot/apps-ipfs/icons/GlyphRetry';
import BN from 'bn.js';

const fileStatusEnum = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRE: 'EXPIRE'
};

const WatchItem = ({onAddPool, isEdit, onSelect, startEdit, confirmEdit, onToggleBtn, selected, watchItem }) => {
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
  const basePrice = api.consts.market.fileBaseFee || 0
  const taxRatio = api.consts.market.taxRatio || 0
  const stakingRatio = api.consts.market.stakingRatio || 0
  const ratio = ((1 - Number(stakingRatio.toString())/1000000000) * (1- Number(taxRatio.toString())/1000000000))
  if (fileStatus) {
    const _fileStatus = JSON.parse(JSON.stringify(fileStatus));

    if (_fileStatus && Array.isArray(_fileStatus)) {
      const { amount,
        claimed_at,
        expired_on,
        file_size,
        replicas,
        prepaid,
        reported_replica_count } = _fileStatus[0];
      watchItem.expireTime = expired_on;
      watchItem.amount = amount;
      watchItem.startTime = expired_on ? expired_on - 216000 : 0;
      watchItem.fileSize = file_size;
      watchItem.confirmedReplicas = reported_replica_count
      watchItem.prepaid = prepaid
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
        watchItem.confirmedReplicas = 0;
        watchItem.amount = 0;
        watchItem.prepaid = 0
      }
    }
  }

  watchItem.fileStatus = status;
  const readableSize = watchItem.fileSize ? filesize(watchItem.fileSize, { round: 2 }) : '-';
  const calculateExpiredTime = (expireBlock) => {
    const durations = (expireBlock - bestNumber) * 6
    return dayjs().add(durations, 'seconds').format('YYYY-MM-DD')
  }

  const buttonTextEnm = {

    PENDING: 'speed',
    SUCCESS: 'renew',
    FAILED: 'retry',
    EXPIRE: 'renew'

  };
  const handleClick = () => {
    window.open(t('tips.wikiAddress'), '_blank')
  }

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

    <div className='relative tc flex  justify-center items-center  ph2 pv1 w-20'>
      <div className=''>
        {/*(expireTime - bestNumber) / 6*/}
        {watchItem.expireTime  ? <span>{watchItem.expireTime} / {calculateExpiredTime(watchItem.expireTime)} </span> : '-'}
      </div>
    </div>
    <div className='relative tc flex justify-center items-center  ph2 pv1 w-10'>
      {watchItem.confirmedReplicas || '-'}
    </div>
    <div className='relative tc pointer flex justify-center items-center  ph2 pv1 w-10'>{
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
                 *The order "pending" time generally lasts from 30 minutes to 2 hours (depending on the file size). Please keep IPFS running during this period.<br/>
* If your order is "pending" for too long, you can refer to <span className={'aqua pointer'} onClick={handleClick}>WIKI</span> for detailed solutions.
            </div>
          </Trans>

  </Popup>
      :
      <div style={{textTransform: 'capitalize'}}>{t(`status.${watchItem.fileStatus}`)}</div>
    }</div>
    <div className='relative tr flex justify-center items-center  ph2 pv1 w-15'>
      <span className='dib tc' style={{minWidth:"50%"}}>{watchItem.amount ? formatBalance(new BN(watchItem.amount.toString() || 0).divn(ratio), { decimals: 12, forceUnit: 'CRU' }).replace('CRU', '') : '-'}</span>
      <Popup
        trigger={<span className="self-end" onClick={() => {
          onToggleBtn(buttonTextEnm[watchItem.fileStatus], watchItem)
        }}>
        {
          watchItem.fileStatus === fileStatusEnum.PENDING && <GlyphSpeedup className={'custom-icon' +
          ' custom-icon-color pointer'}/>
        }
          {
            (watchItem.fileStatus === fileStatusEnum.SUCCESS || watchItem.fileStatus === fileStatusEnum.EXPIRE) && <GlyphRenew className={'custom-icon' +
            ' custom-icon-color pointer'}/>
          }
          {
            watchItem.fileStatus === fileStatusEnum.FAILED && <GlyphRetry className={'custom-icon' +
            ' custom-icon-color pointer'}/>
          }
      </span>}
        on={['hover', 'focus']}
        position="right center"
        closeOnDocumentClick
      >
          <span>{t(`actions.${buttonTextEnm[watchItem.fileStatus]}`)}</span>
        </Popup>
    </div>
    <div className='relative tr flex justify-center items-center  ph2 pv1 w-15'>
      <span  className='dib tc' style={{minWidth:"50%"}}>{formatBalance(watchItem.prepaid, { decimals: 12, forceUnit: 'CRU' }).replace('CRU', '')|| '-'}</span>
      <span>
          <Popup
            trigger={<span><GlyphPrepaid  onClick={() => {
              onAddPool(watchItem)
            }} className={'custom-icon custom-icon-color pointer'}/></span>}
            on={['hover', 'focus']}
            position="right center"
            closeOnDocumentClick
          >
          <span>{t('Add Balance', 'Add Balance')}</span>
        </Popup>
      </span>
    </div>
  </div>;
};

WatchItem.prototype = {
  watchItem: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  onToggleBtn: PropTypes.func.isRequired,
  onAddPool: PropTypes.func.isRequired,
};

export default connect(WatchItem);
