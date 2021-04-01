// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Button from '../button/Button';

const AskToEnable = ({ className, detailsLabel = 'More info...', detailsLink, label, noLabel, onNo, onYes, yesLabel }) => {
  return (
    <div className={`f6 pv3 pv2-ns ph3 tc bg-snow charcoal ${className}`}>
      <span className='fw4 lh-copy dib mb2'>
        {label}
        {detailsLink && (
          <a className='dib focus-outline link blue ml2'
            href={detailsLink}>
            {detailsLabel}
          </a>
        )}
      </span>
      <span className='dib'>
        <Button bg={'bg-green'}
          className='ml3 mv1 tc'
          onClick={onYes}>{yesLabel}</Button>
        <Button bg={'bg-snow-muted'}
          className='ml3 mv1 tc'
          color='charcoal'
          onClick={onNo}>{noLabel}</Button>
      </span>
    </div>
  );
};

export default AskToEnable;
