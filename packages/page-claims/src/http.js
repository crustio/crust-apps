// Copyright 2017-2020 @polkadot/app-cruClaims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
export function httpGet(url){
  return fetch(url).then((response) => {
    return response.json()
  }).then((data) => {
    return {
      status: "success",
      result: data
    };
  }).catch(function (error) {
    return {
      status: "error",
      result: error
    }
  })
}

const MAX_RETRY = 3;
const RETRY_INTERVAL = 1000; 

function sleep(ms){
  return new Promise((resolve)=>setTimeout(resolve,ms));
}

export async function httpPost(url, retry = MAX_RETRY) {
  let requireRetry;
  let res;
  try {
    res = await fetch(url, {
      method: 'post',
      mode: "cors",
      headers: {
        'Accept': 'application/json,text/plain,*/*',
        'Content-Type': 'application/json'
      },
    });
    switch (res.status) {
      case 200:
        res = {
          code: 200,
          status: 'success',
          statusText: 'You has a valid claim'
        };
        break;
      case 400:
        requireRetry = true;
        res = {
          code: 400,
          status: 'error',
          statusText: 'Does not appear to have a valid claim. Please double check that you have signed the transaction correctly on the correct ETH account.'
        };
        break;
    }
  } catch {
    console.log(err)
    requireRetry = true;
  }
  if (requireRetry && retry > 0){
    await sleep(RETRY_INTERVAL);
    res = await httpPost(url, --retry);
  }
  return res;
}
