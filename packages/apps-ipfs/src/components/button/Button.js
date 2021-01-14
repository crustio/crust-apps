// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './Button.css';

import React from 'react';

const Button = ({ bg = 'bg-teal', children, className = '', color = 'white', danger, disabled, fill = 'white', minWidth = 86, style, ...props }) => {
  const bgClass = danger ? 'bg-red' : disabled ? 'bg-gray-muted' : bg;
  const fillClass = danger ? 'fill-white' : disabled ? 'fill-snow' : fill;
  const colorClass = danger ? 'white' : disabled ? 'light-gray' : color;
  const cls = `Button transition-all sans-serif dib v-mid fw5 nowrap lh-copy bn br1 pa2 focus-outline ${fillClass} ${bgClass} ${colorClass} ${className}`;

  return (
    <button className={cls}
      disabled={disabled}
      style={{ minWidth, ...style }}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
