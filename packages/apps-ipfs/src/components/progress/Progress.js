// [object Object]
// SPDX-License-Identifier: Apache-2.0

import './Progress.css';
import React from 'react/index';

export default function Progress ({ progress }) {
  return <div className={'file-progress'}>
    <div className='file-progress-bar' style={{ width: `${progress}%` }}/>
  </div>;
}
