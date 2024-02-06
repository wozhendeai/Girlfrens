import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { blastSepolia } from '@wagmi/core/chains'

import { injected } from 'wagmi/connectors'

const config = createConfig({
    chains: [ blastSepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [blastSepolia.id]: http(),
        [localhost.id]: http()
    },
    connectors: [
        injected()
    ]
})

export default config;