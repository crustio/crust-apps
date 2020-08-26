// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import queryString from 'query-string';
import store from 'store';
import { createEndpoints } from '@polkadot/apps-config/settings';
import { extractIpfsDetails } from '@polkadot/react-hooks/useIpfs';
import settings from '@polkadot/ui-settings';
// import { registry } from '@polkadot/react-api';

function getApiUrl (): string {
  // we split here so that both these forms are allowed
  //  - http://localhost:3000/?rpc=wss://substrate-rpc.parity.io/#/explorer
  //  - http://localhost:3000/#/explorer?rpc=wss://substrate-rpc.parity.io
  const urlOptions = queryString.parse(location.href.split('?')[1]);

  // if specified, this takes priority
  if (urlOptions.rpc) {
    if (Array.isArray(urlOptions.rpc)) {
      throw new Error('Invalid WS endpoint specified');
    }

    return urlOptions.rpc.split('#')[0]; // https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer;
  }

  const endpoints = createEndpoints(<T = string>(): T => ('' as unknown as T));
  const { ipnsChain } = extractIpfsDetails();

  // check against ipns domains (could be expanded to others)
  if (ipnsChain) {
    const option = endpoints.find(({ dnslink }) => dnslink === ipnsChain);

    if (option) {
      return option.value as string;
    }
  }

  const stored = store.get('settings') as Record<string, unknown> || {};
  const fallbackUrl = endpoints.find(({ value }) => !!value);

  // via settings, or the default chain
  return [stored.apiUrl, process.env.WS_URL].includes(settings.apiUrl)
    ? settings.apiUrl // keep as-is
    : fallbackUrl
      ? fallbackUrl.value as string // grab the fallback
      : 'ws://127.0.0.1:9944'; // nothing found, go local
}

const apiUrl = getApiUrl();

// set the default as retrieved here
settings.set({ apiUrl });

// try {
//   const types = store.get('types') as Record<string, Record<string, string>> || {};
//   const names = Object.keys(types);

//   // register these anyway
//   registry.register({
//     TeeCode: 'Vec<u8>',
//     Identity: {
//       pub_key: 'Vec<u8>',
//       code: 'Vec<u8>',
//     },
//     WorkReport: {
//       block_number: 'u64',
//       used: 'u64',
//       reserved: 'u64',
//       cached_reserved: 'u64',
//       files: 'Vec<(Vec<u8>, u64)>',
//     },
//     StakingLedger: {
//       stash: 'AccountId',
//       total: 'Compact<Balance>',
//       active: 'Compact<Balance>',
//       // valid: 'Compact<Balance>',
//       unlocking: 'Vec<UnlockChunk>',
//       claimed_rewards: 'Vec<EraIndex>'
//     },
//     Validations: {
//       total: 'Compact<Balance>',
//       guarantee_fee: 'Compact<Perbill>',
//       guarantors: 'Vec<AccountId>',
//     },
//     Nominations: {
//       targets: 'Vec<AccountId>',
//       total: 'Compact<Balance>',
//       submitted_in: 'u32',
//       suppressed: 'bool'
//     },
//     Guarantee: {
//       targets: 'Vec<IndividualExposure<AccountId, Balance>>',
//       total: 'Balance',
//       submitted_in: 'u32',
//       suppressed: 'bool'
//     },
//     ReportSlot: 'u64',
//     AddressInfo: 'Vec<u8>',
//     MerkleRoot: 'Vec<u8>',
//     Provision: {
//       address: 'Vec<u8>',
//       storage_price: 'Balance',
//       file_map: 'Vec<(Vec<u8>, Vec<Hash>)>'
//     },
//     OrderStatus: {
//       _enum: ['Success', 'Failed', 'Pending']
//     },
//     StorageOrder: {
//       file_identifier: 'Vec<u8>',
//       file_size: 'u64',
//       created_on: 'BlockNumber',
//       completed_on: 'BlockNumber',
//       expired_on: 'BlockNumber',
//       provider: 'AccountId',
//       client: 'AccountId',
//       amount: 'Balance',
//       order_status: 'OrderStatus'
//     },
//     Pledge: {
//       total: 'Balance',
//       used: 'Balance',
//     },
//     PaymentLedger: {
//       total: 'Balance',
//       paid: 'Balance',
//       unreserved: 'Balance',
//     },
//     ProviderPunishment: {
//       success: 'EraIndex',
//       failed: 'EraIndex',
//       value: 'Balance',
//     },
//     // EraIndex: 'u32',
//     Cert: 'Vec<u8>',
//     IASSig: 'Vec<u8>',
//     ISVBody: 'Vec<u8>',
//     PubKey: 'Vec<u8>',
//     TeeSignature: 'Vec<u8>',
//     // TODO: remove util upgrade newest polkadot-js/api
//     Releases: {
//       _enum: ['V1_0_0', 'V2_0_0'],
//     },
//     Status: {
//       _enum: ['Free', 'Reserved']
//     }
//   });
//   if (names.length) {
//     registry.register(types);
//     console.log('Type registration:', names.join(', '));
//   }
// } catch (error) {
//   console.error('Type registration failed', error);
// }

console.log('WS endpoint=', apiUrl);
