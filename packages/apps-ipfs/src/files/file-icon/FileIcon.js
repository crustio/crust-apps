// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import DocCalc from '../../icons/GlyphDocCalc';
import Doc from '../../icons/GlyphDocGeneric';
import DocMovie from '../../icons/GlyphDocMovie';
import DocMusic from '../../icons/GlyphDocMusic';
import DocPicture from '../../icons/GlyphDocPicture';
import DocText from '../../icons/GlyphDocText';
import Folder from '../../icons/GlyphFolder';
import Cube from '../../icons/StrokeCube';
import typeFromExt from '../type-from-ext';

const style = { width: 36 };

export default function FileIcon ({ cls = '', name, type }) {
  if (type === 'directory') {
    return <Folder className={`fill-aqua ${cls}`}
      style={style} />;
  }

  if (type === 'unknown') {
    return <Cube className={`fill-aqua ${cls}`}
      style={style} />;
  }

  switch (typeFromExt(name)) {
    case 'audio':
      return <DocMusic className={`fill-aqua ${cls}`}
        style={style} />;
    case 'calc':
      return <DocCalc className={`fill-aqua ${cls}`}
        style={style} />;
    case 'video':
      return <DocMovie className={`fill-aqua ${cls}`}
        style={style} />;
    case 'text':
      return <DocText className={`fill-aqua ${cls}`}
        style={style} />;
    case 'image':
      return <DocPicture className={`fill-aqua ${cls}`}
        style={style} />;
    default:
      return <Doc className={`fill-aqua ${cls}`}
        style={style} />;
  }
}
