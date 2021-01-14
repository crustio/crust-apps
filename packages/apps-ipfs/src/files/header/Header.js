// [object Object]
// SPDX-License-Identifier: Apache-2.0
import filesize from 'filesize';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import SimplifyNumber from 'simplify-number';

import Button from '../../components/button/Button';
// Icons
import GlyphDots from '../../icons/GlyphDots';
// Components
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import FileInput from '../file-input/FileInput';

function BarOption ({ children, className = '', isLink = false, title, ...etc }) {
  className += ' tc pa3';

  if (etc.onClick) className += ' pointer';

  return (
    <div className={className}
      {...etc}>
      <span className='nowrap db f4 navy'>{children}</span>
      <span className={`db ttl ${isLink ? 'navy underline' : 'gray'}`}>{title}</span>
    </div>
  );
}

function humanSize (size) {
  if (!size) return 'N/A';

  return filesize(size || 0, {
    round: size >= 1000000000 ? 1 : 0, spacer: ''
  });
}

class Header extends React.Component {
  handleContextMenu = (ev) => {
    const pos = this.dotsWrapper.getBoundingClientRect();

    this.props.handleContextMenu(ev, 'TOP', {
      ...this.props.files,
      pinned: this.props.pins.includes(this.props.files.cid.toString())
    }, pos);
  }

  handleBreadCrumbsContextMenu = (ev, breadcrumbsRef, file) => {
    const pos = breadcrumbsRef.getBoundingClientRect();

    this.props.handleContextMenu(ev, 'TOP', file, pos);
  }

  render () {
    const { files,
      filesPathInfo,
      filesSize,
      onNavigate,
      pins,
      repoNumObjects,
      repoSize,
      t } = this.props;

    return (
      <div className='db flex-l justify-between items-center'>
        <div className='mb3 overflow-hidden mr2'>
          <Breadcrumbs className='joyride-files-breadcrumbs'
            onAddFiles={this.props.onAddFiles}
            onClick={onNavigate}
            onContextMenuHandle={(...args) => this.handleBreadCrumbsContextMenu(...args)}
            onMove={this.props.onMove}
            path={files ? files.path : '/404'}/>
        </div>

        <div className='mb3 flex justify-between items-center bg-snow-muted joyride-files-add'>
          <BarOption isLink
            onClick={() => { onNavigate('/storage/files'); }}
            title={t('app:terms.files')}>
            { humanSize(filesSize) }
          </BarOption>

          <BarOption isLink
            onClick={() => { onNavigate('/storage/pins'); }}
            title={t('app:terms.pins')}>
            { pins ? SimplifyNumber(pins.length) : '-' }
          </BarOption>

          <BarOption title={t('app:terms.blocks')}>
            { repoNumObjects ? SimplifyNumber(repoNumObjects, { decimal: 0 }) : 'N/A' }
          </BarOption>

          <BarOption title={t('app:terms.repo')}>
            { humanSize(repoSize) }
          </BarOption>

          <div className='pa3'>
            <div className='ml-auto flex items-center'>
              { (files && files.type === 'directory' && filesPathInfo.isMfs)
                ? <FileInput
                  onAddByPath={this.props.onAddByPath}
                  onAddFiles={this.props.onAddFiles}
                  onCliTutorMode={this.props.onCliTutorMode}
                  onNewFolder={this.props.onNewFolder}
                />
                : <div ref={(el) => { this.dotsWrapper = el; }}>
                  <Button bg='bg-navy'
                    className='f6 relative flex justify-center items-center tc'
                    color='white'
                    disabled={!files || filesPathInfo.isRoot || files.type === 'unknown'}
                    fill='fill-white'
                    minWidth='100px'
                    onClick={this.handleContextMenu}>
                    <GlyphDots className='w1 mr2' />
                    { t('app:actions.more') }
                  </Button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  'selectPins',
  'selectFilesSize',
  'selectRepoSize',
  'selectRepoNumObjects',
  'selectFilesPathInfo',
  withTranslation('files')(Header)
);
