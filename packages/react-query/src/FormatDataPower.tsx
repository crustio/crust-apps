// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isShort?: boolean;
  label?: React.ReactNode;
  labelPost?: string;
  value?: number;
}
const sizes = ['BP', 'KP', 'MP', 'GP', 'TP', 'PP', 'EP', 'ZP', 'YP'];
const k = 1024;

function format (value: number): React.ReactNode {
  if (value === 0 || Number(value) === 0) return '0 BP';
  const i = Math.floor(Math.log(value) / Math.log(k));
  const unitPost = sizes[i];

  const postfix = (value / Math.pow(k, i)).toFixed(3);

  return <>{<span className='ui--FormatBalance-postfix'>{`${postfix || ''}`}</span>}<span className='ui--FormatBalance-unit'> {unitPost}</span></>;
}

function FormatDataPower ({ children, className = '', label, labelPost, value }: Props): React.ReactElement<Props> {
  // labelPost here looks messy, however we ensure we have one less text node
  return (
    <div className={`ui--FormatBalance ${className}`}>
      {label || ''}<span className='ui--FormatBalance-value'>{
        value
          ? format(value)
          : `-${labelPost || ''}`
      }</span>{children}
    </div>
  );
}

export default React.memo(styled(FormatDataPower)`
  display: inline-block;
  vertical-align: baseline;
  white-space: nowrap;

  * {
    vertical-align: baseline !important;
  }

  > label,
  > .label {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: baseline;
  }

  .ui--FormatBalance-unit {
    font-size: 0.85em;
  }

  .ui--FormatBalance-value {
    text-align: right;

    > .ui--FormatBalance-postfix {
      font-weight: 100;
      opacity: 0.7;
      vertical-align: baseline;
    }
  }

  > .ui--Button {
    margin-left: 0.25rem;
  }

  .ui--Icon {
    margin-bottom: -0.25rem;
    margin-top: 0.25rem;
  }

  .ui--Icon+.ui--FormatBalance-value {
    margin-left: 0.375rem;
  }
`);
