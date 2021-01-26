// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Box from '../box/Box';

const ipfsDesktopMacZh = 'https://crust-data.oss-cn-shanghai.aliyuncs.com/ipfs/Crust%20IPFS%20Desktop-0.13.2.dmg';
const ipfsDesktopWinZh = 'https://crust-data.oss-cn-shanghai.aliyuncs.com/ipfs/Crust%20IPFS%20Desktop%20Setup%200.13.2.exe'
// todo: wait ipfs desktop github address
const ipfsDesktopMac = 'https://crust-data.oss-cn-shanghai.aliyuncs.com/ipfs/Crust%20IPFS%20Desktop-0.13.2.dmg';
const ipfsDesktopWin = 'https://crust-data.oss-cn-shanghai.aliyuncs.com/ipfs/Crust%20IPFS%20Desktop%20Setup%200.13.2.exe';

const IsNotConnected = ({ t }) => {
  const { i18n } = useTranslation();

  return (
    <Box className='pv3 ph4 lh-copy charcoal' style={{background: '#fff'}}>
      <div className='flex flex-wrap items-center'>
        <div className='fw4 charcoal ma0 f3'
          style={{ textTransform: 'none', padding: '10px', color: '#ff8812', fontSize: 16, lineHeight: '28px' }}>{t('app:status.couldNotConnect')} <br/>{t('app:status.couldNotConnect1')}</div>
      </div>
      <br/>
      <br/>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;&gt; {t('app:status.desktop')} <a className={'link'}
          href={i18n.language === 'zh' ? ipfsDesktopMacZh : ipfsDesktopMac }
          rel='noopener noreferrer' >MacOS</a>
        <br/>
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;&gt; {t('app:status.desktop')} <a className={'link'}
          href={i18n.language === 'zh' ? ipfsDesktopWinZh : ipfsDesktopWin }
          rel='noopener noreferrer'
          target='_blank'>Windows</a>
      </div>
      <br/>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* {t('app:status.info')}
      </div>
    </Box>
  );
};

export default connect(
  'selectIpfsConnected',
  'selectApiUrl',
  withTranslation('welcome')(IsNotConnected)
);
