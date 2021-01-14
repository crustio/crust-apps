// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './Popover.css';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Popover = ({ align, bottom, children, handleMouseEnter, handleMouseLeave, left, right, show, top }) => {
  return (
    <div aria-hidden={ show ? 'false' : 'true' }
      className={ classNames('popover absolute bg-white shadow-3', align && `popover--align-${align}`) }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
      style={{
        ...(top && { top }),
        ...(right && { right }),
        ...(bottom && { bottom }),
        ...(left && { left })
      }}
    >
      <div className='pa2'>
        { children }
      </div>
    </div>
  );
};

Popover.propTypes = {
  show: PropTypes.bool,
  top: PropTypes.string,
  right: PropTypes.string,
  bottom: PropTypes.string,
  left: PropTypes.string,
  align: PropTypes.string,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func
};

Popover.defaultProps = {
  show: false
};

export default Popover;
