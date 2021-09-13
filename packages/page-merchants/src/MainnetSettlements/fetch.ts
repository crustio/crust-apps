// Copyright 2017-2021 @polkadot/page-merchants authors & contributors
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";

const CAPACITY_UNIT = 1024*1024;

const API_KEY = process.env.API_KEY;

export const OrderStatusQueryEnum = {
  SUCCESS: 1, // not expired
  FAILED: 2, // expired less than 15 day
  EXPIRED: 3 // expired more than 15 day
}

const claimedStatus = {
  Renewable: 'Renewable', 
  Settlementable: 'Settlementable', 
  InValid: 'InValid'
}

interface FilesToBeClaimed {
  cid: string,
  fileSize: string,
  expiredTime: number,
  replicas: number,
  renewReward: number,
  settlementReward: number,
  status: string
}

export interface QuestOptions {
  row: number;
  page: number;
  address?: string[]
  order?: string;
  expired_status?: number
}

export interface FileStatus {
  valid: false;
  expiredWithin15Days: false;
  expired15Days: false;
}

export interface OrderInfo {
  filePrice: number, 
  currentBn: number, 
  renewRewardRatio: number, 
  fileDuration: number, 
  baseFee: number
}

export async function fetchFileTobeClaimed (opt: QuestOptions, { filePrice, currentBn, renewRewardRatio, fileDuration, baseFee } : OrderInfo, fileStatus: FileStatus) {

  return fetch('https://crust.api.subscan.io/api/scan/swork/orders', {
    method: 'post',
    headers: {
      'Accept': 'application/json,text/plain,*/*',
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY as string
    },
    body: JSON.stringify(opt)
  })
    .then((res) => res.json())
    .then((r: any) => {
      if (r.message === 'Success') {
        console.log('fileDuration', fileDuration)
        console.log('fileStatus', fileStatus)
        const result = [];
        let total = r.data.count;
        let tmp = r.data.list;
        let validOrders = []
        let expiredWithin15DaysOrders = []
        let expired15DaysOrders = [];
        let list: any[] = [];
        if (tmp) {
          if (!fileStatus.valid && !fileStatus.expiredWithin15Days && !fileStatus.expired15Days) {
            list = tmp
          } else {
            if (fileStatus.valid) {
              validOrders = _.filter(tmp, e => {
                return e.expired_at > currentBn
              })
            }
            if (fileStatus.expiredWithin15Days) {
              expiredWithin15DaysOrders = _.filter(tmp, e => {
                return e.expired_at <= currentBn && e.expired_at > (currentBn - fileDuration)
              })
            }
            if (fileStatus.expired15Days) {
              expired15DaysOrders = _.filter(tmp, e => {
                return e.expired_at <= (currentBn - fileDuration)
              })
            }
            list = _.concat(validOrders, expiredWithin15DaysOrders, expired15DaysOrders)
          }
          for (const file of list) {
            result.push(fileClaimedStructure({
              file_size: Number(file.file_size),
              cid: file.cid,
              prepaid: Number(file.prepaid),
              expired_on: file.expired_at,
              amount: Number(file.amount),
              replicas: file.replicas,
            }, filePrice, currentBn, renewRewardRatio, fileDuration, baseFee))
          }
        }
        return {
          list: _.uniqBy(result, 'cid'),
          total 
        };
      } else {
        return {
          list: [],
          total: 0 
        };
      }
    });
}

function fileClaimedStructure(file: { file_size: number; prepaid: number; expired_on: number; amount: any; replicas: number; cid: any; }, filePrice: number, currentBn: number, renewRewardRatio: number, fileDuration: number, baseFee: number): FilesToBeClaimed {
  const orderPrice = calculateOrderPrice(file.file_size, filePrice, baseFee);
  let renewReward = 0;
  let settlementReward = 0;
  let status = claimedStatus.InValid;
  if (file.prepaid > _.multiply(orderPrice, 1 + renewRewardRatio)) {
      renewReward = calculateRenewReward(orderPrice, renewRewardRatio);
      status = claimedStatus.Renewable
  } else if (file.expired_on < currentBn && file.expired_on < (currentBn - fileDuration)) {
      status = claimedStatus.Settlementable
  }
  
  settlementReward = calculateSettlementReward(currentBn, file.expired_on, file.amount, fileDuration);
  if (settlementReward == 0 && renewReward == 0) {
      status = claimedStatus.InValid;
  }
  return {
      cid: file.cid,
      fileSize: file.file_size.toString(),
      expiredTime: file.expired_on,
      replicas: file.replicas,
      renewReward,
      settlementReward,
      status 
  }
}

function calculateOrderPrice(fileSize: number, filePrice: number, basefee: number) {
  let tmp = _.divide(fileSize, CAPACITY_UNIT);
  tmp = _.multiply(tmp, filePrice)
  return _.add(tmp, basefee)
}

function calculateRenewReward(orderPrice: number, renewRewardRatio: number) {
  return _.multiply(orderPrice, renewRewardRatio);
}

function calculateSettlementReward(crrentBN: number, expiredBN: number, amount: any, fileDuration: number) {
  let tmp = _.subtract(crrentBN, expiredBN);
  tmp = _.subtract(tmp, fileDuration);
  tmp = Math.max(tmp, 0);
  tmp = Math.min(_.divide(tmp, fileDuration), 1);
  return _.multiply(tmp, amount);
}
