// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Button from '../../../components/button/Button';
import { Modal, ModalActions, ModalBody } from '../../../components/modal/Modal';
import TrashIcon from '../../../icons/StrokeTrash';

const DeleteModal = ({ className, files, folders, onCancel, onDelete, t, tReady, ...props }) => {
  let context = 'File';
  const count = files + folders;

  if (folders > 0) {
    if (files > 0) {
      context = 'Item';
    } else {
      context = 'Folder';
    }
  }

  return (
    <Modal {...props}
      className={className}
      onCancel={onCancel} >
      <ModalBody icon={TrashIcon}
        title={t(`deleteModal.title${context}`, { count })}>
        <p className='gray w-80 center'>
          {t(`deleteModal.description${context}`, { count })}
        </p>
      </ModalBody>

      <ModalActions>
        <Button bg='bg-gray'
          className='ma2 tc'
          onClick={onCancel}>{t('app:actions.cancel')}</Button>
        <Button bg='bg-red'
          className='ma2 tc'
          onClick={onDelete}>{t('app:actions.delete')}</Button>
      </ModalActions>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  files: PropTypes.number,
  folders: PropTypes.number,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
};

DeleteModal.defaultProps = {
  className: '',
  files: 0,
  folders: 0
};

export default withTranslation('files')(DeleteModal);
