// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { Trans, withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import { connect } from 'redux-bundler-react';

import Connected from '@polkadot/apps-ipfs/components/connected/Connected';
import FilesExploreForm from '@polkadot/apps-ipfs/files/explore-form/FilesExploreForm';
import OrderModal from '@polkadot/apps-ipfs/files/modals/order-modal';

import withTour from '../components/tour/withTour';
import { getJoyrideLocales } from '../helpers/i8n';
// Lib
import { filesTour } from '../lib/tours';
// Components
import ContextMenu from './context-menu/ContextMenu';
import FileImportStatus from './file-import-status/FileImportStatus';
import FilePreview from './file-preview/FilePreview';
import FilesList from './files-list/FilesList';
import Header from './header/Header';
import InfoBoxes from './info-boxes/InfoBoxes';
// Icons
import Modals, { ADD_BY_PATH, CLI_TUTOR_MODE, DELETE, NEW_FOLDER, RENAME, SHARE } from './modals/Modals';
import downloadFile from './download-file';

const defaultState = {
  downloadAbort: null,
  downloadProgress: null,
  orderModal: {
    show: false,
    file: null
  },
  modals: {
    show: null,
    files: null
  },
  contextMenu: {
    isOpen: false,
    translateX: 0,
    translateY: 0,
    file: null
  }
};

class FilesPage extends React.Component {
  constructor (props) {
    super(props);
    this.contextMenuRef = React.createRef();
  }

  state = defaultState

  componentDidMount () {
    this.props.doFilesFetch();

    this.props.doPinsFetch();
    this.props.doContractsFetch();
    this.props.doFilesSizeGet();
  }

  componentDidUpdate (prev) {
    const { filesPathInfo } = this.props;

    if (prev.files === null || !prev.ipfsConnected || filesPathInfo.path !== prev.filesPathInfo.path) {
      this.props.doFilesFetch();
    }
  }

  onDownload = async (files) => {
    const { doFilesDownloadLink } = this.props;
    const { downloadAbort, downloadProgress } = this.state;

    if (downloadProgress !== null) {
      downloadAbort();

      return;
    }

    const updater = (v) => this.setState({ downloadProgress: v });
    const { filename, method, url } = await doFilesDownloadLink(files);
    const { abort } = await downloadFile(url, filename, updater, method);

    this.setState({ downloadAbort: abort });
  }

  showOrderModal = () => {
    const {contextMenu} = this.state
    const file = contextMenu.file
    const isPined = file && file.pinned
    // check file is pined or not
    if (!isPined) {
      this.props.doFilesPin(file.cid)
    }
    this.setState({ orderModal: { show: true, file:{comment: file.name, ...file} } });
  }

  onAddFiles = (raw, root = '') => {
    if (root === '') {
      root = this.props.files.path;
    }

    this.props.doFilesWrite(raw, root);
  }

  onAddByPath = (path) => {
    this.props.doFilesAddPath(this.props.files.path, path);
  }

  onInspect = (cid) => {
    this.props.doUpdateHash(`/storage/explore/ipfs/${cid}`);
  }

  showModal = (modal, files = null) => {
    this.setState({ modals: { show: modal, files: files } });
  }

  hideModal = () => {
    this.setState({ modals: { } });
  }

  handleContextMenu = (ev, clickType, file, pos) => {
    // This is needed to disable the native OS right-click menu
    // and deal with the clicking on the ContextMenu options
    if (ev !== undefined && typeof ev !== 'string') {
      ev.preventDefault();
      ev.persist();
    }

    const ctxMenu = findDOMNode(this.contextMenuRef.current);
    const ctxMenuPosition = ctxMenu.getBoundingClientRect();

    let translateX = 0;
    let translateY = 0;

    switch (clickType) {
      case 'RIGHT': {
        const rightPadding = window.innerWidth - ctxMenu.parentNode.getBoundingClientRect().right;

        translateX = (window.innerWidth - ev.clientX) - rightPadding - 20;
        translateY = (ctxMenuPosition.y + ctxMenuPosition.height / 2) - ev.clientY - 10;
        break;
      }

      case 'TOP': {
        const pagePositions = ctxMenu.parentNode.getBoundingClientRect();

        translateX = pagePositions.right - pos.right;
        translateY = -(pos.bottom - pagePositions.top + 11);
        break;
      }

      default: {
        translateX = 1;
        translateY = (ctxMenuPosition.y + ctxMenuPosition.height / 2) - (pos && pos.y) - 30;
      }
    }

    this.setState({
      contextMenu: {
        isOpen: !this.state.contextMenu.isOpen,
        translateX,
        translateY,
        file
      }
    });
  }

  get mainView () {
    const { doExploreUserProvidedPath, files, t } = this.props;

    if (!files) {
      return (<div/>);
    }

    if (files.type === 'unknown') {
      const path = files.path.startsWith('/pins')
        ? files.path.slice(6)
        : files.path;

      return (
        <div>
          <Trans i18nKey='cidNotFileNorDir'
            t={t}>
            The current link isn't a file, nor a directory. Try to <button className='link blue pointer'
              onClick={() => doExploreUserProvidedPath(path)}>inspect</button> it instead.
          </Trans>
        </div>
      );
    }

    if (files.type === 'file') {
      return (
        <FilePreview {...files}
          onDownload={() => this.onDownload([files])} />
      );
    }

    return (
      <FilesList
        downloadProgress={this.state.downloadProgress}
        files={files.content}
        handleContextMenuClick={this.handleContextMenu}
        key={window.encodeURIComponent(files.path)}
        onAddFiles={this.onAddFiles}
        onDelete={(files) => this.showModal(DELETE, files)}
        onDownload={this.onDownload}
        onInspect={this.onInspect}
        onMove={this.props.doFilesMove}
        onNavigate={this.props.doFilesNavigateTo}
        onRename={(files) => this.showModal(RENAME, files)}
        onShare={(files) => this.showModal(SHARE, files)}
        root={files.path}
        updateSorting={this.props.doFilesUpdateSorting}
        upperDir={files.upper} />
    );
  }

  get title () {
    const { filesPathInfo, t } = this.props;
    const parts = [];

    if (filesPathInfo) {
      parts.push(filesPathInfo.realPath);
    }

    if (filesPathInfo.isMfs) {
      parts.push(t('app:terms.files'));
    } else if (filesPathInfo.isPins) {
      parts.push(t('app:terms.pins'));
    }

    parts.push('IPFS');

    return parts.join(' | ');
  }

  closeOrderModal () {
    this.setState({
      orderModal: {
        show: false,
        file: null
      }
    });
  }

  render () {
    const { cliOptions, doExploreUserProvidedPath, doFilesNavigateTo, doSetCliOptions, files, filesPathInfo, handleJoyrideCallback,
      isCliTutorModeEnabled,
      t, toursEnabled } = this.props;

    const { contextMenu } = this.state;

    return (
      <div className='center'
        data-id='FilesPage'>
        <div className='flex items-center ph3 ph4-l'
          style={{ WebkitAppRegion: 'drag', height: 75, background: '#F0F6FA', paddingTop: '20px', paddingBottom: '15px' }}>
          <div className='joyride-app-explore'
            style={{ width: 560 }}>
            <FilesExploreForm onBrowse={doFilesNavigateTo}
              onInspect={doExploreUserProvidedPath} />
          </div>
          <div className='dn flex-ns flex-auto items-center justify-end'>
            {/* <TourHelper /> */}
            <Connected className='joyride-app-status' />
          </div>
        </div>
        <ContextMenu
          autofocus
          cid={contextMenu.file && contextMenu.file.cid}
          doSetCliOptions={doSetCliOptions}
          file={contextMenu.file}
          handleClick={this.handleContextMenu}
          isCliTutorModeEnabled={isCliTutorModeEnabled}
          isMfs={filesPathInfo ? filesPathInfo.isMfs : false}
          isOpen={contextMenu.isOpen}
          isUnknown={!!(contextMenu.file && contextMenu.file.type === 'unknown')}
          onCliTutorMode={() => this.showModal(CLI_TUTOR_MODE, [contextMenu.file])}
          onDelete={() => this.showModal(DELETE, [contextMenu.file])}
          onDownload={() => this.onDownload([contextMenu.file])}
          onInspect={() => this.onInspect(contextMenu.file.cid)}
          onOrder={this.showOrderModal}
          onPin={() => this.props.doFilesPin(contextMenu.file.cid)}
          onRename={() => this.showModal(RENAME, [contextMenu.file])}
          onShare={() => this.showModal(SHARE, [contextMenu.file])}
          onUnpin={() => this.props.doFilesUnpin(contextMenu.file.cid)}
          pinned={contextMenu.file && contextMenu.file.pinned}
          ref={this.contextMenuRef}
          translateX={contextMenu.translateX}
          translateY={contextMenu.translateY}
        />

        <Header
          files={files}
          handleContextMenu={(...args) => this.handleContextMenu(...args, true)}
          onAddByPath={(files) => this.showModal(ADD_BY_PATH, files)}
          onAddFiles={this.onAddFiles}
          onCliTutorMode={() => this.showModal(CLI_TUTOR_MODE)}
          onMove={this.props.doFilesMove}
          onNavigate={this.props.doFilesNavigateTo}
          onNewFolder={(files) => this.showModal(NEW_FOLDER, files)} />

        { this.mainView }

        <InfoBoxes filesExist={!!(files && files.content && files.content.length)}
          isCompanion={this.props.ipfsProvider === 'window.ipfs'}
          isRoot={filesPathInfo && filesPathInfo.isMfs && filesPathInfo.isRoot} />

        <Modals
          cliOptions={cliOptions}
          done={this.hideModal}
          onAddByPath={this.onAddByPath}
          onDelete={this.props.doFilesDelete}
          onMakeDir={this.props.doFilesMakeDir}
          onMove={this.props.doFilesMove}
          onShareLink={this.props.doFilesShareLink}
          root={files ? files.path : null}
          { ...this.state.modals } />
        {
          this.state.orderModal.show && <OrderModal file={this.state.orderModal.file}
            onChange={() => {
              console.log('change');
            }}
            onClose={() => {
              this.closeOrderModal();
            }}/>
        }

        <FileImportStatus />

        <ReactJoyride
          callback={handleJoyrideCallback}
          continuous
          locale={getJoyrideLocales(t)}
          run={toursEnabled}
          scrollToFirstStep
          showProgress
          steps={filesTour.getSteps({ t, Trans })}
          styles={filesTour.styles} />
      </div>
    );
  }
}

FilesPage.propTypes = {
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired,
  ipfsConnected: PropTypes.bool,
  ipfsProvider: PropTypes.string,
  files: PropTypes.object,
  filesPathInfo: PropTypes.object,
  doUpdateHash: PropTypes.func.isRequired,
  doPinsFetch: PropTypes.func.isRequired,
  doContractsFetch: PropTypes.func.isRequired,
  doFilesFetch: PropTypes.func.isRequired,
  doFilesMove: PropTypes.func.isRequired,
  doFilesMakeDir: PropTypes.func.isRequired,
  doFilesShareLink: PropTypes.func.isRequired,
  doFilesDelete: PropTypes.func.isRequired,
  doFilesAddPath: PropTypes.func.isRequired,
  doFilesNavigateTo: PropTypes.func.isRequired,
  doFilesPin: PropTypes.func.isRequired,
  doFilesUnpin: PropTypes.func.isRequired,
  doFilesUpdateSorting: PropTypes.func.isRequired,
  doFilesWrite: PropTypes.func.isRequired,
  doFilesDownloadLink: PropTypes.func.isRequired
};

export default connect(
  'selectIpfsProvider',
  'selectIpfsConnected',
  'selectFiles',
  'selectFilesPathInfo',
  'doUpdateHash',
  'doPinsFetch',
  'doContractsFetch',
  'doFilesFetch',
  'doFilesMove',
  'doFilesMakeDir',
  'doFilesShareLink',
  'doFilesDelete',
  'doFilesAddPath',
  'doFilesNavigateTo',
  'doFilesPin',
  'doFilesUnpin',
  'doFilesUpdateSorting',
  'selectFilesSorting',
  'selectToursEnabled',
  'doFilesWrite',
  'doFilesDownloadLink',
  'doExploreUserProvidedPath',
  'doFilesSizeGet',
  'selectIsCliTutorModeEnabled',
  'selectIsCliTutorModalOpen',
  'doOpenCliTutorModal',
  'doSetCliOptions',
  'selectCliOptions',
  withTour(withTranslation('files')(FilesPage))
);
