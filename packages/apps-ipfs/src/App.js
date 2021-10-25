// Copyright 2017-2021 @polkadot/apps-ipfs authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getNavHelper } from 'internal-nav-helper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// React DnD
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import { connect } from 'redux-bundler-react';

import Connected from './components/connected/Connected';
import Notify from './components/notify/Notify';
import FilesExploreForm from './files/explore-form/FilesExploreForm';
import { getJoyrideLocales } from './helpers/i8n';
import { normalizeFiles } from './lib/files';
// Lib
import { appTour } from './lib/tours';
// Components
import ComponentLoader from './loader/ComponentLoader';

export class App extends Component {
  static propTypes = {
    doTryInitIpfs: PropTypes.func.isRequired,
    doUpdateUrl: PropTypes.func.isRequired,
    doUpdateHash: PropTypes.func.isRequired,
    doFilesWrite: PropTypes.func.isRequired,
    route: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element
    ]).isRequired,
    routeInfo: PropTypes.object.isRequired,
    // Injected by DropTarget
    isOver: PropTypes.bool.isRequired
  }

  //
  componentDidMount () {
    this.props.doTryInitIpfs();
  }

  //
  addFiles = async (filesPromise) => {
    const { doFilesWrite, doUpdateHash, routeInfo } = this.props;
    const isFilesPage = routeInfo.pattern === '/storage/files*';
    const addAtPath = isFilesPage ? routeInfo.params.path : '/';
    const files = await filesPromise;

    doFilesWrite(normalizeFiles(files), addAtPath);

    // Change to the files pages if the user is not there
    if (!isFilesPage) {
      doUpdateHash('/storage/files');
    }
  }

  handleJoyrideCb = (data) => {
    if (data.action === 'close') {
      this.props.doDisableTooltip();
    }
  }

  //
  render () {
    const { theme, canDrop, connectDropTarget, doExploreUserProvidedPath, doFilesNavigateTo, ipfsReady, isOver, route: Page, routeInfo: { url }, showTooltip, t } = this.props;

    return connectDropTarget(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div className={`sans-serif h-100 ${theme}`}
        onClick={getNavHelper(this.props.doUpdateUrl)}>
        {/* Tinted overlay that appears when dragging and dropping an item */}
        { canDrop && isOver && <div className='w-100 h-100 top-0 left-0 absolute'
          style={{ background: 'rgba(99, 202, 210, 0.2)' }} /> }
        <div className='flex flex-row-reverse-l flex-column-reverse justify-end justify-start-l'
          style={{ minHeight: '100vh' }}>
          <div className='flex-auto-l'>
            <main className='bg-white pv3 pa3'>
              { (ipfsReady ||
                url === '/storage/welcome' ||
                url.startsWith('/storage/settings') ||
                url.startsWith('/storage/market') ||
                url === '/storage' ||
                url === '/storage_files') ||
                url.startsWith('/storage_files/status')
                ? <Page />
                : <ComponentLoader pastDelay />
              }
            </main>
          </div>

        </div>

        <ReactJoyride
          callback={this.handleJoyrideCb}
          disableOverlay
          locale={getJoyrideLocales(t)}
          run={showTooltip}
          scrollToFirstStep
          steps={appTour.getSteps({ t })}
          styles={appTour.styles}
        />

        <Notify />
      </div>
    );
  }
}

const dropTarget = {
  drop: (props, monitor, App) => {
    if (monitor.didDrop()) {
      return;
    }

    const { filesPromise } = monitor.getItem();

    App.addFiles(filesPromise);
  },
  canDrop: (props) => props.filesPathInfo ? props.filesPathInfo.isMfs : true
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

export const AppWithDropTarget = DropTarget(NativeTypes.FILE, dropTarget, dropCollect)(App);

export default connect(
  'selectRoute',
  'selectRouteInfo',
  'selectIpfsReady',
  'selectShowTooltip',
  'doFilesNavigateTo',
  'doExploreUserProvidedPath',
  'doUpdateUrl',
  'doUpdateHash',
  'doTryInitIpfs',
  'doFilesWrite',
  'doDisableTooltip',
  'selectFilesPathInfo',
  withTranslation('app')(AppWithDropTarget)
);
