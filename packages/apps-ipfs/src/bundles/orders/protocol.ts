// [object Object]
// SPDX-License-Identifier: Apache-2.0
import CID from 'cids';

export type Model = {
  orders: Order[]
}

export type Sorting = {
  by: SortBy,
  asc: boolean
}

export type SortBy = 'name' | 'size'

export type Message =
  | { type: 'FILES_CLEAR_ALL' }
  | { type: 'FILES_DISMISS_ERRORS' }
  | { type: 'FILES_UPDATE_SORT', payload: Sorting }

type OrderStatus = 'success' | 'expired' | 'pending'

interface Order {
  cid: CID,
  fileSize: string,
  startTime: string,
  expireTime: string,
  status: OrderStatus,
  copies: number
}
