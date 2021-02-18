// [object Object]
// SPDX-License-Identifier: Apache-2.0
import 'details-polyfill';

import React from 'react';

const Details = ({ children,
  summaryText = 'Advanced',
  ...props }) => {
  return (
    <details {...props}>
      <summary className='pointer blue outline-0'>{summaryText}</summary>
      {children}
    </details>
  );
};

export default Details;
