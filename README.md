# Sorters - Decentralized Note Keeper

> **Award-Winning Hackathon Project** 🏆  
> A decentralized, privacy-first note-keeping application built on Stacks blockchain

## 🌟 Overview

**Sorters** is a revolutionary decentralized application that allows users to store, organize, and manage their important notes on the Stacks blockchain. Unlike traditional note-taking apps, Sorters ensures true data ownership, immutability, and censorship resistance through blockchain technology.

## ✨ Key Features

### 🔐 **Decentralized Storage**
- All notes are stored on-chain on Stacks blockchain
- No central authority can access, modify, or delete your notes
- True data ownership and sovereignty

### 🔒 **Privacy & Security**
- End-to-end encryption for sensitive notes
- User-controlled access with cryptographic keys
- Immutable audit trail of all changes

### 📝 **Smart Organization**
- Create, read, update, and delete notes
- Tag-based categorization system
- Search and filter capabilities
- Timestamp tracking for all operations

### 💰 **Token Economics**
- Optional STX token integration for premium features
- Community governance through token voting
- Reward system for active contributors

### 🌐 **Web3 Native**
- Seamless Stacks wallet integration (Hiro, Xverse)
- No account creation required - your wallet is your identity
- Cross-platform compatibility

## 🏗️ Architecture

```
Sorters/
├── contracts/          # Stacks smart contracts (Clarity)
│   └── sorters.clar    # Main contract for note management
├── frontend/           # React/Next.js frontend application
├── tests/              # Contract and integration tests
└── docs/               # Additional documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Stacks CLI (`npm install -g @stacks/cli`)
- Clarinet (`cargo install clarinet`)
- Hiro Wallet or Xverse wallet extension

### Installation

```bash
# Clone the repository
git clone https://github.com/Gbangbolaoluwagbemiga/Sorters.git
cd Sorters

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Test the contract
npm test

# Deploy contract to testnet (or mainnet)
npm run deploy:testnet
# OR for mainnet: npm run deploy:mainnet

# Configure frontend environment
cd frontend
cp .env.example .env.local
# Edit .env.local with your contract address

# Start frontend
npm run dev
```

### 🌐 Mainnet Deployment

⚠️ **Important**: Mainnet deployment is permanent. Ensure you have:
- ✅ All tests passing
- ✅ Testnet deployment tested thoroughly
- ✅ Sufficient STX for deployment fees (~1-2 STX)
- ✅ Contract address saved for frontend configuration

```bash
# Deploy to mainnet
npm run deploy:mainnet

# Update frontend .env.local with mainnet contract address
# Set NEXT_PUBLIC_STACKS_NETWORK=mainnet
```

## 📋 Smart Contract Features

The Sorters smart contract provides:

- **Note Management**: Create, read, update, and delete notes
- **Access Control**: Owner-based permissions
- **Tag System**: Organize notes with custom tags
- **Metadata**: Track creation and modification timestamps
- **Event Emission**: Transparent on-chain events for all operations

## 🔧 Development

### Contract Development

```bash
# Test the contract
npm run test:contract

# Deploy to local devnet
npm run devnet

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet (⚠️ Permanent - test thoroughly first!)
npm run deploy:mainnet
```

### Frontend Development

```bash
# Start development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run contract tests
npm run test:contract

# Run integration tests
npm run test:integration
```

## 📖 Usage

1. **Connect Wallet**: Connect your Stacks wallet (Hiro or Xverse)
2. **Create Note**: Click "New Note" and enter your content
3. **Add Tags**: Organize notes with custom tags
4. **Search**: Use the search bar to find notes by content or tags
5. **Manage**: Edit or delete notes as needed

## 🎯 Use Cases

- **Personal Journaling**: Keep private thoughts and reflections
- **Project Documentation**: Store project notes and ideas
- **Research Notes**: Maintain research findings and references
- **Meeting Notes**: Record and organize meeting minutes
- **Code Snippets**: Save and organize code snippets
- **Password Hints**: Store encrypted password hints (not actual passwords)

## 🔮 Future Roadmap

- [ ] Collaborative notes with shared access
- [ ] Rich text editor with markdown support
- [ ] File attachments (IPFS integration)
- [ ] Mobile app (React Native)
- [ ] Note versioning and history
- [ ] Export/import functionality
- [ ] AI-powered note organization
- [ ] Cross-chain compatibility

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Highlights

- **Innovation**: First decentralized note-keeping app on Stacks
- **User Experience**: Seamless Web3 integration with familiar UX
- **Security**: Blockchain-backed immutability and privacy
- **Scalability**: Efficient contract design for mass adoption
- **Impact**: Empowering users with true data ownership

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Gbangbolaoluwagbemiga/Sorters/issues)
- **Discord**: Join our community
- **Twitter**: Follow for updates

## 🙏 Acknowledgments

- Stacks Foundation for the amazing blockchain platform
- Clarity language for secure smart contract development
- Open source community for inspiration and tools

---

**Built with ❤️ on Stacks Blockchain**

