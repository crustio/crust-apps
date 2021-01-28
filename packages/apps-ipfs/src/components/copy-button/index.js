import React, { useCallback, useContext } from 'react';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import StatusContext from '../../../../react-components/src/Status/Context';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const CopyButton = ({ text, children, onCopy, message }) => {
  const { t } = useTranslation('order')
  const { queueAction } = useContext(StatusContext);
  const _onCopy = useCallback(
    () => {
      onCopy && onCopy()
      queueAction && queueAction({
        action: t('clipboard'),
        message,
        status: 'queued'
      });
    },
    [queueAction, t]
  );

  return <CopyToClipboard text={text.toString()} onCopy={_onCopy}>
                {children}
  </CopyToClipboard>
}
CopyButton.prototype = {
  text: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
}
export default CopyButton
