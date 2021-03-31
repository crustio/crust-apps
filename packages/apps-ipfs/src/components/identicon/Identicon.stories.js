// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { checkA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Identicon from './Identicon';

storiesOf('Identicon', module)
  .addDecorator(checkA11y)
  .add('Identicon', () => (
    <Identicon cid={'QmYPNmahJAvkMTU6tDx5zvhEkoLzEFeTDz6azDCSNqzKkW'}
      className='ma2'
      onClick={action('click')} />
  ));
