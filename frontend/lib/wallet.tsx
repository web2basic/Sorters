'use client';

import { useConnect } from '@stacks/connect-react';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from './config';

export const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export function useWallet() {
  const { doOpenAuth, doAuth, isAuthenticated, userData, isShowingAuth } = useConnect();

  const connectWallet = async () => {
    await doOpenAuth({
      network,
      appDetails: {
        name: 'Sorters',
        icon: 'https://sorters.app/icon.png',
      },
      onFinish: (data) => {
        console.log('User authenticated:', data);
      },
      onCancel: () => {
        console.log('User cancelled authentication');
      },
    });
  };

  const disconnectWallet = () => {
    // Stacks Connect handles disconnection automatically
    window.location.reload();
  };

  return {
    connectWallet,
    disconnectWallet,
    isAuthenticated,
    userData,
    isShowingAuth,
    address: userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet,
  };
}

