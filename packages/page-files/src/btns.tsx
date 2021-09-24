// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { CSSProperties, useCallback } from 'react';
import styled from 'styled-components';

import { Spinner } from '@polkadot/react-components';

export interface Props {
  className?: string,
  children?: React.ReactElement,
  label?: string,
  is2?: boolean,
  style?: CSSProperties,
  flex?: number,
  onClick?: () => void,
  isBuzy?: boolean,
  disable?: boolean
}

const NOOP = (): void => undefined;

function Btn ({ children, className, disable = false, is2, isBuzy, label, onClick = NOOP }: Props) {
  const content = label || children || '';
  const _onClick = useCallback(() => {
    if (disable || isBuzy) return;
    onClick();
  }, [onClick, disable, isBuzy]);

  return (
    <div
      className={`${className || ''} ${is2 ? 'highlight--border' : 'highlight--bg'}`}
      onClick={_onClick}>
      {
        isBuzy
          ? <Spinner noLabel />
          : content
      }
    </div>
  );
}

export const Button = React.memo<Props>(styled(Btn)`
  position: relative;
  cursor: pointer;
  color: white;
  padding: 1rem 1.5rem;
  font-size: 16px;
  display: flex;
  justify-content: center;

  & img {
    max-width: none;
  }

  ${(p) => p.flex !== undefined && `
     flex: ${p.flex};
  `};

  ${(p) => p.is2 && `
    background-color: white;
    color: black;
  `};

  ${(p) => p.disable && `
    cursor: not-allowed;
    color: #eeeeee !important;
    background: gray !important;
  `};

  ${(p) => p.isBuzy && `
    cursor: default;
    color: #eeeeee !important;
  `};
`);
