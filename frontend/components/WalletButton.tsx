'use client';

import { useWallet } from '@/lib/wallet';
import { useConnect } from '@stacks/connect-react';
import { network } from '@/lib/wallet';
import { Wallet, LogOut } from 'lucide-react';

export function WalletButton() {
  const { disconnectWallet, isAuthenticated, address } = useWallet();
  const { doOpenAuth } = useConnect();

  const connectWallet = async () => {
    await doOpenAuth({
      network,
      appDetails: {
        name: 'Sorters',
        icon: 'https://sorters.app/icon.png',
      },
      onFinish: () => {
        window.location.reload();
      },
      onCancel: () => {
        console.log('User cancelled authentication');
      },
    });
  };

  if (isAuthenticated && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono text-green-800 dark:text-green-200">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
    >
      <Wallet size={20} />
      Connect Wallet
    </button>
  );
}

