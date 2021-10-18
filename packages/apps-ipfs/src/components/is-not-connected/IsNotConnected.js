// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { Trans, useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import classNames from 'classnames';
import React, { useState } from 'react';
import ApiAddressForm from '../api-address-form/ApiAddressForm';
import Box from '../box/Box';
import Shell from '../shell/Shell.js';
import Icon from '../../../../react-components/src/Icon';

const ipfsDesktopMacZh = 'https://ipfs-desktop-1257135774.cos.ap-shanghai.myqcloud.com/IPFS-Desktop.dmg';
const ipfsDesktopWinZh = 'https://ipfs-desktop-1257135774.cos.ap-shanghai.myqcloud.com/IPFS-Desktop-Setup.exe'
const ipfsDesktopWin32Zh = 'https://ipfs-desktop-1257135774.cos.ap-shanghai.myqcloud.com/IPFS-Desktop-Setup-win32.exe'
const ipfsDesktopMac = 'https://github.com/decooio/ipfs-desktop/releases/latest/download/IPFS-Desktop.dmg';
const ipfsDesktopWin = 'https://github.com/decooio/ipfs-desktop/releases/latest/download/IPFS-Desktop-Setup.exe';
const ipfsDesktopWin32 = 'https://github.com/decooio/ipfs-desktop/releases/latest/download/IPFS-Desktop-Setup-win32.exe';

const IsNotConnected = ({ apiUrl, connected, doUpdateIpfsApiAddress, ipfsApiAddress, sameOrigin, t } ) => {
  const TABS = {
    UNIX: 'unix',
    POWERSHELL: 'windowsPS',
    WINDOWS: 'windowsCMD'
  };
  const [showDesc, toggleDesc] = useState(false)

  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(TABS.UNIX);
  const defaultDomains = ['http://localhost:3000', 'http://127.0.0.1:5001', 'https://webui.ipfs.io'];
  const origin = window.location.origin;
  const addOrigin = defaultDomains.indexOf(origin) === -1;

  return (
    <Box className='pv3 ph4 lh-copy charcoal' style={{background: '#fff'}}>
      <div className='items-center' style={{marginBottom: '10'}}>
        <div className='fw4 charcoal ma0 f3 navy'
          style={{ textTransform: 'none', fontSize: 20, lineHeight: '48px' }}>{t('app:status.couldNotConnect')}      </div>
      </div>
      <div style={{ textTransform: 'none', padding: '2 0', fontSize: 14, lineHeight: '28px' }}>
          {t('app:status.couldNotConnect1')}
        </div>
      <div style={{ textTransform: 'none', padding: '2 0', fontSize: 14, lineHeight: '28px' }}>
          {t('app:status.couldNotConnect2')}
        </div>
      <br/>
      <br/>

      <div style={{paddingLeft: 10}}>
        <div >
        &gt;&gt; {t('app:status.desktop')} <a className={'link'}
                                              href={i18n.language === 'zh' ? ipfsDesktopMacZh : ipfsDesktopMac }
                                              rel='noopener noreferrer' >MacOS</a>
        <br/>
        <br/>
          &gt;&gt; {t('app:status.desktop')} <a className={'link'}
                                                href={i18n.language === 'zh' ? ipfsDesktopWinZh : ipfsDesktopWin }
                                                rel='noopener noreferrer'
                                                target='_blank'>Windows64</a>&nbsp;&nbsp;

           <a className={'link'}
                                                href={i18n.language === 'zh' ? ipfsDesktopWin32Zh : ipfsDesktopWin32 }
                                                rel='noopener noreferrer'
                                                target='_blank'>Windows32</a>
      </div>
      <br/>
      <div>
        * {t('app:status.info')}
        <span onClick={() => {
          toggleDesc(!showDesc)
        }} className='link blu pointer' style={{paddingLeft: 5}}>
          <Icon  icon={showDesc ? 'caret-up' :'caret-down'}/>
          {showDesc ? t('app:fold'): t('app:unfold')}
        </span>
        {
          showDesc && <ol className='pl3 pt2'>
        <Trans i18nKey='notConnected.paragraph1'
               t={t}>
          <li className='mb3'>
              Make sure you have IPFS installed. If not, check out the installation guide:
            <a className='link blue'
               href='https://docs.ipfs.io/install/ipfs-desktop/'
               rel='noopener noreferrer'
               target='_blank'>IPFS desktop</a>
            or
            <a className='link blue'
               href='https://docs.ipfs.io/how-to/command-line-quick-start/'
               rel='noopener noreferrer'
               target='_blank'>IPFS Command Line</a>
          </li>
        </Trans>

            { !sameOrigin && (
              <div>
            <Trans i18nKey='notConnected.paragraph2'
                   t={t}>
              <li className='mb3 mt4'>Make sure your IPFS daemon or IPFS desktop is running. To launch IPFS daemon, run following command: </li>
            </Trans>
            <Shell title='Any Shell'>
              <code className='db'><b className='no-select'>$ </b>ipfs daemon</code>
              <code className='db'>Initializing daemon...</code>
              <code className='db'>API server listening on /ip4/127.0.0.1/tcp/5001</code>
            </Shell>
            <Trans i18nKey='notConnected.paragraph3'
                   t={t}>
              <li className='mb3 mt4'>Make sure you have configured to allow <a className='link blue'
                                                                                href='https://github.com/ipfs-shipyard/ipfs-webui#configure-ipfs-api-cors-headers'>cross-origin (CORS) requests</a>?  If not, run following commands and then restart IPFS daemon or IPFS desktop:</li>
            </Trans>
            <div className='br1 overflow-hidden'>
              <div className='f7 mb0 sans-serif charcoal pv1 pl2 bg-black-20 flex items-center overflow-x-auto'>
                <button className={classNames('pointer mr3 ttu tracked', activeTab === TABS.UNIX && 'fw7')}
                        onClick={() => setActiveTab(TABS.UNIX)}>
                Unix & MacOS
                </button>
                <button className={classNames('pointer mr3 ttu tracked', activeTab === TABS.POWERSHELL && 'fw7')}
                        onClick={() => setActiveTab(TABS.POWERSHELL)}>
                  Windows Powershell
                </button>
                <button className={classNames('pointer ttu tracked', activeTab === TABS.WINDOWS && 'fw7')}
                        onClick={() => setActiveTab(TABS.WINDOWS)}>
                  Windows CMD
                </button>
              </div>
              <div className='bg-black-70 snow pa2 f7 lh-copy monospace nowrap overflow-x-auto'>
                { activeTab === TABS.UNIX && (
                  <div>
                    <code className='db'><b className='no-select'>$ </b>ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[{addOrigin && `"${origin}", `}"{defaultDomains.join('", "')}"]'</code>
                    <code className='db'><b className='no-select'>$ </b>ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'</code>
                  </div>
                )}
                { activeTab === TABS.POWERSHELL && (
                  <div>
                    <code className='db'><b className='no-select'>$ </b>ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[{addOrigin && `\\"${origin}\\", `}\"{defaultDomains.join('\\", \\"')}\"]'</code>
                    <code className='db'><b className='no-select'>$ </b>ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"POST\"]'</code>
                  </div>
                )}
                { activeTab === TABS.WINDOWS && (
                  <div>
                    <code className='db'><b className='no-select'>$ </b>ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[{addOrigin && `"""${origin}""", `}"""{defaultDomains.join('""", """')}"""]"</code>
                    <code className='db'><b className='no-select'>$ </b>ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "["""PUT""", """POST"""]"</code>
                  </div>
                )}
              </div>
            </div>
          </div>
            )}
            <Trans i18nKey='notConnected.paragraph4'
                   t={t}>
          <li className='mt4 mb3'>Make sure you have not changed the default  <a className='link blue'
                                                                                 href='https://github.com/ipfs/go-ipfs/blob/master/docs/config.md#addresses'
                                                                                 rel='noopener noreferrer'
                                                                                 target='_blank'>IPFS API port</a>, otherwise you need to enter the customized API port here:</li>
        </Trans>
        <ApiAddressForm
          defaultValue={ipfsApiAddress || ''}
          t={t}
          updateAddress={doUpdateIpfsApiAddress} />
      </ol>
        }

      </div>
      </div>
    </Box>
  );
};

export default connect(
  'selectIpfsConnected',
  'selectApiUrl',
  withTranslation('welcome')(IsNotConnected)
);
