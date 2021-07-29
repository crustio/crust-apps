// Copyright 2017-2020 @polkadot/app-cruClaims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { base64Encode } from '@polkadot/util-crypto';
const MAX_RETRY = 3;
const RETRY_INTERVAL = 1000;
const USERNAME = process.env.CSM_LOCKING_USER; 
const PASSWD = process.env.CSM_LOCKING_PASSWD

function sleep(ms){
  return new Promise((resolve)=>setTimeout(resolve,ms));
}

export async function httpGet(url, retry = MAX_RETRY) {
  let requireRetry;
  let res;
  try {
    res = await fetch(url, {
      method: 'get',
      mode: "cors",
      headers: {
        'Accept': 'application/json,text/plain,*/*',
        'Content-Type': 'application/json',
        "Authorization": "Basic " + base64Encode(`${USERNAME}:${PASSWD}`)
      },
    });
    const resultJson = await res.json();
    switch (res.status) {
      case 200:
        res = {
          code: 200,
          status: 'success',
          statusText: resultJson
        };
        break;
      case 400:
        res = {
          code: 400,
          status: 'error',
          statusText: resultJson
        };
        break;
      case 409:
        requireRetry = true;
        res = {
          code: 409,
          status: 'error',
          statusText: 'Network is busy'
        };
        break;
      default:
        break;
    }
  } catch {
    requireRetry = true;
    res = {
      code: 400,
      status: 'error',
      statusText: 'ERR_CONNECTION_REFUSED'
    };
  }
  if (requireRetry && retry > 0){
    await sleep(RETRY_INTERVAL);
    res = await httpGet(url, --retry);
  }
  return res;
}

export async function httpPost(url, data, retry = MAX_RETRY) {
  let requireRetry;
  let res;
  try {
    res = await fetch(url, {
      method: 'post',
      mode: "cors",
      headers: {
        'Accept': 'application/json, text/plain,*/*',
        'Content-Type': 'application/json',
        "Authorization": "Basic " + base64Encode(`${USERNAME}:${PASSWD}`)
      },
      body: JSON.stringify(data)
    });
    const resultJson = await res.json();
    switch (res.status) {

      case 200:
        res = {
          code: 200,
          status: 'success',
          statusText: resultJson
        };
        break;
      case 400:
        res = {
          code: 400,
          status: 'error',
          statusText: resultJson
        };
        break;
      case 409:
        requireRetry = true;
        res = {
          code: 409,
          status: 'error',
          statusText: 'Network is busy'
        };
        break;
      default:
        break;
    }
  } catch {
    requireRetry = true;
    res = {
      code: 400,
      status: 'error',
      statusText: 'ERR_CONNECTION_REFUSED'
    };
  }
  if (requireRetry && retry > 0){
    await sleep(RETRY_INTERVAL);
    res = await httpPost(url, data, --retry);
  }
  return res;
}
