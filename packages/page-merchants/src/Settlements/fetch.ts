// Copyright 2017-2021 @polkadot/page-merchants authors & contributors
// SPDX-License-Identifier: Apache-2.0

const headers = new Headers();

headers.append('Authorization', 'Basic Y3J1c3Q6MTYyNTM0');
const requestOptions = {
  headers,
  method: 'GET'
};

interface IRes<ISettlement> {
  message: string,
  data: ISettlement[]
}

export function fetchFileTobeClaimed<ISettlement> (): Promise<ISettlement[]> {
  return fetch('https://splorer-api.crust.network/api/filesToBeClaimed', requestOptions)
    .then((res) => res.json())
    .then((r: IRes<ISettlement>) => {
      console.log(r);

      if (r.message === 'success') {
        return r.data;
      } else {
        return [] as ISettlement[];
      }
    });
}