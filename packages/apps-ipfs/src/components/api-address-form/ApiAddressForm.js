// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Button from '../button/Button';

const ApiAddressForm = ({ doUpdateIpfsApiAddress, ipfsApiAddress, t }) => {
  const [value, setValue] = useState(asAPIString(ipfsApiAddress));

  const onChange = (event) => setValue(event.target.value);

  const onSubmit = async (event) => {
    event.preventDefault();
    doUpdateIpfsApiAddress(value);
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit(event);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        aria-label={t('apiAddressForm.apiLabel')}
        className='w-100 lh-copy monospace f5 pl1 pv1 mb2 charcoal input-reset ba b--black-20 br1 focus-outline'
        id='api-address'
        onChange={onChange}
        onKeyPress={onKeyPress}
        type='text'
        value={value}
      />
      <div className='tr'>
        <Button className='tc'>{t('actions.submit')}</Button>
      </div>
    </form>
  );
};

/**
 * @returns {string}
 */
const asAPIString = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value;

  return JSON.stringify(value);
};

export default connect(
  'doUpdateIpfsApiAddress',
  'selectIpfsApiAddress',
  withTranslation('app')(ApiAddressForm)
);
