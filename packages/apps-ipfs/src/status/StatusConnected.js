// [object Object]
// SPDX-License-Identifier: Apache-2.0
import filesize from 'filesize';
import React from 'react';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import { useHistory } from 'react-router-dom';

export const StatusConnected = ({ peersCount, repoSize, t }) => {
  const humanRepoSize = filesize(repoSize || 0, { round: 1 });
  const history = useHistory()
  return (
    <header>
      <h1 className='montserrat fw2 f3 charcoal ma0 pt0 pb2'
        style={{ textTransform: 'none' }}>
        <Trans i18nKey='app:status.connectedToIpfs1'
          t={t}>
          <div >
            IPFS network is ready
            <div style={{ fontSize: '16px', paddingTop: '5px' }}>
              You can check your IPFS node status in this page. Go to
              <a className='link blue'
                 onClick={() => {
                   history.push('/storage/files')
                 }}
                >Files</a>
            tab to store/retrieve files. The storage order function of Crust Network is coming soon.
            </div>
          </div>
        </Trans>
      </h1>
      <p className='montserrat fw4 f5 ma0 pb3 lh-copy'>
        <span className='db dib-ns'>
          <Trans
            components={[<a className='link blue'
                            onClick={() => {
                              history.push('/storage/files')
                            }}
            >?</a>]}
            defaults='Hosting <0>{{repoSize}} of files</0>'
            i18nKey='StatusConnected.paragraph1'
            t={t}
            values={{ repoSize: humanRepoSize }}
          />
        </span>
        <span className='dn di-ns gray'> — </span>
        <span className='db mt1 mt0-ns dib-ns'>
          <Trans
            components={[
              <a className='link blue'
                 onClick={() => {
                   history.push('/storage/peers')
                 }}
              >
                ?
              </a>
            ]}
            defaults='Discovered <0>{{peersCount}} peers</0>'
            i18nKey='StatusConnected.paragraph2'
            t={t}
            values={{ peersCount: peersCount.toString() }}
          />
        </span>
      </p>
    </header>
  );
};

export const TranslatedStatusConnected = withTranslation('status')(StatusConnected);

export default connect('selectPeersCount', 'selectRepoSize', TranslatedStatusConnected);
