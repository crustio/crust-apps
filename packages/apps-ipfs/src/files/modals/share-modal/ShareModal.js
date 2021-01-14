// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withTranslation } from 'react-i18next';

import Button from '../../../components/button/Button';
import { Modal, ModalActions, ModalBody } from '../../../components/modal/Modal';
import ShareIcon from '../../../icons/StrokeShare';

const ShareModal = ({ className, link, onLeave, t, tReady, ...props }) => (
  <Modal {...props}
    className={className}
    onCancel={onLeave} >
    <ModalBody icon={ShareIcon}
      title={t('shareModal.title')}>
      <p className='gray w-80 center'>{t('shareModal.description')}</p>

      <div className='flex center w-100 pa2'>
        <input
          className={'input-reset flex-grow-1 charcoal-muted ba b--black-20 br1 pa2 mr2 focus-outline'}
          readOnly
          type='text'
          value={link} />
      </div>
    </ModalBody>

    <ModalActions>
      <Button bg='bg-gray'
        className='ma2 tc'
        onClick={onLeave}>{t('app:actions.close')}</Button>
      <CopyToClipboard onCopy={onLeave}
        text={link}>
        <Button className='ma2 tc'>{t('app:actions.copy')}</Button>
      </CopyToClipboard>
    </ModalActions>
  </Modal>
);

ShareModal.propTypes = {
  onLeave: PropTypes.func.isRequired,
  link: PropTypes.string,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
};

ShareModal.defaultProps = {
  className: ''
};

export default withTranslation('files')(ShareModal);
