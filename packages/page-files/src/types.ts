// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface UploadRes {
  Hash: string,
  Size: string,
  Name: string,
  items?: UploadRes[],
}

export interface SaveFile extends UploadRes {
  UpEndpoint: string,
  PinEndpoint?: string,
  Account?: string,
}

export interface DirFile extends File {
  webkitRelativePath: string,
}

export interface FileInfo {
  file?: File,
  files?: DirFile[],
  dir?: string,
}
