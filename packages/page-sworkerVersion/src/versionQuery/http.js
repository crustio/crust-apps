// Copyright 2017-2020 @polkadot/app-cruClaims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { base64Encode } from '@polkadot/util-crypto';
const MAX_RETRY = 3;
const RETRY_INTERVAL = 1000;

function sleep(ms){
  return new Promise((resolve)=>setTimeout(resolve,ms));
}

export async function httpPost(url, data, retry = MAX_RETRY) {
  let requireRetry;
  let res;
  try {
    res = await fetch(url, {
      method: 'post',
      mode: "cors",
      body: data,
      headers: {
        'Accept': 'application/json,text/plain,*/*',
        'Content-Type': 'application/json',
      },
    });
    const resultJson = await res.json();

    switch (res.status) {
      case 200:
        res = {
          code: 200,
          status: 'success',
          statusText: resultJson.message,
          statusCode: resultJson.code,
          resultStatus: resultJson.status
        };
        break;
      case 400:
        res = {
          code: 400,
          status: 'error',
          statusText: resultJson.message,
          statusCode: resultJson.code,
          resultStatus: resultJson.status
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
      statusText: 'ERR_CONNECTION_REFUSED',
      statusCode: 0,
      resultStatus: false
    };
  }
  if (requireRetry && retry > 0){
    await sleep(RETRY_INTERVAL);
    res = await httpPost(url, data, --retry);
  }
  return res;
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
      },
    });
    const resultJson = await res.json();
    switch (res.status) {
      case 200:
        res = {
          code: 200,
          status: 'success',
          statusText: resultJson.status,
          statusCode: resultJson.code
        };
        break;
      case 400:
        res = {
          code: 400,
          status: 'error',
          statusText: resultJson.status,
          statusCode: resultJson.code
        };
        break;
      case 409:
        requireRetry = true;
        res = {
          code: 409,
          status: 'error',
          statusText: resultJson.status,
          statusCode: resultJson.code
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
      statusText: false,
      statusCode: 0
    };
  }
  if (requireRetry && retry > 0){
    await sleep(RETRY_INTERVAL);
    res = await httpGet(url, --retry);
  }
  return res;
}
