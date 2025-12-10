# Deployment Guide

## Prerequisites

1. Install Clarinet: https://docs.hiro.so/clarinet
2. Install Node.js 18+ and npm
3. Set up a Stacks wallet (Hiro Wallet recommended)

## Smart Contract Deployment

### 1. Test Locally

```bash
# Run tests
clarinet test

# Start local devnet
clarinet console
```

### 2. Deploy to Testnet

```bash
# Deploy to testnet
clarinet deploy --testnet

# Note the contract address from the output
```

### 3. Update Configuration

Update `app/config.ts` with your deployed contract address:

```typescript
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS'
export const CONTRACT_NAME = 'sorters'
```

## Frontend Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Deploy

You can deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your GitHub repo
- **Self-hosted**: `npm start`

### 4. Environment Variables

No environment variables required for basic setup. The contract address is configured in `app/config.ts`.

## Verification

1. Connect your Stacks wallet
2. Create a test note
3. Verify the transaction on [Stacks Explorer](https://explorer.stacks.co/)

## Mainnet Deployment

For mainnet deployment:

1. Update `NETWORK` in `app/config.ts` to `'mainnet'`
2. Deploy contract: `clarinet deploy --mainnet`
3. Update contract address
4. Rebuild and deploy frontend

