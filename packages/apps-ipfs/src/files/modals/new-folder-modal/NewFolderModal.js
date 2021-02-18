// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import TextInputModal from '../../../components/text-input-modal/TextInputModal';
import FolderIcon from '../../../icons/StrokeFolder';

function NewFolderModal ({ className, onCancel, onSubmit, t, tReady, ...props }) {
  return (
    <TextInputModal
      className={className}
      description={t('newFolderModal.description')}
      icon={FolderIcon}
      onCancel={onCancel}
      onChange={(p) => p.trimStart()}
      onSubmit={(p) => onSubmit(p.trim())}
      submitText={t('app:actions.create')}
      title={t('newFolderModal.title')}
      {...props} />
  );
}

NewFolderModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
};

export default withTranslation('files')(NewFolderModal);
