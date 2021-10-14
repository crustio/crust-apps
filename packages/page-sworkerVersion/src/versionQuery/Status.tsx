// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { Badge } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  current: number;
  code: string;
}

function Status ({ current, code }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [expried, setExpried] = useState<boolean>(false);

  useEffect(() => {
    api.query.swork.codes(code).then(res => {
      const codeInfo = JSON.parse(JSON.stringify(res));
      if (codeInfo < current) {
        setExpried(true)
      }
    })
  }, [current])

  return (
    <>
      { expried ?
        (<Badge
            color='red'
            hover={
              <div>
                <p>{t<string>('The version is about to expire. Please upgrade it as soon as possible')}</p>
              </div>
            }
            icon='exclamation-triangle'
          />) : <Badge color='transparent' />
      }
    </>
  );
}

export default React.memo(Status);
