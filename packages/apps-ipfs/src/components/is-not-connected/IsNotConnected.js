// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { withTranslation, Trans } from 'react-i18next';
import classNames from 'classnames';
import ApiAddressForm from '../api-address-form/ApiAddressForm';
import Box from '../box/Box';
import Shell from '../shell/Shell.js';
import GlyphTip from '../../icons/GlyphTip';

const TABS = {
  UNIX: 'unix',
  POWERSHELL: 'windowsPS',
  WINDOWS: 'windowsCMD'
};

const IsNotConnected = ({ apiUrl, connected, doUpdateIpfsApiAddress, ipfsApiAddress, sameOrigin, t }) => {
  const [activeTab, setActiveTab] = useState(TABS.UNIX);
  const defaultDomains = ['http://localhost:3000', 'http://127.0.0.1:5001', 'https://webui.ipfs.io'];
  const origin = window.location.origin;
  const addOrigin = defaultDomains.indexOf(origin) === -1;

  return (
    <Box className='pv3 ph4 lh-copy charcoal'>
      <div className='flex flex-wrap items-center'>
        <GlyphTip className='fill-red mr'
          style={{ height: 30 }} />
        <h1 className='montserrat fw4 charcoal ma0 f3 red'
          style={{ textTransform: 'none', paddingLeft: '10px' }}>{t('app:status.couldNotConnect')}</h1>
      </div>
      <ol className='pl3 pt2'>
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
    </Box>
  );
};

export default connect(
  'selectIpfsConnected',
  'selectApiUrl',
  withTranslation('welcome')(IsNotConnected)
);
