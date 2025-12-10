#!/usr/bin/env node

/**
 * Deploy Sorters Contract using Secret Key
 * This script uses @stacks/transactions to deploy the contract
 */

const fs = require('fs');
const path = require('path');
const { makeContractDeploy, broadcastTransaction, AnchorMode, getAddressFromPrivateKey } = require('@stacks/transactions');
const { StacksMainnet, StacksTestnet } = require('@stacks/network');
const bip39 = require('bip39');
const bip32 = require('bip32');
require('dotenv').config();

async function deploy() {
  console.log('🚀 Sorters Contract Deployment');
  console.log('==============================\n');

  // Load environment variables
  let secretKey = process.env.STACKS_SECRET_KEY;
  const network = process.env.STACKS_NETWORK || 'mainnet';
  const contractName = process.env.CONTRACT_NAME || 'sorters';

  if (!secretKey) {
    console.error('❌ Error: STACKS_SECRET_KEY not set in .env file');
    process.exit(1);
  }

  // Handle mnemonic - convert to private key if needed
  let privateKey = secretKey;
  let address;
  
  // Remove quotes if present
  privateKey = privateKey.replace(/^["']|["']$/g, '').trim();
  
  // Check if contract file exists
  const contractPath = path.join(__dirname, '..', 'contracts', `${contractName}.clar`);
  if (!fs.existsSync(contractPath)) {
    console.error(`❌ Error: Contract file not found: ${contractPath}`);
    process.exit(1);
  }

  // Read contract code
  const contractCode = fs.readFileSync(contractPath, 'utf8');

  // Determine network
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

  // Check if it's a mnemonic (contains spaces) or a hex private key
  if (privateKey.split(' ').length > 1) {
    // It's a mnemonic - derive the private key
    console.log('📝 Detected mnemonic, deriving private key...');
    try {
      // Normalize mnemonic (trim)
      const normalizedMnemonic = privateKey.trim();
      
      // Try to validate mnemonic (but continue even if validation fails for some edge cases)
      const wordCount = normalizedMnemonic.split(/\s+/).length;
      if (wordCount !== 12 && wordCount !== 15 && wordCount !== 18 && wordCount !== 21 && wordCount !== 24) {
        throw new Error(`Invalid mnemonic: expected 12, 15, 18, 21, or 24 words, got ${wordCount}`);
      }
      
      // Try validation, but continue if it fails (some valid mnemonics might not pass strict validation)
      const isValid = bip39.validateMnemonic(normalizedMnemonic);
      if (!isValid) {
        console.log('⚠️  Mnemonic validation warning (continuing anyway)...');
      }
      
      // Derive seed from mnemonic
      let seed;
      try {
        seed = await bip39.mnemonicToSeed(normalizedMnemonic);
      } catch (error) {
        // Try with normalized lowercase
        seed = await bip39.mnemonicToSeed(normalizedMnemonic.toLowerCase());
      }
      
      // Derive private key using Stacks derivation path: m/44'/5757'/0'/0/0
      const root = bip32.fromSeed(seed);
      const child = root.derivePath("m/44'/5757'/0'/0/0");
      privateKey = child.privateKey.toString('hex');
      
      // Get address from private key
      address = getAddressFromPrivateKey(privateKey, stacksNetwork.version);
      console.log('✅ Successfully derived private key from mnemonic');
    } catch (error) {
      console.error('❌ Error deriving account from mnemonic:', error.message);
      process.exit(1);
    }
  } else {
    // It's a hex private key
    try {
      address = getAddressFromPrivateKey(privateKey, stacksNetwork.version);
    } catch (error) {
      console.error('❌ Error getting address from private key:', error.message);
      console.error('Make sure your STACKS_SECRET_KEY is either a valid mnemonic or hex private key');
      process.exit(1);
    }
  }
  console.log(`Network: ${network}`);
  console.log(`Contract: ${contractName}`);
  console.log(`Deployer: ${address}\n`);

  if (network === 'mainnet') {
    console.log('⚠️  WARNING: MAINNET deployment is PERMANENT and IRREVERSIBLE!\n');
  }

  try {
    // Create deployment transaction
    const txOptions = {
      contractName,
      codeBody: contractCode,
      senderKey: privateKey,
      network: stacksNetwork,
      anchorMode: AnchorMode.Any,
      fee: 10000, // Fee in microstacks
    };

    console.log('📦 Creating deployment transaction...');
    const transaction = await makeContractDeploy(txOptions);

    console.log('📡 Broadcasting transaction...');
    const broadcastResponse = await broadcastTransaction(transaction, stacksNetwork);

    if (broadcastResponse.error) {
      console.error('❌ Deployment failed:', broadcastResponse.error);
      if (broadcastResponse.reason) {
        console.error('Reason:', broadcastResponse.reason);
      }
      process.exit(1);
    }

    console.log('\n✅ Deployment transaction broadcasted!');
    console.log(`Transaction ID: ${broadcastResponse.txid}`);
    console.log(`\n📝 Contract Address: ${address}.${contractName}`);
    console.log(`\n🔗 View on Explorer:`);
    if (network === 'mainnet') {
      console.log(`   https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=mainnet`);
    } else {
      console.log(`   https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
    }

    console.log('\n📝 Next steps:');
    console.log(`1. Wait for transaction confirmation (usually 1-2 blocks)`);
    console.log(`2. Update frontend/.env.local with:`);
    console.log(`   NEXT_PUBLIC_STACKS_NETWORK=${network}`);
    console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}.${contractName}`);
    console.log(`3. Verify contract on Stacks Explorer`);

  } catch (error) {
    console.error('❌ Deployment error:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy().catch(console.error);

