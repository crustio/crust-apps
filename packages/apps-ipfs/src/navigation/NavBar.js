// [object Object]
// SPDX-License-Identifier: Apache-2.0
// Styles
import './NavBar.css';

import classnames from 'classnames';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import StrokeCube from '../icons/StrokeCube';
import StrokeIpld from '../icons/StrokeIpld';
import StrokeMarketing from '../icons/StrokeMarketing';
import StrokeSettings from '../icons/StrokeSettings';
import StrokeWeb from '../icons/StrokeWeb';
import ipfsLogoTextHoriz from './ipfs-logo-text-horiz.svg';
import ipfsLogoTextVert from './ipfs-logo-text-vert.svg';

const NavLink = ({ alternative,
  children,
  disabled,
  icon,
  to }) => {
  const Svg = icon;
  const { hash } = window.location;
  const href = `#${to}`;
  const active = alternative
    ? hash === href || hash.startsWith(`${href}${alternative}`)
    : hash && hash.startsWith(href);
  const anchorClass = classnames({
    'bg-white-10 navbar-item-active': active,
    'o-50 no-pointer-events': disabled
  }, ['navbar-item dib db-l pt2 pb3 pv1-l white no-underline f5 hover-bg-white-10 tc bb bw2 bw0-l b--navy']);
  const svgClass = classnames({
    'o-100': active,
    'o-50': !active
  }, ['fill-current-color']);

  return (
    // eslint-disable-next-line
    <a className={anchorClass}
      href={disabled ? null : href}
      role='menuitem'
      title={children}>
      <div className='db ph2 pv1'>
        <div className='db'>
          <Svg className={svgClass}
            role='presentation'
            width='46' />
        </div>
        <div className={`${active ? 'o-100' : 'o-50'} db f6 tc montserrat ttu fw1 `}
          style={{ whiteSpace: 'pre-wrap' }}>
          {children}
        </div>
      </div>
    </a>
  );
};

export const NavBar = ({ t }) => {
  const codeUrl = 'https://github.com/ipfs-shipyard/ipfs-webui';
  const bugsUrl = `${codeUrl}/issues`;
  const gitRevision = process.env.REACT_APP_GIT_REV;
  const revisionUrl = `${codeUrl}/commit/${gitRevision}`;
  const webUiVersion = process.env.REACT_APP_VERSION;
  const webUiVersionUrl = `${codeUrl}/releases/tag/v${webUiVersion}`;

  return (
    <div className='h-100 fixed-l flex flex-column justify-between'
      style={{ overflowY: 'auto', width: 'inherit' }}>
      <div className='flex flex-column'>
        <a href='#/storage/welcome'
          role='menuitem'
          title={t('welcome:description')}>
          <div className='pt3 pb1 pb2-l'>
            <img alt=''
              className='navbar-logo-vert center db-l dn pt3 pb1'
              src={ipfsLogoTextVert}
              style={{ height: 94 }} />
            <img alt=''
              className='navbar-logo-horiz center db dn-l'
              src={ipfsLogoTextHoriz}
              style={{ height: 70 }} />
          </div>
        </a>
        <div className='db overflow-x-scroll overflow-x-hidden-l nowrap tc'
          role='menubar'>
          <NavLink alternative='status'
            icon={StrokeMarketing}
            to='/storage'>{t('status:title')}</NavLink>
          <NavLink icon={StrokeWeb}
            to='/storage/files'>{t('files:title')}</NavLink>
          <NavLink icon={StrokeIpld}
            to='/storage/explore'>{t('explore:tabName')}</NavLink>
          <NavLink icon={StrokeCube}
            to='/storage/peers'>{t('peers:title')}</NavLink>
          <NavLink icon={StrokeSettings}
            to='/storage/settings'>{t('settings:title')}</NavLink>
        </div>
      </div>
      <div className='dn db-l navbar-footer mb2 tc center f7 o-80 glow'>
        { webUiVersion && <div className='mb1'>
          <a className='link white'
            href={webUiVersionUrl}
            rel='noopener noreferrer'
            target='_blank'>{t('app:terms.ui')} v{webUiVersion}</a>
        </div> }
        { gitRevision && <div className='mb1'>
          <a className='link white'
            href={revisionUrl}
            rel='noreferrer'
            target='_blank'>{t('app:nav.revision')} {gitRevision}</a>
        </div> }
        <div className='mb1'>
          <a className='link white'
            href={codeUrl}
            rel='noopener noreferrer'
            target='_blank'>{t('app:nav.codeLink')}</a>
        </div>
        <div>
          <a className='link white'
            href={bugsUrl}
            rel='noopener noreferrer'
            target='_blank'>{t('app:nav.bugsLink')}</a>
        </div>
      </div>
    </div>
  );
};

export default connect(
  withTranslation()(NavBar)
);
