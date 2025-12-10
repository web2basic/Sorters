# Mainnet Deployment Guide

## ⚠️ Critical Warnings

**Mainnet deployment is PERMANENT and IRREVERSIBLE.**
- Once deployed, the contract cannot be modified or deleted
- All transactions are final and cost real STX
- Test thoroughly on testnet before proceeding

## 📋 Pre-Deployment Checklist

Before deploying to mainnet, ensure:

- [ ] **All tests pass**: `npm test`
- [ ] **Contract reviewed**: Code has been audited or reviewed
- [ ] **Testnet tested**: Successfully deployed and tested on testnet
- [ ] **STX balance**: Have at least 2-3 STX for deployment fees
- [ ] **Private key secure**: Backup your private key/mnemonic
- [ ] **Network confirmed**: You're on Stacks mainnet (not testnet)
- [ ] **Wallet ready**: Hiro or Xverse wallet configured for mainnet

## 🚀 Deployment Steps

### Step 1: Verify Prerequisites

```bash
# Check Clarinet is installed
clarinet --version

# Verify contract syntax
clarinet check

# Run all tests
npm test
```

### Step 2: Review Contract

Double-check your contract at `contracts/sorters.clar`:
- All functions work as expected
- Error handling is correct
- No hardcoded test values
- Constants are appropriate for mainnet

### Step 3: Deploy to Mainnet

**Option A: Using npm script**
```bash
npm run deploy:mainnet
```

**Option B: Using Clarinet directly**
```bash
clarinet deploy --mainnet
```

**Option C: Using deployment script**
```bash
./scripts/deploy-mainnet.sh
```

### Step 4: Save Contract Address

After deployment, you'll receive a contract address like:
```
SP1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

**IMPORTANT**: Save this address immediately!

### Step 5: Verify Deployment

1. Visit [Stacks Explorer](https://explorer.stacks.co/?chain=mainnet)
2. Search for your contract address
3. Verify contract code matches your deployment
4. Check initial transaction was successful

### Step 6: Update Frontend Configuration

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_STACKS_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SP1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
NEXT_PUBLIC_CONTRACT_NAME=sorters
```

### Step 7: Test on Mainnet

1. Connect your wallet (mainnet)
2. Create a test note
3. Verify it appears on explorer
4. Test all functions (create, read, update, delete)

## 💰 Cost Estimation

- **Deployment**: ~1-2 STX (one-time)
- **Create Note**: ~0.001-0.01 STX per note
- **Update Note**: ~0.001-0.005 STX per update
- **Delete Note**: ~0.001-0.003 STX per deletion
- **Read Operations**: Free (read-only)

## 🔒 Security Considerations

1. **Private Keys**: Never share or commit private keys
2. **Environment Variables**: Use `.env.local` (gitignored)
3. **Wallet Security**: Use hardware wallet for mainnet if possible
4. **Transaction Review**: Always review transactions before signing
5. **Monitoring**: Set up alerts for contract activity

## 📊 Post-Deployment

### Monitor Contract

- Set up monitoring for contract events
- Track transaction success rates
- Monitor gas costs
- Watch for unusual activity

### Update Documentation

- Update README with mainnet contract address
- Document any mainnet-specific configurations
- Update deployment guides if needed

### Share with Users

- Announce mainnet deployment
- Provide user guide
- Share contract address
- Set up support channels

## 🐛 Troubleshooting

### Deployment Fails

**Insufficient STX:**
- Ensure you have at least 2-3 STX
- Check wallet balance on explorer

**Network Error:**
- Verify internet connection
- Check Stacks network status
- Try again after a few minutes

**Contract Error:**
- Review error message
- Check contract syntax: `clarinet check`
- Verify all dependencies are correct

### Contract Not Appearing

- Wait 5-10 minutes for block confirmation
- Check transaction status on explorer
- Verify contract address is correct
- Ensure you're searching on mainnet explorer

## 📞 Support

If you encounter issues:
1. Check [Stacks Documentation](https://docs.stacks.co/)
2. Review error messages carefully
3. Check [Stacks Discord](https://discord.gg/stacks)
4. Open an issue on GitHub

## ✅ Success Checklist

After successful deployment:

- [ ] Contract deployed and verified on explorer
- [ ] Frontend configured with mainnet address
- [ ] Test transaction successful
- [ ] Documentation updated
- [ ] Monitoring set up
- [ ] Users notified

---

**Congratulations on your mainnet deployment! 🎉**

Remember: With great power comes great responsibility. Your contract is now live on mainnet and users will depend on it. Maintain it well!

