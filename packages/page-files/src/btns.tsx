// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { CSSProperties } from 'react';
import styled from 'styled-components';

export interface Props {
  className?: string,
  children?: React.ReactElement,
  label?: string,
  is2?: boolean,
  style?: CSSProperties,
  flex?: number,
  onClick?: () => void,
}

const NOOP = (): void => undefined;

function Btn ({ children, className, is2, label, onClick = NOOP }: Props) {
  const content = label || children || '';

  return (
    <div
      className={`${className || ''} ${is2 ? 'highlight--border' : 'highlight--bg'}`}
      onClick={onClick}>
      {content}
    </div>
  );
}

export const Button = React.memo<Props>(styled(Btn)`
  cursor: pointer;
  color: white;
  padding: 1rem 1.5rem;
  font-size: 16px;
  display: flex;
  justify-content: center;

  ${(p) => p.flex !== undefined && `
     flex: ${p.flex};
  `}
  ${(p) => p.is2 && `
    background-color: white;
    color: black;
  `}
`);
