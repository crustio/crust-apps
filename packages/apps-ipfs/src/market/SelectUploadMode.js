// Copyright 2017-2021 @polkadot/apps-ipfs
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Icon } from '@polkadot/react-components';
import { ipfsLogos } from '@polkadot/apps-config';

const MRoot = styled.div`
  max-width: unset !important;
  margin: unset !important;
  padding: unset !important;
  width: 100vw !important;
  min-width: 1000px;
  height: 100%;
  background: #F5F3F1;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  overflow: auto;
`;

const Card = styled.div`
  width: 410px;
  height: 464px;
  background: white;
  box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.1);
  margin: 100px 50px;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;

  .card-icon {
    height: 94px;
    margin-top: 20px;
    object-fit: contain;
    align-content: flex-start;
  }

  .space {
    flex: 1;
  }

  .card-title {
    flex-shrink: 0;
    font-size: 22px;
    font-weight: 500;
    color: #333333;
    line-height: 30px;
  }

  .card-sub {
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 400;
    width: 100%;
    color: #333333;
    line-height: 22px;
    margin-top: 24px;
    margin-bottom: 32px;
  }
`;

function devGuide ({ className }) {
  const { t, i18n } = useTranslation('order');
  const devLink = i18n.language === 'zh-CN' ?
    "https://wiki.crust.network/docs/zh-CN/buildGettingStarted" :
    "https://wiki.crust.network/docs/en/buildGettingStarted"
  return <div
    className={className}
    onClick={() => window.open(devLink, '_blank')}>
    <Icon icon={['far', 'user']}/>
    {t('Developer Guide')}
  </div>;
}

export const DevGuide = styled(devGuide)`
  position: absolute;
  right: 50px;
  bottom: 175px;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  cursor: pointer;
  height: 46px;
  line-height: 46px;
  .ui--Icon {
    margin-right: 10px;
  }
`;

export default function SelectUploadMode (props) {
  const { t } = useTranslation('order');
  return <MRoot>
    <Card>
      <img className='card-icon' src={ipfsLogos.gateway}/>
      <div className='space'/>
      <div className='card-title' style={{ marginTop: 14 }}>{t('Upload files by Gateway')}</div>
      <div className='card-sub'>{t('Gateway_Desc')}</div>
      <button className='btn' style={{ height: '3rem', padding: '5px 40px', flexShrink: 0 }} onClick={() => {
        props.onClick('gateway');
      }}>{t('actions.toUse')}</button>
    </Card>
    <Card>
      <img className='card-icon' src={ipfsLogos.ipfs}/>
      <div className='space'/>
      <div className='card-title'>{t('Upload files by IPFS')}</div>
      <div className='card-sub'>{t('IPFS_Desc')}</div>
      <button className='btn btn2' style={{ height: '3rem', padding: '5px 40px', flexShrink: 0 }} onClick={() => {
        props.onClick('ipfs');
      }}>{t('actions.toUse')}</button>
    </Card>
    <DevGuide/>
  </MRoot>;
}
