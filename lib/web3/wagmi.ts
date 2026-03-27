import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      injected({
        target: 'metaMask',
      }),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        metadata: {
          name: 'Candoxa',
          description: 'Web3 platform for creators to collect their best work',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://candoxa.com',
          icons: [typeof window !== 'undefined' ? `${window.location.origin}/logos/Candoxa_Logo.svg` : ''],
        },
        showQrModal: true,
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http('https://sepolia.base.org'),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
