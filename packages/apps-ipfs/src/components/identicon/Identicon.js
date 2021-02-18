// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { colors } from 'ipfs-css/theme.json';
import React from 'react';
import ReactIdenticon from 'react-identicons';

const identiconPalette = [colors.navy, colors.aqua, colors.gray, colors.charcoal, colors.red, colors.yellow, colors.teal, colors.green];

const Identicon = ({ cid, className = 'v-btm', size = 14 }) => <ReactIdenticon className={className}
  palette={identiconPalette}
  size={size}
  string={cid} />;

export default Identicon;
