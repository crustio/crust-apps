// [object Object]
// SPDX-License-Identifier: Apache-2.0
import CID from 'cids';
import { Pin } from 'ipfs';

// ts-ignore
import { Perform, Spawn } from '../task.js';

export type { Perform, Spawn };

export type Model = {
  pageContent: null | PageContent
  pins: string[]
  contracts: string[]
  sorting: Sorting
  mfsSize: number

  pending: PendingJob<any, any>[]
  finished: FinishedJob<any>[]
  failed: FailedJob[]
}

export interface JobInfo {
  type: Message['type']
  id: symbol
  start: number
}

export interface PendingJob<M, I> extends JobInfo {
  status: 'Pending'
  init: I
  message?: M
}

export interface FailedJob extends JobInfo {
  status: 'Failed'
  error: Error
  end: number
}

export interface FinishedJob<T> extends JobInfo {
  status: 'Done'
  value: T
  end: number
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
  | Perform<'FILES_FETCH', Error, PageContent, void>
  | MakeDir
  | Delete
  | Move
  | Write
  | AddByPath
  | DownloadLink
  | Perform<'FILES_SHARE_LINK', Error, string, void>
  | Perform<'FILES_COPY', Error, void, void>
  | Perform<'FILES_PIN_ADD', Error, Pin[], void>
  | Perform<'FILES_PIN_REMOVE', Error, Pin[], void>
  | Perform<'FILES_PIN_LIST', Error, { pins: CID[] }, void>
  | Perform<'FILES_CONTRACT_LIST', Error, { pins: CID[] }, void>
  | Perform<'FILES_SIZE_GET', Error, { size: number }, void>

export type MakeDir = Perform<'FILES_MAKEDIR', Error, void, void>
export type WriteProgress = { paths: string[], progress: number }
export type Write = Spawn<'FILES_WRITE', WriteProgress, Error, void, void>
export type AddByPath = Perform<'FILES_ADDBYPATH', Error, void, void>
export type Move = Perform<'FILES_MOVE', Error, void, void>
export type Delete = Perform<'FILES_DELETE', Error, void, void>
export type DownloadLink = Perform<'FILES_DOWNLOADLINK', Error, FileDownload, void>

export type FileDownload = {
  url: string
  filename: string
}

type FileType = 'directory' | 'file' | 'unknown'

type Time = number

type FileStat = {
  size: number,
  type: FileType,
  cid: CID,
  name: string,
  path: string,
  pinned: boolean
  isParent: boolean | void
}

export type PageContent =
  | UnknownContent
  | FileContent
  | DirectoryContent

type UnknownContent = {
  type: 'unknown',
  fetched: Time,
  path: string,
  cid: CID,
  size: 0
}

type FileContent = {
  type: 'file',
  fetched: Time,
  path: string,
  cid: CID,
  size: number,

  name: string,
  pinned: boolean
}

type DirectoryContent = {
  type: 'directory',
  fetched: Time,
  path: string,
  cid: CID,

  content: FileStat[]
  upper: void | FileStat,
}

export type Job<K, P, X, T> = {
  type: K,
  job: JobState<P, X, T>
}

export type JobState<P, X, T> =
  | { status: 'Idle', id: symbol }
  | { status: 'Active', id: symbol, state: P }
  | { status: 'Failed', id: symbol, error: X }
  | { status: 'Done', id: symbol, value: T }
