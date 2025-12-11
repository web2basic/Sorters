# Sorters Workspace Structure

## 📁 Project Organization

```
sorters/
├── contracts/              # Smart contracts
│   └── sorters.clar       # Main contract (deployed to mainnet)
├── tests/                  # Contract tests
│   └── sorters_test.ts
├── frontend/               # Next.js frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utilities and hooks
│   └── package.json
├── scripts/                # Deployment and utility scripts
│   ├── deploy-node.js     # Node.js deployment script
│   ├── deploy-with-key.sh # Shell deployment script
│   ├── deploy-mainnet.sh  # Mainnet deployment script
│   └── check-address.js   # Address verification script
├── docs/                   # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── settings/               # Clarinet network settings
│   ├── Devnet.toml
│   ├── Testnet.toml
│   └── Mainnet.toml
├── deployments/            # Deployment configurations
│   └── default.mainnet-plan.yaml
├── README.md               # Main documentation
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # MIT License
├── MAINNET_DEPLOYMENT.md   # Mainnet deployment guide
├── DEPLOYMENT_CHECKLIST.md # Deployment checklist
├── package.json            # Root dependencies
└── Clarinet.toml           # Clarinet configuration
```

## 🚀 Quick Reference

### Contract
- **Address**: `SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.sorters`
- **Network**: Mainnet
- **File**: `contracts/sorters.clar`

### Frontend
- **Location**: `frontend/`
- **Framework**: Next.js 14
- **Config**: `frontend/.env.local`

### Deployment
- **Scripts**: `scripts/`
- **Settings**: `settings/`

