'use client';

import { useConnect } from '@stacks/connect-react';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from './config';

export const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export function useWallet() {
  const { isAuthenticated, userData } = useConnect();

  const disconnectWallet = () => {
    // Stacks Connect handles disconnection automatically
    window.location.reload();
  };

  return {
    disconnectWallet,
    isAuthenticated: isAuthenticated || false,
    userData,
    address: userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet || null,
  };
}

