import { Guarantee } from "@polkadot/app-staking/Actions/Account";
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { EraIndex, Exposure } from '@polkadot/types/interfaces';
import BN from "bn.js";
import { BN_ZERO } from '@polkadot/util';
import { useState, useEffect } from "react";

interface EffectedStake {
  targets: [string, BN][];
  stakeValue: BN;
}

export default function useOwnEffectedStake (currentEra: EraIndex, guarantee: Guarantee, stashId: string): EffectedStake {
  const { api } = useApi();
  let guaranteeTargets: [string, BN][] = [];
  let stakeValue = new BN(0);
  
  if (guarantee && JSON.parse(JSON.stringify(guarantee)) !== null && currentEra && JSON.parse(JSON.stringify(currentEra)) !== null) {
    let tmpTargets = JSON.parse(JSON.stringify(guarantee)).targets;
    for (const tmp of tmpTargets) {
      // const exposure = useCall<Exposure>(api.query.staking.erasStakers, [currentEra.toHuman(), tmp.who])
      // if (exposure) {
      //   for (const other of exposure.others) {
      //     if (other.who.toString() === stashId) {
      //       guaranteeTargets.push([tmp.who, other.value.unwrap() ])
      //     }
      //   }
      // }
    }
    stakeValue = guaranteeTargets.reduce((total: BN, [who, value]) => { return total.add(new BN(Number(value).toString()))}, BN_ZERO);
  }
  
  
  return { targets: guaranteeTargets, stakeValue };
}