import React from 'react'
import { withTranslation, Trans } from 'react-i18next'
import { connect } from 'redux-bundler-react'
import filesize from 'filesize'

export const StatusConnected = ({ t, peersCount, repoSize }) => {
  const humanRepoSize = filesize(repoSize || 0, { round: 1 })
  return (
    <header>
      <h1 className='montserrat fw2 f3 charcoal ma0 pt0 pb2'>
        <Trans i18nKey='app:status.connectedToIpfs' t={t}>Connected to IPFS</Trans>
      </h1>
      <p className='montserrat fw4 f5 ma0 pb3 lh-copy'>
        <span className='db dib-ns'>
          <Trans
            i18nKey='StatusConnected.paragraph1' t={t}
            defaults='Hosting <0>{repoSize} of files</0>'
            values={{ repoSize: humanRepoSize }}
            components={[<a className='link blue' href='#/files'>?</a>]}
          />
        </span>
        <span className='dn di-ns gray'> — </span>
        <span className='db mt1 mt0-ns dib-ns'>
          <Trans
            i18nKey='StatusConnected.paragraph2' t={t}
            defaults='Discovered <0>{peersCount} peers</0>'
            values={{ peersCount: peersCount.toString() }}
            components={[<a className='link blue' href='#/peers'>?</a>]}
          />
        </span>
      </p>
    </header>
  )
}

export const TranslatedStatusConnected = withTranslation('status')(StatusConnected)

export default connect(
  'selectPeersCount',
  'selectRepoSize',
  TranslatedStatusConnected
)
