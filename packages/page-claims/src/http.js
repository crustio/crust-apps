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

export function httpPost(url,data){
  return fetch(url, {
    method: 'post',
    mode: "cors",
    headers: {
      'Accept': 'application/json,text/plain,*/*',
      'Content-Type': 'application/json'
    },
  }).then((response) => {
    console.log('response', response)
    return response
  }).then((data) => {
    if (data.status == 200) {
      return {
        code: 200,
        status: 'success',
        statusText: data.statusText
      };   
    }
    return {
      code: 400,
      status: 'error',
      statusText: data.statusText
    };   
  }).catch(function (error) {
    return {
      code: 400,
      status: 'error',
      statusText: error
    }
  })
}
