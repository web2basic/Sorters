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
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);
require('dotenv').config();

async function deploy() {
  console.log('🚀 Sorters Contract Deployment');
  console.log('==============================\n');

  // Load environment variables (support both variable names)
  let secretKey = process.env.STACKS_SECRET_KEY || process.env.DEPLOYER_MNEMONIC;
  const network = process.env.STACKS_NETWORK || 'mainnet';
  const contractName = process.env.CONTRACT_NAME || 'sorters';

  if (!secretKey) {
    console.error('❌ Error: STACKS_SECRET_KEY or DEPLOYER_MNEMONIC not set in .env file');
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
      
      // Derive seed from mnemonic (returns Buffer)
      let seed;
      try {
        seed = await bip39.mnemonicToSeed(normalizedMnemonic);
      } catch (error) {
        // Try with normalized lowercase
        seed = await bip39.mnemonicToSeed(normalizedMnemonic.toLowerCase());
      }
      
      // Ensure seed is a Buffer
      if (!Buffer.isBuffer(seed)) {
        seed = Buffer.from(seed);
      }
      
      // Derive private key using Stacks derivation path: m/44'/5757'/0'/0/0
      const root = bip32.fromSeed(seed);
      const child = root.derivePath("m/44'/5757'/0'/0/0");
      if (!child.privateKey) {
        throw new Error('Failed to derive private key from mnemonic');
      }
      
      // Extract the 32-byte private key (first 32 bytes)
      // child.privateKey is a Buffer, we need the first 32 bytes
      const privateKeyBuffer = Buffer.isBuffer(child.privateKey) 
        ? child.privateKey.slice(0, 32) 
        : Buffer.from(child.privateKey).slice(0, 32);
      
      // Convert to hex string (should be 64 characters)
      privateKey = privateKeyBuffer.toString('hex');
      
      // Ensure it's exactly 64 hex characters (32 bytes)
      if (privateKey.length !== 64) {
        throw new Error(`Invalid private key length: ${privateKey.length} (expected 64)`);
      }
      
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
    // Calculate fee based on contract size
    // Minimum fee: 0.5 STX (500,000 microstacks) as requested
    // Note: Deployment also has a base cost (~0.001-0.01 STX) separate from transaction fee
    const contractSizeKB = contractCode.length / 1024;
    const minFee = 500000; // 0.5 STX minimum transaction fee
    const sizeFee = Math.ceil(contractSizeKB * 50000); // Reduced size fee
    const calculatedFee = minFee + sizeFee;
    // Use at least 0.5 STX, but more if calculated fee is higher
    const estimatedFee = Math.max(minFee, calculatedFee);
    
    console.log(`📦 Preparing deployment...`);
    console.log(`   Contract size: ~${contractSizeKB.toFixed(2)} KB`);
    console.log(`   Minimum fee: 0.5 STX (as requested)`);
    console.log(`   Calculated fee: ${(calculatedFee / 1000000).toFixed(6)} STX`);
    console.log(`   Using fee: ${(estimatedFee / 1000000).toFixed(6)} STX`);
    console.log(`   Your address: ${address}`);
    console.log(`   Check balance: https://explorer.stacks.co/address/${address}?chain=${network}\n`);

    // Create deployment transaction
    const txOptions = {
      contractName,
      codeBody: contractCode,
      senderKey: privateKey,
      network: stacksNetwork,
      anchorMode: AnchorMode.Any,
      fee: estimatedFee,
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

