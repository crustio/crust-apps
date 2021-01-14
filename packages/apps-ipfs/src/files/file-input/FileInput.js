// [object Object]
// SPDX-License-Identifier: Apache-2.0

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { cliCmdKeys } from '../../bundles/files/consts';
import Button from '../../components/button/Button';
import DecentralizationIcon from '../../icons/StrokeDecentralization';
// Icons
import DocumentIcon from '../../icons/StrokeDocument';
import FolderIcon from '../../icons/StrokeFolder';
import NewFolderIcon from '../../icons/StrokeNewFolder';
import { normalizeFiles } from '../../lib/files';
// Components
import { Dropdown, DropdownMenu, Option } from '../dropdown/Dropdown';

const AddButton = withTranslation('app')(
  ({ onClick, t }) => (
    <Button bg='bg-navy'
      className='f6 flex justify-center items-center'
      color='white'
      id='import-button'
      minWidth='100px'
      onClick={onClick}>
      <span><span className='aqua fill-white'>+</span> {t('actions.import')}</span>
    </Button>
  )
);

class FileInput extends React.Component {
  state = {
    dropdown: false
  }

  toggleDropdown = () => {
    this.setState((s) => ({ dropdown: !s.dropdown }));
  }

  onAddFolder = () => {
    this.toggleDropdown();

    return this.folderInput.click();
  }

  onAddFile = async () => {
    this.toggleDropdown();

    return this.filesInput.click();
  }

  onInputChange = (input) => async () => {
    this.props.onAddFiles(normalizeFiles(input.files));
    input.value = null;
  }

  onAddByPath = () => {
    this.props.onAddByPath();
    this.toggleDropdown();
  }

  onNewFolder = () => {
    this.props.onNewFolder();
    this.toggleDropdown();
  }

  onCliTutorMode = async (cliOptions) => {
    await this.props.doSetCliOptions(cliOptions);
    this.props.onCliTutorMode();
    this.toggleDropdown();
  }

  render () {
    const { isCliTutorModeEnabled, t } = this.props;

    return (
      <div className={this.props.className}>
        <Dropdown>
          <AddButton onClick={this.toggleDropdown} />
          <DropdownMenu
            onDismiss={this.toggleDropdown}
            open={this.state.dropdown}
            top={3} >
            <Option id='add-file'
              isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.ADD_FILE)}
              onClick={this.onAddFile}>
              <DocumentIcon className='fill-aqua w2 mr1' />
              {t('app:terms.file')}
            </Option>
            <Option id='add-folder'
              isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.ADD_DIRECTORY)}
              onClick={this.onAddFolder}>
              <FolderIcon className='fill-aqua w2 mr1' />
              {t('app:terms.folder')}
            </Option>
            <Option id='add-by-path'
              isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.FROM_IPFS)}
              onClick={this.onAddByPath}>
              <DecentralizationIcon className='fill-aqua w2 mr1' />
              {t('addByPath')}
            </Option>
            <Option id='add-new-folder'
              isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.CREATE_NEW_DIRECTORY)}
              onClick={this.onNewFolder}>
              <NewFolderIcon className='fill-aqua w2 h2 mr1' />
              {t('newFolder')}
            </Option>
          </DropdownMenu>
        </Dropdown>

        <input
          className='dn'
          id='file-input'
          multiple
          onChange={this.onInputChange(this.filesInput)}
          ref={(el) => { this.filesInput = el; }}
          type='file' />

        <input
          className='dn'
          id='directory-input'
          multiple
          onChange={this.onInputChange(this.folderInput)}
          ref={(el) => { this.folderInput = el; }}
          type='file'
          webkitdirectory='true' />
      </div>
    );
  }
}

FileInput.propTypes = {
  t: PropTypes.func.isRequired,
  onAddFiles: PropTypes.func.isRequired,
  onAddByPath: PropTypes.func.isRequired,
  onNewFolder: PropTypes.func.isRequired
};

export default connect(
  'selectIsCliTutorModeEnabled',
  'doOpenCliTutorModal',
  'doSetCliOptions',
  withTranslation('files')(FileInput)
);
