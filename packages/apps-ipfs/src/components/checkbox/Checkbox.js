// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './Checkbox.css';

import PropTypes from 'prop-types';
import React from 'react';

import Tick from '../../icons/GlyphSmallTick';

const Checkbox = ({ checked, className, disabled, label, onChange, ...props }) => {
  className = `Checkbox dib sans-serif ${className}`;

  if (!disabled) {
    className += ' pointer';
  }

  const change = (event) => {
    onChange(event.target.checked);
  };

  return (
    <label className={className}
      {...props}>
      <input checked={checked}
        className='absolute'
        disabled={disabled}
        onChange={change}
        type='checkbox' />
      <span className='dib v-mid br1 w1 h1 pointer'>
        <Tick className='w1 h1 o-0 fill-aqua'
          viewBox='25 25 50 50' />
      </span>
      <span className='v-mid pl2'>
        {label}
      </span>
    </label>
  );
};

Checkbox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

Checkbox.defaultProps = {
  className: '',
  label: '',
  disabled: false,
  checked: null,
  onChange: () => {}
};

export default Checkbox;
