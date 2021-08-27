import { useApi } from '@polkadot/react-hooks';

const themeDict = {
  "Crust": "mainnet",
  "Crust Maxwell": "maxwell",
  "Crust Rockey": "rockey"
}
export function useThemeClass(){
  const {systemChain} = useApi()
  return themeDict[systemChain] || "rockey"
}
