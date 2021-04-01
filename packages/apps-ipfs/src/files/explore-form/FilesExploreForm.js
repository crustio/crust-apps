// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './FilesExploreForm.css';

import isIPFS from 'is-ipfs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Button from '../../components/button/Button';
import StrokeFolder from '../../icons/StrokeFolder';
import StrokeIpld from '../../icons/StrokeIpld';

class FilesExploreForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      path: '',
      hideExplore: false
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBrowse = this.onBrowse.bind(this);
    this.onInspect = this.onInspect.bind(this);
  }

  onKeyDown (evt) {
    if (evt.key === 'Enter') {
      this.onBrowse(evt);
    }
  }

  onBrowse (evt) {
    evt.preventDefault();

    if (this.isValid) {
      let path = this.path;

      if (isIPFS.cid(path)) {
        path = `/ipfs/${path}`;
      }

      this.props.onBrowse(path);
      this.setState({ path: '' });
    }
  }

  onInspect (evt) {
    evt.preventDefault();

    if (this.isValid) {
      this.props.onInspect(this.path);
      this.setState({ path: '' });
    }
  }

  onChange (evt) {
    const path = evt.target.value;

    this.setState({ path });
  }

  get path () {
    return this.state.path.trim();
  }

  get isValid () {
    return this.path !== '' && (isIPFS.cid(this.path) || isIPFS.path(this.path));
  }

  get inputClass () {
    if (this.path === '') {
      return 'focus-outline';
    }

    if (this.isValid) {
      return 'b--green-muted focus-outline-green';
    } else {
      return 'b--red-muted focus-outline-red';
    }
  }

  render () {
    const { t } = this.props;

    return (
      <div className='sans-serif black-80 flex'
        data-id='FilesExploreForm'>
        <div className='flex-auto'>
          <div className='relative'>
            <input aria-describedby='ipfs-path-desc'
              className={`input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light ${this.inputClass}`}
              id='ipfs-path'
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              placeholder='QmHash/bafyHash'
              style={{ borderRadius: '3px 0 0 3px' }}
              type='text'
              value={this.state.path} />
            <small className='o-0 absolute f6 black-60 db mb2'
              id='ipfs-path-desc'>Paste in a CID or IPFS path</small>
          </div>
        </div>
        <div className='flex flex-row-reverse mb2'>
          <Button
            bg='bg-teal'
            className='ExploreFormButton button-reset pv1 ph2 ba f7 fw4 white overflow-hidden tc'
            disabled={!this.isValid}
            minWidth={0}
            onClick={this.onInspect}
            style={{ borderRadius: '0 3px 3px 0' }}
            title={t('app:actions.inspect')} >
            <StrokeIpld className='dib fill-current-color v-mid'
              style={{ height: 24 }} />
            <span className='ml2'>{t('app:actions.inspect')}</span>
          </Button>
          <Button
            className='ExploreFormButton button-reset pv1 ph2 ba f7 fw4 white bg-gray overflow-hidden tc'
            disabled={!this.isValid}
            minWidth={0}
            onClick={this.onBrowse}
            style={{ borderRadius: '0' }}
            title={t('app:actions.browse')} >
            <StrokeFolder className='dib fill-current-color v-mid'
              style={{ height: 24 }} />
            <span className='ml2'>{t('app:actions.browse')}</span>
          </Button>
        </div>
      </div>
    );
  }
}

FilesExploreForm.propTypes = {
  t: PropTypes.func.isRequired,
  onInspect: PropTypes.func.isRequired,
  onBrowse: PropTypes.func.isRequired
};

export default withTranslation('files')(FilesExploreForm);
