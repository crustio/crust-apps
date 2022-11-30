"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _definitions = _interopRequireWildcard(require("@logion/node-api/dist/interfaces/definitions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

const defaultTypesUpTo109 = {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  PeerId: '(Vec<u8>)',
  AccountInfo: 'AccountInfoWithDualRefCount',
  TAssetBalance: 'u128',
  AssetId: 'u64',
  AssetDetails: {
    owner: 'AccountId',
    issuer: 'AccountId',
    admin: 'AccountId',
    freezer: 'AccountId',
    supply: 'Balance',
    deposit: 'DepositBalance',
    max_zombies: 'u32',
    min_balance: 'Balance',
    zombies: 'u32',
    accounts: 'u32',
    is_frozen: 'bool'
  },
  AssetMetadata: {
    deposit: 'DepositBalance',
    name: 'Vec<u8>',
    symbol: 'Vec<u8>',
    decimals: 'u8'
  },
  LocId: 'u128',
  LegalOfficerCaseOf: {
    owner: 'AccountId',
    requester: 'Requester',
    metadata: 'Vec<MetadataItem>',
    files: 'Vec<File>',
    closed: 'bool',
    loc_type: 'LocType',
    links: 'Vec<LocLink>',
    void_info: 'Option<LocVoidInfo<LocId>>',
    replacer_of: 'Option<LocId>',
    collection_last_block_submission: 'Option<BlockNumber>',
    collection_max_size: 'Option<CollectionSize>'
  },
  MetadataItem: {
    name: 'Vec<u8>',
    value: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocType: {
    _enum: ['Transaction', 'Identity', 'Collection']
  },
  LocLink: {
    id: 'LocId',
    nature: 'Vec<u8>'
  },
  File: {
    hash: 'Hash',
    nature: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocVoidInfo: {
    replacer: 'Option<LocId>'
  },
  StorageVersion: {
    _enum: ['V1', 'V2MakeLocVoid', 'V3RequesterEnum', 'V4ItemSubmitter', 'V5Collection']
  },
  Requester: {
    _enum: {
      None: null,
      Account: 'AccountId',
      Loc: 'LocId'
    }
  },
  CollectionSize: 'u32',
  CollectionItemId: 'Hash',
  CollectionItem: {
    description: 'Vec<u8>'
  }
};
const defaultTypesUpTo111 = {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  PeerId: '(Vec<u8>)',
  AccountInfo: 'AccountInfoWithDualRefCount',
  TAssetBalance: 'u128',
  AssetId: 'u64',
  AssetDetails: {
    owner: 'AccountId',
    issuer: 'AccountId',
    admin: 'AccountId',
    freezer: 'AccountId',
    supply: 'Balance',
    deposit: 'DepositBalance',
    max_zombies: 'u32',
    min_balance: 'Balance',
    zombies: 'u32',
    accounts: 'u32',
    is_frozen: 'bool'
  },
  AssetMetadata: {
    deposit: 'DepositBalance',
    name: 'Vec<u8>',
    symbol: 'Vec<u8>',
    decimals: 'u8'
  },
  LocId: 'u128',
  LegalOfficerCaseOf: {
    owner: 'AccountId',
    requester: 'Requester',
    metadata: 'Vec<MetadataItem>',
    files: 'Vec<File>',
    closed: 'bool',
    loc_type: 'LocType',
    links: 'Vec<LocLink>',
    void_info: 'Option<LocVoidInfo<LocId>>',
    replacer_of: 'Option<LocId>',
    collection_last_block_submission: 'Option<BlockNumber>',
    collection_max_size: 'Option<CollectionSize>',
    collection_can_upload: 'bool'
  },
  MetadataItem: {
    name: 'Vec<u8>',
    value: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocType: {
    _enum: ['Transaction', 'Identity', 'Collection']
  },
  LocLink: {
    id: 'LocId',
    nature: 'Vec<u8>'
  },
  File: {
    hash: 'Hash',
    nature: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocVoidInfo: {
    replacer: 'Option<LocId>'
  },
  StorageVersion: {
    _enum: ['V1', 'V2MakeLocVoid', 'V3RequesterEnum', 'V4ItemSubmitter', 'V5Collection', 'V6ItemUpload']
  },
  Requester: {
    _enum: {
      None: null,
      Account: 'AccountId',
      Loc: 'LocId'
    }
  },
  CollectionSize: 'u32',
  CollectionItemId: 'Hash',
  CollectionItem: {
    description: 'Vec<u8>',
    files: 'Vec<CollectionItemFile<Hash>>'
  },
  CollectionItemFile: {
    name: 'Vec<u8>',
    content_type: 'Vec<u8>',
    fileSize: 'u32',
    hash: 'Hash'
  }
};
const defaultTypesUpTo116 = {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  OpaquePeerId: 'Vec<u8>',
  AccountInfo: 'AccountInfoWithDualRefCount',
  TAssetBalance: 'u128',
  AssetId: 'u64',
  AssetDetails: {
    owner: 'AccountId',
    issuer: 'AccountId',
    admin: 'AccountId',
    freezer: 'AccountId',
    supply: 'Balance',
    deposit: 'DepositBalance',
    max_zombies: 'u32',
    min_balance: 'Balance',
    zombies: 'u32',
    accounts: 'u32',
    is_frozen: 'bool'
  },
  AssetMetadata: {
    deposit: 'DepositBalance',
    name: 'Vec<u8>',
    symbol: 'Vec<u8>',
    decimals: 'u8'
  },
  LocId: 'u128',
  LegalOfficerCaseOf: {
    owner: 'AccountId',
    requester: 'Requester',
    metadata: 'Vec<MetadataItem>',
    files: 'Vec<File>',
    closed: 'bool',
    loc_type: 'LocType',
    links: 'Vec<LocLink>',
    void_info: 'Option<LocVoidInfo<LocId>>',
    replacer_of: 'Option<LocId>',
    collection_last_block_submission: 'Option<BlockNumber>',
    collection_max_size: 'Option<CollectionSize>',
    collection_can_upload: 'bool'
  },
  MetadataItem: {
    name: 'Vec<u8>',
    value: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocType: {
    _enum: ['Transaction', 'Identity', 'Collection']
  },
  LocLink: {
    id: 'LocId',
    nature: 'Vec<u8>'
  },
  File: {
    hash: 'Hash',
    nature: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocVoidInfo: {
    replacer: 'Option<LocId>'
  },
  StorageVersion: {
    _enum: ['V1', 'V2MakeLocVoid', 'V3RequesterEnum', 'V4ItemSubmitter', 'V5Collection', 'V6ItemUpload', 'V7ItemToken']
  },
  Requester: {
    _enum: {
      None: null,
      Account: 'AccountId',
      Loc: 'LocId'
    }
  },
  CollectionSize: 'u32',
  CollectionItemId: 'Hash',
  CollectionItem: {
    description: 'Vec<u8>',
    files: 'Vec<CollectionItemFile<Hash>>',
    token: 'Option<CollectionItemToken>',
    restricted_delivery: 'bool'
  },
  CollectionItemFile: {
    name: 'Vec<u8>',
    content_type: 'Vec<u8>',
    fileSize: 'u32',
    hash: 'Hash'
  },
  CollectionItemToken: {
    token_type: 'Vec<u8>',
    token_id: 'Vec<u8>'
  }
};
const definitions = {
  alias: {
    loAuthorityList: {
      StorageVersion: 'LoAuthorityListStorageVersion'
    }
  },
  types: [{
    minmax: [0, 109],
    types: {
      ...defaultTypesUpTo109,
      ..._definitions.session.types
    }
  }, {
    minmax: [110, 111],
    types: {
      ...defaultTypesUpTo111,
      ..._definitions.session.types
    }
  }, {
    minmax: [112, 116],
    types: {
      ...defaultTypesUpTo116,
      ..._definitions.session.types
    }
  }, {
    // Latest
    minmax: [117, undefined],
    types: {
      ..._definitions.default.types,
      ..._definitions.session.types
    }
  }]
};
var _default = definitions;
exports.default = _default;