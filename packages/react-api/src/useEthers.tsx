import React, { useContext, useMemo, createContext } from 'react';
import { ethers, Signer } from 'ethers';
import { Readystate, useWeb3 } from './useWeb3';
const { v4 } = require('uuid')

type ExternalProvider = ethers.providers.ExternalProvider
type Web3Provider = ethers.providers.Web3Provider

interface Props {
    children: React.ReactNode;
}


interface IEthersContext {
    instance?: string
    provider?: Web3Provider
    readystate: Readystate
    signer?: Signer
}

const EthersContext = createContext<IEthersContext>({
    readystate: 'unavailable',
})

function EthersProvider({ children }: Props): React.ReactElement<Props> | null {
    const { provider: externalProvider, readystate } = useWeb3()
    const provider = useMemo(
        () =>
            externalProvider !== undefined
                ? new ethers.providers.Web3Provider(
                    externalProvider as ExternalProvider
                )
                : undefined,
        [externalProvider]
    )
    const signer = useMemo(() => provider?.getSigner(), [provider])
    const instance = useMemo(
        () => (provider !== undefined ? v4() : undefined),
        [provider]
    )

    console.log('readystate', readystate)

    return (
        <EthersContext.Provider value={{ instance, provider, readystate, signer }}>
            {children}
        </EthersContext.Provider>
    )
}

export default React.memo(EthersProvider);

export const useEthers = (): IEthersContext => useContext(EthersContext)
