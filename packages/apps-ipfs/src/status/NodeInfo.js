// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { Definition, DefinitionList } from '../components/definition/Definition.js';
import VersionLink from '../components/version-link/VersionLink';

class NodeInfo extends React.Component {
  getField (obj, field, fn) {
    if (obj && obj[field]) {
      if (fn) {
        return fn(obj[field]);
      }

      return obj[field];
    }

    return '';
  }

  getVersion (identity) {
    const raw = this.getField(identity, 'agentVersion');

    return raw ? raw.split('/').join(' ') : '';
  }

  render () {
    const { identity, t } = this.props;

    return (
      <DefinitionList>
        <Definition desc={this.getField(identity, 'id')}
          term={t('terms.peerId')} />
        <Definition desc={<VersionLink agentVersion={this.getField(identity, 'agentVersion')} />}
          term={t('terms.agent')} />
        {/* <Definition desc={<a className='link blue' */}
        {/*  href={'https://github.com/ipfs-shipyard/ipfs-webui/releases/tag/v' + process.env.REACT_APP_VERSION} */}
        {/*  rel='noopener noreferrer' */}
        {/*  target='_blank'>v{process.env.REACT_APP_VERSION}</a>} */}
        {/* term={t('terms.ui')} /> */}
      </DefinitionList>
    );
  }
}

export default connect(
  'selectIdentity',
  withTranslation('app')(NodeInfo)
);
