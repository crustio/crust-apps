// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'redux-bundler-react';

import { cliCmdKeys, cliCommandList } from '../../bundles/files/consts';
import StrokeCode from '../../icons/StrokeCode';
import StrokeDownload from '../../icons/StrokeDownload';
import Button from '../button/Button';
// Components
import { Modal, ModalActions, ModalBody } from '../modal/Modal';
import Overlay from '../overlay/Overlay';
import Shell from '../shell/Shell';

export const CliTutorialModal = ({ className, command, downloadConfig, onLeave, t, ...props }) => {
  const onClickCopyToClipboard = (cmd) => {
    navigator.clipboard.writeText(cmd).then(() => {
      onLeave();
    });
  };

  return (
    <Modal {...props}
      className={className}
      onCancel={onLeave}
      style={{ maxWidth: '40em' }}>
      <ModalBody icon={StrokeCode}>
        <p className='charcoal w-80 center'
          style={{ lineHeight: '1.3' }}>
          {t('app:cliModal.description')}
        </p>
        <p className='charcoal-muted w-90 center'>
          { command && command === cliCommandList[cliCmdKeys.UPDATE_IPFS_CONFIG]() ? t('app:cliModal.extraNotes') : ''}
        </p>
        <div>
          <Shell className='tl'
            title='Shell'>
            <code className='db'><b className='no-select'>$ </b>{command}</code>
          </Shell>
        </div>
      </ModalBody>

      <ModalActions>
        <div>
          <Button bg='bg-gray'
            className='ma2 tc'
            onClick={onLeave}>{t('app:actions.close')}</Button>
        </div>
        <div className='flex items-center'>
          {
            command && command === cliCommandList[cliCmdKeys.UPDATE_IPFS_CONFIG]()
              ? <StrokeDownload className='dib fill-link pointer'
                onClick={downloadConfig}
                style={{ height: 38 }}
              />
              : <div />
          }
          <Button className='ma2 tc'
            onClick={() => onClickCopyToClipboard(command)}>
            {t('app:actions.copy')}
          </Button>
        </div>
      </ModalActions>
    </Modal>
  );
};

const CliTutorMode = ({ command, config, doOpenCliTutorModal, filesPage, isCliTutorModalOpen, isCliTutorModeEnabled, onLeave, showIcon, t }) => {
  const downloadConfig = (config) => {
    const url = window.URL.createObjectURL(new Blob([config]));
    const link = document.createElement('a');

    link.style.display = 'none';
    link.href = url;
    link.download = 'settings.json';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isCliTutorModeEnabled) {
    if (filesPage) {
      return <CliTutorialModal className='outline-0'
        command={command}
        onLeave={onLeave}
        t={t}/>;
    }

    return (
      <>
        {
          showIcon
            ? <StrokeCode className='dib fill-link pointer mh2'
              onClick={() => doOpenCliTutorModal(true)}
              style={{ height: 44 }}/>
            : <div/>
        }
        <Overlay onLeave={() => doOpenCliTutorModal(false)}
          show={isCliTutorModalOpen}>
          <CliTutorialModal className='outline-0'
            command={command}
            downloadConfig={() => downloadConfig(config)}
            onLeave={() => doOpenCliTutorModal(false)}
            t={t}/>
        </Overlay>
      </>
    );
  }

  return null;
};

CliTutorialModal.propTypes = {
  onLeave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  command: PropTypes.string.isRequired
};

CliTutorialModal.defaultProps = {
  className: ''
};

export default connect(
  'doOpenCliTutorModal',
  'selectIsCliTutorModalOpen',
  'selectIsCliTutorModeEnabled',
  CliTutorMode
);
