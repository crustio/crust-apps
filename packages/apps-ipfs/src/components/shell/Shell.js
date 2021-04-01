// [object Object]
// SPDX-License-Identifier: Apache-2.0

import classNames from 'classnames';
import React from 'react';

const Shell = ({ children,
  className,
  title = 'Shell' }) => {
  return (
    <div className={classNames('br1 overflow-hidden', className)}>
      <div className='f7 mb0 sans-serif ttu tracked charcoal pv1 pl2 bg-black-20'>{ title }</div>
      <div className='bg-black-70 snow pa2 f7 lh-copy monospace nowrap overflow-x-auto'>
        {children}
      </div>
    </div>
  );
};

export default Shell;
