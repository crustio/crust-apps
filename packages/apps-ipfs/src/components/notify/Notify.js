// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Toast from './Toast';

const Notify = ({ doNotifyDismiss, notify, notifyI18nKey, t }) => {
  const { error, show } = notify;

  if (!show) return null;

  return (
    <Toast error={error}
      onDismiss={doNotifyDismiss}>
      {t(notifyI18nKey)}
    </Toast>
  );
};

export default connect(
  'selectNotify',
  'selectNotifyI18nKey',
  'doNotifyDismiss',
  withTranslation('notify')(Notify)
);
