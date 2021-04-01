// [object Object]
// SPDX-License-Identifier: Apache-2.0
import CID from 'cids';
import classnames from 'classnames';
import filesize from 'filesize';
import { basename, join } from 'path';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
// React DnD
import { useDrag, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { withTranslation } from 'react-i18next';

import GlyphOrder from '@polkadot/apps-ipfs/icons/GlyphOrder';

import Checkbox from '../../components/checkbox/Checkbox';
import Tooltip from '../../components/tooltip/Tooltip';
// Components
import GlyphDots from '../../icons/GlyphDots';
import GlyphPin from '../../icons/GlyphPin';
import StrokeContract from '../../icons/StrokeContract';
import { normalizeFiles } from '../../lib/files';
import FileIcon from '../file-icon/FileIcon';

const File = ({ cantDrag, cantSelect, cid, coloured, contracted, focused, handleContextMenuClick, isMfs, name, onAddFiles, onMove, onNavigate, onSelect, path, pinned, selected, size, t, translucent, type }) => {
  const dotsWrapper = useRef();
  const originalSize = size;

  const handleCtxLeftClick = (ev) => {
    console.log('handleCtxLeftClick');

    const pos = dotsWrapper.current.getBoundingClientRect();

    handleContextMenuClick(ev, 'LEFT', { name, size, originalSize, type, cid, path, pinned }, pos);
  };

  size = size ? filesize(size, { round: 0 }) : '-';

  const handleCtxRightClick = (ev) => {
    handleContextMenuClick(ev, 'RIGHT', { name, size, type, cid, path, pinned, originalSize });
  };

  const [, drag, preview] = useDrag({
    item: { name, size, cid, path, pinned, contracted, type: 'FILE' },
    canDrag: !cantDrag && isMfs
  });

  const checkIfDir = (monitor) => {
    if (!isMfs) return false;
    const item = monitor.getItem();

    if (!item) return false;

    if (item.name) {
      return type === 'directory' &&
        name !== item.name &&
        !selected;
    }

    return type === 'directory';
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE, 'FILE'],
    drop: (_, monitor) => {
      const item = monitor.getItem();

      if (item.files) {
        (async () => {
          const files = await item.filesPromise;

          onAddFiles(normalizeFiles(files), path);
        })();
      } else {
        const src = item.path;
        const dst = join(path, basename(item.path));

        onMove(src, dst);
      }
    },
    canDrop: (_, monitor) => checkIfDir(monitor),
    collect: (monitor) => ({
      canDrop: checkIfDir(monitor),
      isOver: monitor.isOver()
    })
  });

  let className = 'File b--light-gray relative flex items-center bt';

  if (selected) {
    className += ' selected';
  }

  const styles = { height: 55, overflow: 'hidden' };

  if (focused || (selected && !translucent) || coloured || (isOver && canDrop)) {
    styles.backgroundColor = '#F0F6FA';
  } else if (translucent) {
    className += ' o-70';
  }

  if (focused) {
    styles.border = '1px dashed #9ad4db';
  } else {
    styles.border = '1px solid transparent';
    styles.borderTop = '1px solid #eee';
  }

  const hash = cid.toString() || t('hashUnavailable');

  const select = (select) => onSelect(name, select);

  const checkBoxCls = classnames({
    'o-70 glow': !cantSelect,
    'o-1': selected || focused
  }, ['pl2 w2']);

  return (
    <div ref={drop}>
      <div className={className}
        onContextMenu={handleCtxRightClick}
        ref={drag}
        style={styles}>
        <div className={checkBoxCls}>
          <Checkbox aria-label={ t('checkboxLabel', { name })}
            checked={selected}
            disabled={cantSelect}
            onChange={select} />
        </div>

        <button aria-label={ name === '..' ? t('previousFolder') : t('fileLabel', { name, type, size }) }
          className='relative pointer flex items-center flex-grow-1 ph2 pv1 w-40'
          onClick={onNavigate}
          ref={preview}>
          <div className='dib flex-shrink-0 mr2'>
            <FileIcon name={name}
              type={type} />
          </div>
          <div style={{ width: 'calc(100% - 3.25rem)' }}>
            <Tooltip text={name}>
              <div className='f6 truncate charcoal'>{name}</div>
            </Tooltip>
            <Tooltip text={hash}>
              <div className='f7 mt1 gray truncate monospace'>{hash}</div>
            </Tooltip>
          </div>
        </button>
        <div className='ph2 pv1 flex-none dn db-l tr mw3'>
          {<div className='bg-snow br-100 o-70'
            style={{ width: '1.5rem', height: '1.5rem', visibility: contracted ? 'visible' : 'hidden' }}
            title={t('contracted')}>
            <StrokeContract className='fill-teal-muted' />
          </div>}
        </div>

        <div className='ph2 pv1 flex-none dn db-l tr mw3'>
          { <div className='bg-snow br-100 o-70'
            style={{ width: '1.5rem', height: '1.5rem', visibility: pinned ? 'visible' : 'hidden' }}
            title={t('pinned')}>
            <GlyphPin className='fill-teal-muted' />
          </div> }
        </div>
        <div className='size pl2 pr4 pv1 flex-none f6 dn db-l tr charcoal-muted w-10 mw4'>
          {size}
        </div>
        <button aria-label={ t('checkboxLabel', { name })}
          className='ph2 db button-inside-focus'
          onClick={handleCtxLeftClick}
          ref={dotsWrapper}
          style={{ width: '2.5rem' }} >
          <GlyphDots className='fill-gray-muted pointer hover-fill-gray transition-all'/>
        </button>
      </div>
    </div>
  );
};

File.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number,
  cid: PropTypes.instanceOf(CID),
  selected: PropTypes.bool,
  focused: PropTypes.bool,
  onSelect: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
  onAddFiles: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  coloured: PropTypes.bool,
  translucent: PropTypes.bool,
  handleContextMenuClick: PropTypes.func,
  pinned: PropTypes.bool,
  isMfs: PropTypes.bool
};

File.defaultProps = {
  coloured: false,
  translucent: false
};

export default withTranslation('files')(File);
