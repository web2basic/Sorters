#!/usr/bin/env node

/**
 * Check which address your mnemonic controls
 */

require('dotenv').config();
const { getAddressFromPrivateKey } = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);

async function checkAllPaths() {
  const secretKey = process.env.STACKS_SECRET_KEY?.trim();
  if (!secretKey) {
    console.error('❌ STACKS_SECRET_KEY not found in .env');
    process.exit(1);
  }

  const network = new StacksMainnet();
  const targetAddress = 'SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP';
  
  console.log('🔍 Checking derivation paths for your mnemonic...\n');
  console.log(`Target address (with funds): ${targetAddress}\n`);

  // Check if it's a mnemonic
  if (secretKey.split(' ').length > 1) {
    const seed = await bip39.mnemonicToSeed(secretKey.trim());
    const root = bip32.fromSeed(seed);
    
    // Try many common paths
    const paths = [
      "m/44'/5757'/0'/0/0",
      "m/44'/5757'/0'/0/1",
      "m/44'/5757'/0'/0/2",
      "m/44'/5757'/0'/1/0",
      "m/44'/5757'/0'/1/1",
      "m/44'/5757'/1'/0/0",
      "m/44'/5757'/1'/0/1",
    ];
    
    let found = false;
    for (const path of paths) {
      try {
        const child = root.derivePath(path);
        const privateKeyBuffer = Buffer.isBuffer(child.privateKey) 
          ? child.privateKey.slice(0, 32) 
          : Buffer.from(child.privateKey).slice(0, 32);
        const privateKey = privateKeyBuffer.toString('hex');
        const address = getAddressFromPrivateKey(privateKey, network.version);
        
        const match = address === targetAddress ? ' ✅ MATCHES FUNDED ADDRESS!' : '';
        console.log(`${path.padEnd(20)} → ${address}${match}`);
        
        if (address === targetAddress) {
          found = true;
          console.log(`\n✅ Found it! Using path: ${path}`);
        }
      } catch (e) {
        console.log(`${path.padEnd(20)} → Error`);
      }
    }
    
    if (!found) {
      console.log(`\n❌ Target address not found in common paths.`);
      console.log(`\n💡 You may need to:`);
      console.log(`   1. Export private key from Hiro/Xverse for: ${targetAddress}`);
      console.log(`   2. Update .env with: STACKS_SECRET_KEY=<hex-private-key>`);
    }
  } else {
    // It's a hex private key
    try {
      const address = getAddressFromPrivateKey(secretKey, network.version);
      console.log(`Address from private key: ${address}`);
      if (address === targetAddress) {
        console.log('✅ This private key matches the funded address!');
      } else {
        console.log('❌ This private key does not match the funded address.');
      }
    } catch (e) {
      console.error('❌ Invalid private key format');
    }
  }
}

checkAllPaths().catch(console.error);


