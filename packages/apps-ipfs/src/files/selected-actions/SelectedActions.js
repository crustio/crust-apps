// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './SelectedActions.css';

import classNames from 'classnames';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import GlyphSmallCancel from '../../icons/GlyphSmallCancel';
import StrokeDownload from '../../icons/StrokeDownload';
import StrokeIpld from '../../icons/StrokeIpld';
import StrokePencil from '../../icons/StrokePencil';
import StrokeShare from '../../icons/StrokeShare';
import StrokeTrash from '../../icons/StrokeTrash';

const styles = {
  bar: {
    background: '#F0F6FA',
    borderColor: '#CFE0E2',
    color: '#59595A'
  },
  count: {
    color: '#F9FAFB',
    width: '38px',
    height: '38px'
  },
  countNumber: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  size: {
    color: '#ccc3a4'
  }
};

const classes = {
  svg: (v) => v ? 'w3 pointer hover-fill-navy-muted' : 'w3',
  action: (v) => v ? 'pointer' : 'disabled o-50'
};

class SelectedActions extends React.Component {
  constructor (props) {
    super(props);
    this.containerRef = React.createRef();
  }

  static propTypes = {
    count: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    unselect: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    share: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
    rename: PropTypes.func.isRequired,
    inspect: PropTypes.func.isRequired,
    downloadProgress: PropTypes.number,
    t: PropTypes.func.isRequired,
    tReady: PropTypes.bool.isRequired,
    isMfs: PropTypes.bool.isRequired,
    animateOnStart: PropTypes.bool
  }

  static defaultProps = {
    className: ''
  }

  state = {
    force100: false
  }

  componentDidUpdate (prev) {
    if (this.props.downloadProgress === 100 && prev.downloadProgress !== 100) {
      this.setState({ force100: true });
      setTimeout(() => {
        this.setState({ force100: false });
      }, 2000);
    }
  }

  componentDidMount () {
    this.containerRef.current && this.containerRef.current.focus();
  }

  get downloadText () {
    if (this.state.force100) {
      return this.props.t('finished');
    }

    if (!this.props.downloadProgress) {
      return this.props.t('app:actions.download');
    }

    if (this.props.downloadProgress === 100) {
      return this.props.t('finished');
    }

    return this.props.downloadProgress.toFixed(0) + '%';
  }

  render () {
    const { animateOnStart, className, count, download, downloadProgress, inspect, isMfs, remove, rename, share, size, style, t, tReady, unselect, ...props } = this.props;

    const isSingle = count === 1;

    let singleFileTooltip = { title: t('individualFilesOnly') };

    if (count === 1) {
      singleFileTooltip = {};
    }

    return (
      <div className={classNames('sans-serif bt w-100 pa3 ph4-l', className, animateOnStart && 'selectedActionsAnimated')}
        style={{ ...styles.bar, ...style }}
        {...props}>
        <div className='flex items-center justify-between'>
          <div className='w5-l'>
            <div className='flex items-center'>
              <div className='mr3 relative f3 fw6 flex-shrink-0 dib br-100 bg-navy'
                style={styles.count}>
                <span className='absolute'
                  style={styles.countNumber}>{count}</span>
              </div>
              <div className='dn db-l f6'>
                <p className='ma0'>{t('filesSelected', { count })}</p>
                <p className='ma0 mt1'
                  style={styles.size}>{t('totalSize', { size: filesize(size) })}</p>
              </div>
            </div>
          </div>
          <div aria-label={t('menuOptions')}
            className='flex'
            ref={ this.containerRef }
            role='menu'
            tabIndex='0'>
            <button className='tc mh2'
              onClick={share}
              role='menuitem'>
              <StrokeShare aria-hidden='true'
                className='w3 hover-fill-navy-muted'/>
              <p className='ma0 f6'>{t('actions.share')}</p>
            </button>
            <button className='tc mh2'
              onClick={download}
              role='menuitem'>
              <StrokeDownload aria-hidden='true'
                className='w3 hover-fill-navy-muted'/>
              <p className='ma0 f6'>{this.downloadText}</p>
            </button>
            <button className={classNames('tc mh2', classes.action(isMfs))}
              onClick={isMfs ? remove : null}
              role='menuitem'>
              <StrokeTrash aria-hidden='true'
                className={classes.svg(isMfs)}/>
              <p className='ma0 f6'>{t('app:actions.delete')}</p>
            </button>
            <button className={classNames('tc mh2', classes.action(isSingle))}
              onClick={isSingle ? inspect : null}
              role='menuitem'
              {...singleFileTooltip}>
              <StrokeIpld aria-hidden='true'
                className={classes.svg(isSingle)}
                fill='#A4BFCC'/>
              <p className='ma0 f6'>{t('app:actions.inspect')}</p>
            </button>
            <button className={classNames('tc mh2', classes.action(isSingle && isMfs))}
              onClick={(isSingle && isMfs) ? rename : null}
              role='menuitem'
              {...singleFileTooltip}>
              <StrokePencil aria-hidden='true'
                className={classes.svg(isSingle && isMfs)}/>
              <p className='ma0 f6'>{t('app:actions.rename')}</p>
            </button>
          </div>
          <div className='w5-l'>
            <button className='flex items-center justify-end f6 charcoal'
              onClick={unselect}>
              {/* TODO: Should we go back to the files list when we tab out of here? */}
              <span className='mr2 dn db-l'>{t('app:actions.unselectAll')}</span>
              <span className='mr2 dn db-m'>{t('app:actions.clear')}</span>
              <GlyphSmallCancel className='fill-charcoal w1 o-70'
                onClick={unselect}
                viewBox='37 40 27 27' />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('files')(SelectedActions);
