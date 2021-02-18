// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export function cidStartAndEnd (value) {
  const chars = value.split('');

  if (chars.length <= 9) return value;
  const start = chars.slice(0, 4).join('');
  const end = chars.slice(chars.length - 4).join('');

  return {
    value,
    start,
    end
  };
}

export function shortCid (value) {
  const { end, start } = cidStartAndEnd(value);

  return `${start}…${end}`;
}

const Cid = ({ identicon = false, style, title, value, ...props }) => {
  style = Object.assign({}, {
    textDecoration: 'none',
    marginLeft: identicon ? '5px' : null
  }, style);
  const { end, start } = cidStartAndEnd(value);

  return (
    <abbr style={style}
      title={title || value}
      {...props}>
      <span className='v-mid'>
        <span>{start}</span>
        <span className='o-20'>…</span>
        <span>{end}</span>
      </span>
    </abbr>
  );
};

export default Cid;
