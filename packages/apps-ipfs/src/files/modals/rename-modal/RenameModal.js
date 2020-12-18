// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import PropTypes from 'prop-types';
import PencilIcon from '../../../icons/StrokePencil';
import TextInputModal from '../../../components/text-input-modal/TextInputModal';
import { withTranslation } from 'react-i18next';

function RenameModal ({ className, filename, folder, onCancel, onSubmit, t, tReady, ...props }) {
  const context = folder ? 'Folder' : 'File';

  return (
    <TextInputModal
      className={className}
      defaultValue={filename}
      description={t(`renameModal.description${context}`)}
      icon={PencilIcon}
      mustBeDifferent
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitText={t('app:actions.save')}
      title={t(`renameModal.title${context}`)}
      {...props} />
  );
}

RenameModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  filename: PropTypes.string.isRequired,
  folder: PropTypes.bool,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
};

RenameModal.defaultProps = {
  className: '',
  folder: false
};

export default withTranslation('files')(RenameModal);
