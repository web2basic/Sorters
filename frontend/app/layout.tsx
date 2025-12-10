import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Connect } from '@stacks/connect-react';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from '@/lib/config';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sorters - Decentralized Note Keeper',
  description: 'Store your important notes on the Stacks blockchain',
};

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Connect
          authOptions={{
            appDetails: {
              name: 'Sorters',
              icon: 'https://sorters.app/icon.png',
            },
            network,
            redirectTo: '/',
            onFinish: () => {
              window.location.reload();
            },
          }}
        >
          {children}
        </Connect>
      </body>
    </html>
  );
}

