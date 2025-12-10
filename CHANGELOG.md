# Changelog

All notable changes to the Sorters project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-10

### Added
- Initial release of Sorters decentralized note-keeping application
- Stacks smart contract in Clarity for on-chain note storage
- Core functionality:
  - Create notes with title, content, and tags
  - Read notes by ID
  - Update note content and title
  - Add and update tags
  - Delete notes
- Access control and ownership verification
- Event emission for all operations
- Comprehensive test suite
- Documentation:
  - README with project overview
  - Architecture documentation
  - API documentation
  - Deployment guide
  - Contributing guidelines

### Features
- Decentralized storage on Stacks blockchain
- User-owned data with cryptographic access control
- Tag-based organization system
- Timestamp tracking for creation and updates
- Input validation and error handling
- Immutable audit trail through blockchain events

### Security
- Owner-based access control
- Input validation for all user inputs
- Content length limits to prevent abuse
- Tag limits for efficient storage

### Technical Details
- Built with Clarity smart contract language
- Compatible with Stacks testnet and mainnet
- Full test coverage with Clarinet
- TypeScript test suite

## [Unreleased]

### Planned
- Frontend React/Next.js application
- Wallet integration (Hiro, Xverse)
- IPFS integration for large content
- Client-side encryption
- Note sharing and collaboration
- Search and filtering UI
- Mobile app support

