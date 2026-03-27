import { baseSepolia } from "viem/chains";
import { http, createConfig } from "wagmi";
import {
  injected,
  coinbaseWallet,
  metaMask,
  walletConnect,
} from "wagmi/connectors";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
    coinbaseWallet({
      appName: "Candoxa",
    }),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
