import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [localhost.id]: http()
    },
    connectors: [
        injected()
    ]
})

export default config;