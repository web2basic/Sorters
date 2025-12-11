# Mainnet Deployment Checklist

Use this checklist before deploying to mainnet.

## Pre-Deployment

- [ ] All tests passing: `npm test`
- [ ] Contract syntax valid: `clarinet check`
- [ ] Testnet deployment successful and tested
- [ ] Contract code reviewed
- [ ] At least 2-3 STX in wallet for deployment
- [ ] Private key/mnemonic backed up securely
- [ ] Wallet configured for mainnet (not testnet)

## Deployment

- [ ] Run deployment: `npm run deploy:mainnet`
- [ ] Save contract address immediately
- [ ] Verify deployment on [Stacks Explorer](https://explorer.stacks.co/?chain=mainnet)
- [ ] Confirm contract code matches deployment

## Post-Deployment

- [ ] Update `frontend/.env.local`:
  - [ ] `NEXT_PUBLIC_STACKS_NETWORK=mainnet`
  - [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS=<your-address>`
- [ ] Test contract functions on mainnet:
  - [ ] Create note
  - [ ] Read note
  - [ ] Update note
  - [ ] Delete note
- [ ] Update README with mainnet contract address
- [ ] Set up monitoring/alerting
- [ ] Announce deployment to users

## Frontend Updates

- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Test frontend with mainnet contract
- [ ] Deploy frontend to production
- [ ] Verify wallet connection works
- [ ] Test all UI features

## Documentation

- [ ] Update README.md
- [ ] Update API documentation if needed
- [ ] Document any mainnet-specific notes

---

**Ready to deploy?** Review [MAINNET_DEPLOYMENT.md](./MAINNET_DEPLOYMENT.md) for detailed instructions.


