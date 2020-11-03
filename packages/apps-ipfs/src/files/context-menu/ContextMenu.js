// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Dropdown, DropdownMenu, Option } from '../dropdown/Dropdown';
import StrokeCopy from '../../icons/StrokeCopy';
import StrokeShare from '../../icons/StrokeShare';
import StrokePencil from '../../icons/StrokePencil';
import StrokeIpld from '../../icons/StrokeIpld';
import StrokeTrash from '../../icons/StrokeTrash';
import StrokeDownload from '../../icons/StrokeDownload';
import StrokePin from '../../icons/StrokePin';
import { cliCmdKeys } from '../../bundles/files/consts';

class ContextMenu extends React.Component {
  constructor (props) {
    super(props);
    this.dropdownMenuRef = React.createRef();
  }

  state = {
    dropdown: false
  }

  wrap = (name, cliOptions) => () => {
    if (name === 'onCliTutorMode' && cliOptions) {
      this.props.doSetCliOptions(cliOptions);
    }

    this.props.handleClick();
    this.props[name]();
  }

  componentDidUpdate () {
    if (this.props.autofocus && this.props.isOpen) {
      if (!this.dropdownMenuRef.current) return;

      const firstButton = this.dropdownMenuRef.current.querySelector('button');

      if (!firstButton) return;

      firstButton.focus();
    }
  }

  render () {
    const {
      className, isCliTutorModeEnabled, isMfs, isUnknown, onDelete, onDownload,
      onInspect, onRename, onShare, pinned, t, translateX, translateY
    } = this.props;

    return (
      <Dropdown className={className}>
        <DropdownMenu
          arrowMarginRight='11px'
          left='calc(100% - 200px)'
          onDismiss={this.props.handleClick}
          open={this.props.isOpen}
          ref={this.dropdownMenuRef}
          top={-8}
          translateX={-translateX}
          translateY={-translateY}>
          { onShare &&
            <Option onClick={this.wrap('onShare')}>
              <StrokeShare className='w2 mr2 fill-aqua' />
              {t('actions.share')}
            </Option>
          }
          <CopyToClipboard onCopy={this.props.handleClick}
            text={String(this.props.cid)}>
            <Option>
              <StrokeCopy className='w2 mr2 fill-aqua' />
              {t('actions.copyHash')}
            </Option>
          </CopyToClipboard>
          { onInspect &&
            <Option onClick={this.wrap('onInspect')}>
              <StrokeIpld className='w2 mr2 fill-aqua' />
              {t('app:actions.inspect')}
            </Option>
          }
          <Option isCliTutorModeEnabled={isCliTutorModeEnabled}
            onCliTutorMode={this.wrap('onCliTutorMode', cliCmdKeys.PIN_OBJECT)}
            onClick={this.wrap(pinned ? 'onUnpin' : 'onPin')}>
            <StrokePin className='w2 mr2 fill-aqua' />
            { pinned ? t('app:actions.unpin') : t('app:actions.pinVerb') }
          </Option>
          { !isUnknown && onDownload &&
            <Option isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={this.wrap('onCliTutorMode', cliCmdKeys.DOWNLOAD_OBJECT_COMMAND)}
              onClick={this.wrap('onDownload')}>
              <StrokeDownload className='w2 mr2 fill-aqua' />
              {t('app:actions.download')}
            </Option>
          }
          { !isUnknown && isMfs && onRename &&
            <Option isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={this.wrap('onCliTutorMode', cliCmdKeys.RENAME_IPFS_OBJECT)}
              onClick={this.wrap('onRename')}>
              <StrokePencil className='w2 mr2 fill-aqua' />
              {t('app:actions.rename')}
            </Option>
          }
          { !isUnknown && isMfs && onDelete &&
            <Option isCliTutorModeEnabled={isCliTutorModeEnabled}
              onCliTutorMode={this.wrap('onCliTutorMode', cliCmdKeys.DELETE_FILE_FROM_IPFS)}
              onClick={this.wrap('onDelete')}
            >
              <StrokeTrash className='w2 mr2 fill-aqua' />
              {t('app:actions.delete')}
            </Option>
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

ContextMenu.propTypes = {
  isMfs: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isUnknown: PropTypes.bool.isRequired,
  hash: PropTypes.string,
  pinned: PropTypes.bool,
  handleClick: PropTypes.func,
  translateX: PropTypes.number.isRequired,
  translateY: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  onRename: PropTypes.func,
  onDownload: PropTypes.func,
  onInspect: PropTypes.func,
  onShare: PropTypes.func,
  className: PropTypes.string,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired,
  autofocus: PropTypes.bool
};

ContextMenu.defaultProps = {
  isMfs: false,
  isOpen: false,
  isUnknown: false,
  top: 0,
  left: 0,
  right: 'auto',
  translateX: 0,
  translateY: 0,
  className: ''
};

export default withTranslation('files', { withRef: true })(ContextMenu);
