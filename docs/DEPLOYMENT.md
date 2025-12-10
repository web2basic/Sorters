# Deployment Guide

## Prerequisites

1. **Stacks CLI**: Install the Stacks CLI
   ```bash
   npm install -g @stacks/cli
   ```

2. **Clarinet**: Install Clarinet for local development
   ```bash
   cargo install clarinet
   ```

3. **Stacks Wallet**: Install Hiro Wallet or Xverse browser extension

4. **Testnet STX**: Get testnet STX from [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet)

## Local Development

### 1. Start Local Devnet

```bash
clarinet devnet
```

This starts a local Stacks blockchain for testing.

### 2. Deploy Contract Locally

```bash
clarinet deploy
```

### 3. Run Tests

```bash
clarinet test
```

## Testnet Deployment

### 1. Configure Testnet

Ensure you have:
- A Stacks testnet account with STX
- Your private key or mnemonic phrase

### 2. Deploy to Testnet

```bash
clarinet deploy --testnet
```

Or using Stacks CLI:

```bash
stacks deploy sorters contracts/sorters.clar --testnet
```

### 3. Verify Deployment

Check your contract on [Stacks Testnet Explorer](https://explorer.stacks.co/?chain=testnet)

## Mainnet Deployment

⚠️ **Warning**: Mainnet deployment is permanent. Test thoroughly on testnet first.

### 1. Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Contract reviewed and audited
- [ ] Testnet deployment successful
- [ ] Sufficient STX for deployment fees
- [ ] Backup of private keys

### 2. Deploy to Mainnet

```bash
clarinet deploy --mainnet
```

Or:

```bash
stacks deploy sorters contracts/sorters.clar --mainnet
```

### 3. Post-Deployment

1. Verify contract on [Stacks Explorer](https://explorer.stacks.co/)
2. Update frontend with contract address
3. Test all functions on mainnet
4. Monitor for issues

## Contract Addresses

After deployment, update these in your frontend:

```typescript
// Testnet
export const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

// Mainnet
export const CONTRACT_ADDRESS = "SP...";
```

## Environment Variables

Create a `.env` file:

```env
STACKS_NETWORK=testnet
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
CONTRACT_NAME=sorters
```

## Frontend Deployment

### Build Frontend

```bash
cd frontend
npm install
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables
3. Deploy

## Monitoring

### Contract Events

Monitor events using:
- Stacks Explorer
- Stacks API
- Custom indexer

### Health Checks

- Monitor transaction success rates
- Track gas costs
- Monitor user activity

## Troubleshooting

### Deployment Fails

- Check STX balance
- Verify contract syntax
- Check network connectivity
- Review error messages

### Contract Not Found

- Verify contract address
- Check network (testnet vs mainnet)
- Ensure contract is deployed

### Transaction Failures

- Check user STX balance
- Verify function parameters
- Check access permissions
- Review contract logs

## Security Best Practices

1. **Never commit private keys**
2. **Use environment variables**
3. **Test on testnet first**
4. **Review contract code**
5. **Monitor for vulnerabilities**
6. **Keep dependencies updated**

## Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/Gbangbolaoluwagbemiga/Sorters/issues)
- Stacks Discord: Join the community
- Documentation: Check the docs folder

