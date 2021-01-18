// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { join } from 'path';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getRealPath } from '@polkadot/apps-ipfs/bundles/files/utils';

import { realMfsPath } from '../../bundles/files/actions';
import { cliCmdKeys, cliCommandList } from '../../bundles/files/consts';
import CliTutorMode from '../../components/cli-tutor-mode/CliTutorMode';
import Overlay from '../../components/overlay/Overlay';
import AddByPathModal from './add-by-path-modal/AddByPathModal';
import DeleteModal from './delete-modal/DeleteModal';
// Modals
import NewFolderModal from './new-folder-modal/NewFolderModal';
import RenameModal from './rename-modal/RenameModal';
import ShareModal from './share-modal/ShareModal';

// Constants
const NEW_FOLDER = 'new_folder';
const SHARE = 'share';
const RENAME = 'rename';
const DELETE = 'delete';
const ADD_BY_PATH = 'add_by_path';
const CLI_TUTOR_MODE = 'cli_tutor_mode';
const ORDER = 'order';

export {
  NEW_FOLDER,
  SHARE,
  RENAME,
  DELETE,
  ADD_BY_PATH,
  CLI_TUTOR_MODE
};

class Modals extends React.Component {
  state = {
    readyToShow: false,
    rename: {
      folder: false,
      path: '',
      filename: ''
    },
    delete: {
      files: 0,
      folder: 0,
      paths: []
    },
    order: {
      file: null
    },
    link: '',
    command: 'ipfs --help'
  }

  onAddByPath = (path) => {
    this.props.onAddByPath(path);
    this.leave();
  }

  makeDir = (path) => {
    this.props.onMakeDir(join(this.props.root, path));
    this.leave();
  }

  rename = (newName) => {
    let { filename, path } = this.state.rename;
    const { onMove } = this.props;

    filename = getRealPath(filename);

    if (newName !== '' && newName !== filename) {
      onMove(path, path.replace(filename, newName));
    }

    this.leave();
  }

  delete = () => {
    const { paths } = this.state.delete;

    this.props.onDelete(paths);
    this.leave();
  }

  leave = () => {
    this.setState({ readyToShow: false });
    this.props.done();
  }

  componentDidUpdate (prev) {
    const { cliOptions, files, onShareLink, show, t } = this.props;

    if (show === prev.show) {
      return;
    }

    switch (show) {
      case SHARE: {
        this.setState({
          link: t('generating'),
          readyToShow: true
        });

        onShareLink(files).then((link) => this.setState({ link }));
        break;
      }

      case RENAME: {
        const file = files[0];

        this.setState({
          readyToShow: true,
          rename: {
            folder: file.type === 'directory',
            path: file.path,
            filename: file.path.split('/').pop()
          }
        });
        break;
      }

      case DELETE: {
        let filesCount = 0;
        let foldersCount = 0;

        files.forEach((file) => file.type === 'file' ? filesCount++ : foldersCount++);

        this.setState({
          readyToShow: true,
          delete: {
            files: filesCount,
            folders: foldersCount,
            paths: files.map((f) => f.path)
          }
        });
        break;
      }

      case NEW_FOLDER:
      case ADD_BY_PATH:
        this.setState({ readyToShow: true });
        break;
      case CLI_TUTOR_MODE:
        this.setState({ command: this.cliCommand(cliOptions, files) }, () => {
          this.setState({ readyToShow: true });
        });
        break;
      default:
        // do nothing
    }
  }

  cliCommand = (action, files) => {
    let activeCid = '';
    let fileName = '';
    let isPinned = '';
    let path = '';

    // @TODO: handle multi-select
    if (files) {
      activeCid = files[0].cid;
      fileName = files[0].name;
      isPinned = files[0].pinned;
      path = realMfsPath(files[0].path);
    }

    // @TODO: ensure path is set for all actions
    switch (action) {
      case cliCmdKeys.ADD_FILE:
      case cliCmdKeys.ADD_DIRECTORY:
      case cliCmdKeys.CREATE_NEW_DIRECTORY:
      case cliCmdKeys.FROM_IPFS:
      case cliCmdKeys.DELETE_FILE_FROM_IPFS:
        return cliCommandList[action](path);
      case cliCmdKeys.DOWNLOAD_OBJECT_COMMAND:
        return cliCommandList[action](activeCid);
      case cliCmdKeys.RENAME_IPFS_OBJECT:
        return cliCommandList[action](path, fileName);
      case cliCmdKeys.PIN_OBJECT:
        return cliCommandList[action](activeCid, isPinned ? 'rm' : 'add');
      default:
        return cliCommandList[action]();
    }
  }

  render () {
    const { show, t } = this.props;
    const { command, link, readyToShow, rename } = this.state;

    return (
      <div>
        <Overlay onLeave={this.leave}
          show={show === NEW_FOLDER && readyToShow}>
          <NewFolderModal
            className='outline-0'
            onCancel={this.leave}
            onSubmit={this.makeDir} />
        </Overlay>

        <Overlay onLeave={this.leave}
          show={show === SHARE && readyToShow}>
          <ShareModal
            className='outline-0'
            link={link}
            onLeave={this.leave} />
        </Overlay>

        <Overlay onLeave={this.leave}
          show={show === RENAME && readyToShow}>
          <RenameModal
            className='outline-0'
            { ...rename }
            onCancel={this.leave}
            onSubmit={this.rename} />
        </Overlay>

        <Overlay onLeave={this.leave}
          show={show === DELETE && readyToShow}>
          <DeleteModal
            className='outline-0'
            { ...this.state.delete }
            onCancel={this.leave}
            onDelete={this.delete} />
        </Overlay>

        <Overlay onLeave={this.leave}
          show={show === ADD_BY_PATH && readyToShow}>
          <AddByPathModal
            className='outline-0'
            onCancel={this.leave}
            onSubmit={this.onAddByPath} />
        </Overlay>

        <Overlay onLeave={this.leave}
          show={show === CLI_TUTOR_MODE && readyToShow}>
          <CliTutorMode command={command}
            filesPage={true}
            onLeave={this.leave}
            t={t}/>
        </Overlay>
      </div>
    );
  }
}

Modals.propTypes = {
  t: PropTypes.func.isRequired,
  show: PropTypes.string,
  files: PropTypes.array,
  onAddByPath: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onMakeDir: PropTypes.func.isRequired,
  onShareLink: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default withTranslation('files')(Modals);
