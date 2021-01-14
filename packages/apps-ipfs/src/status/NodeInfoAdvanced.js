// [object Object]
// SPDX-License-Identifier: Apache-2.0
import multiaddr from 'multiaddr';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Address from '../components/address/Address';
import { Definition, DefinitionList } from '../components/definition/Definition.js';
import Details from '../components/details/Details';
import ProviderLink from '../components/provider-link/ProviderLink';

function isMultiaddr (addr) {
  try {
    multiaddr(addr);

    return true;
  } catch (_) {
    return false;
  }
}

const getField = (obj, field, fn) => {
  if (obj && obj[field]) {
    if (fn) {
      return fn(obj[field]);
    }

    return obj[field];
  }

  return '';
};

const NodeInfoAdvanced = ({ doSetIsNodeInfoOpen, gatewayUrl, identity, ipfsApiAddress, ipfsProvider, isNodeInfoOpen, t }) => {
  let publicKey = null;
  let addresses = null;

  if (identity) {
    publicKey = getField(identity, 'publicKey');
    addresses = [...new Set(identity.addresses)].sort().map((addr) => <Address key={addr}
      value={addr} />);
  }

  const handleSummaryClick = (ev) => {
    doSetIsNodeInfoOpen(!isNodeInfoOpen);
    ev.preventDefault();
  };

  const asAPIString = (value) => {
    // hide raw JSON if advanced config is present in the string
    return typeof value !== 'string'
      ? t('customApiConfig')
      : value;
  };

  return (
    <Details className='mt3 f6'
      onClick={handleSummaryClick}
      open={isNodeInfoOpen}
      summaryText={t('app:terms.advanced')}>
      <DefinitionList className='mt3'>
        <Definition advanced
          desc={gatewayUrl}
          term={t('app:terms.gateway')} />
        {ipfsProvider === 'httpClient'
          ? <Definition advanced
            desc={
              (<div className='flex items-center'
                id='http-api-address'>
                {isMultiaddr(ipfsApiAddress)
                  ? (<Address value={ipfsApiAddress} />)
                  : asAPIString(ipfsApiAddress)
                }
                {/* todo:add edit page */}
                {/* <a className='ml2 link blue sans-serif fw6' */}
                {/*  href='#/storage/settings'>{t('app:actions.edit')}</a> */}
              </div>)
            }
            term={t('app:terms.api')} />
          : <Definition advanced
            desc={<ProviderLink name={ipfsProvider} />}
            term={t('app:terms.api')} />
        }
        <Definition advanced
          desc={addresses}
          term={t('app:terms.addresses')} />
        <Definition advanced
          desc={publicKey}
          term={t('app:terms.publicKey')} />
      </DefinitionList>
    </Details>
  );
};

export default connect(
  'selectIdentity',
  'selectIpfsProvider',
  'selectIpfsApiAddress',
  'selectGatewayUrl',
  'selectIsNodeInfoOpen',
  'doSetIsNodeInfoOpen',
  withTranslation('status')(NodeInfoAdvanced)
);
