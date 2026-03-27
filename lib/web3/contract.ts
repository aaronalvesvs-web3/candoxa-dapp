import Web3 from 'web3';
import ABI from '@/ABI.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const BASE_SEPOLIA_RPC = 'https://sepolia.base.org';

export type Link = {
  linkOwner: string;
  title: string;
  description: string;
  link: string;
  publishedAt: bigint;
};

let web3: Web3 | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let contract: any = null;

export const initWeb3 = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    // Fallback para leitura apenas (sem interações que requerem assinatura)
    web3 = new Web3(BASE_SEPOLIA_RPC);
  }

  contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  return { web3, contract };
};

export const getAllLinks = async (): Promise<Link[]> => {
  try {
    if (!contract) {
      initWeb3();
    }

    const links = await contract.methods.getAllLinks().call();
    return links as Link[];
  } catch (error) {
    console.error('Error fetching all links:', error);
    throw error;
  }
};

export const getLinksByOwner = async (ownerAddress: string): Promise<Link[]> => {
  try {
    if (!contract) {
      initWeb3();
    }

    const links = await contract.methods.getLinksByOwner(ownerAddress).call();
    return links as Link[];
  } catch (error) {
    console.error('Error fetching links by owner:', error);
    throw error;
  }
};

export const addLink = async (
  title: string,
  description: string,
  link: string,
  fromAddress: string
): Promise<unknown> => {
  try {
    if (!web3 || !contract) {
      initWeb3();
    }

    const tx = await contract.methods.addLink(title, description, link).send({
      from: fromAddress,
    });

    return tx;
  } catch (error) {
    console.error('Error adding link:', error);
    throw error;
  }
};

export const connectWallet = async (): Promise<string[]> => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      return accounts;
    }
    throw new Error('MetaMask not installed');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const getCurrentAccount = async (): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      return accounts[0] || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

export const switchToBaseSepolia = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }], // Base Sepolia chainId (84532 em decimal)
      });
    }
  } catch (error: unknown) {
    // Caso a rede não esteja adicionada, adiciona
    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x14a34',
            chainName: 'Base Sepolia Testnet',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
};
