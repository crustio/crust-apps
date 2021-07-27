// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { Dropdown as Drop, DropdownMenu as Menu } from '@tableflip/react-dropdown';
import React, { forwardRef } from 'react';

import StrokeCode from '../../icons/StrokeCode';

export const Option = ({ children, className = '', isCliTutorModeEnabled, onCliTutorMode, onClick, ...props }) => (
  isCliTutorModeEnabled
    ? <div className='flex items-center justify-between'>
      <button className={`bg-animate hover-bg-near-white pa2 pointer flex items-center flex-grow-1 ${className}`}
        onClick={onClick}
        role='menuitem'
        {...props}>
        {children}
      </button>
      <button {...props}
        className={`bg-animate hover-bg-near-white pa2 pointer flex items-center  ${className}`}>
        <StrokeCode {...props}
          className='dib fill-link pointer'
          onClick={() => onCliTutorMode(true)}
          style={{ height: 38 }}/>
      </button>
    </div>
    : <button className={`bg-animate hover-bg-near-white pa2 pointer flex items-center ${className}`}
      onClick={onClick}
      role='menuitem'
      {...props}>
      {children}
    </button>
);

export const DropdownMenu = forwardRef((props, ref) => {
  const { arrowMarginRight, children, translateX = 0, translateY = 0, width = 200, ...rest } = props;

  return (
    <Menu
      arrowAlign='right'
      arrowMarginRight={arrowMarginRight || '13px'}
      className='sans-serif br2 charcoal menu-box-shadow'
      left={`calc(100% - ${width}px)`}
      translateX={translateX}
      translateY={translateY}
      width={width}
      {...rest}>
      <div className='flex flex-column'
        ref={ref}
        role='menu'>
        {children}
      </div>
    </Menu>
  );
});

export const Dropdown = Drop;
