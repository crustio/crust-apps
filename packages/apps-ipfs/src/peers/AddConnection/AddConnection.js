// [object Object]
// SPDX-License-Identifier: Apache-2.0

import isIPFS from 'is-ipfs';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Button from '../../components/button/Button';
import Overlay from '../../components/overlay/Overlay';
import TextInputModal from '../../components/text-input-modal/TextInputModal';
import Icon from '../../icons/StrokeDecentralization';

class AddConnection extends React.Component {
  state = {
    open: false,
    loading: false,
    hasErrored: false
  }

  toggleModal = () => {
    this.setState({
      open: !this.state.open
    });
  }

  addConnection = async (maddr) => {
    this.setState({ loading: true });
    const { type } = await this.props.doConnectSwarm(maddr);

    this.setState({ loading: false, hasErrored: true });

    if (type === 'SWARM_CONNECT_FAILED') return;

    this.toggleModal();
  }

  onInputChange = () => {
    if (!this.state.hasErrored) return;

    this.setState({ hasErrored: false });
  }

  getDescription = () => {
    const { t } = this.props;
    const codeClass = 'w-90 mb1 pa1 bg-snow f7 charcoal-muted truncate';

    return (
      <div className='mb3 flex flex-column items-center'>
        <p className='gray w-80'>{t('insertPeerAddress')}</p>
        <span className='w-80 mv2 f7 charcoal-muted'>{t('app:terms.example')}</span>
        <code className={codeClass}>/ip4/76.176.168.65/tcp/4001/p2p/QmbBHw1Xx9pUpAbrVZUKTPL5Rsph5Q9GQhRvcWVBPFgGtC</code>
      </div>
    );
  }

  render () {
    const { hasErrored, loading, open } = this.state;
    const { t } = this.props;

    return (
      <div>
        <Button bg='bg-navy'
          className='f6 ph3 tc'
          color='white'
          onClick={this.toggleModal}>
          <span className={'fill-white'}>+</span> {t('addConnection')}
        </Button>

        <Overlay onLeave={this.toggleModal}
          show={open}>
          <TextInputModal
            description={this.getDescription()}
            error={hasErrored}
            icon={Icon}
            loading={loading}
            onCancel={this.toggleModal}
            onInputChange={this.onInputChange}
            onSubmit={this.addConnection}
            submitText={t('app:actions.add')}
            title={t('addConnection')}
            validate={isIPFS.peerMultiaddr}
          />
        </Overlay>
      </div>
    );
  }
}

export default connect('doConnectSwarm', withTranslation('peers')(AddConnection));
