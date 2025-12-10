# Sorters - Decentralized Notes Keeper

![Sorters Logo](https://img.shields.io/badge/Sorters-Decentralized%20Notes-blue)
![Stacks](https://img.shields.io/badge/Stacks-Blockchain-5546ff)
![License](https://img.shields.io/badge/License-MIT-green)

A revolutionary decentralized notes application built on the Stacks blockchain. Sorters allows you to store, organize, and share your important notes with complete ownership and privacy. Your notes are stored on-chain, encrypted, and truly decentralized.

## 🏆 Hackathon Project Features

### Core Features
- **🔒 Blockchain Storage**: Notes stored directly on Stacks blockchain
- **🔐 Encryption Support**: Optional end-to-end encryption for sensitive notes
- **📁 Folder Organization**: Organize notes into custom folders
- **🏷️ Tagging System**: Tag notes for easy categorization and search
- **👥 Sharing & Permissions**: Share notes with read or write permissions
- **📝 Version History**: Track changes with automatic versioning
- **🌐 Decentralized**: No central server, fully on-chain

### Technical Highlights
- **Smart Contract**: Written in Clarity (Stacks' secure smart contract language)
- **Frontend**: Modern Next.js 14 with TypeScript
- **Wallet Integration**: Seamless Stacks wallet connection
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- [Clarinet](https://docs.hiro.so/clarinet) for smart contract development
- [Hiro Wallet](https://www.hiro.so/wallet) browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gbangbolaoluwagbemiga/Sorters.git
   cd Sorters
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Clarinet**
   ```bash
   clarinet install
   ```

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open [http://localhost:3000](http://localhost:3000)** in your browser

3. **Test the smart contract**
   ```bash
   clarinet test
   ```

### Deployment

1. **Deploy to Stacks Testnet**
   ```bash
   clarinet deploy --testnet
   ```

2. **Update contract address** in `app/config.ts` with your deployed contract address

3. **Build and deploy frontend**
   ```bash
   npm run build
   npm start
   ```

## 📖 Smart Contract API

### Public Functions

#### `create-note`
Create a new note on the blockchain.

**Parameters:**
- `title` (string-ascii 200): Note title
- `content` (buff 10000): Note content (up to 10KB)
- `encrypted` (bool): Whether the note is encrypted
- `tags` (list 10 string-ascii 50): List of tags (max 10)
- `folder` (optional string-ascii 100): Optional folder name

**Returns:** `uint` - The note ID

#### `update-note`
Update an existing note.

**Parameters:**
- `note-id` (uint): ID of the note to update
- `title` (string-ascii 200): New title
- `content` (buff 10000): New content
- `tags` (list 10 string-ascii 50): New tags
- `folder` (optional string-ascii 100): New folder

**Returns:** `bool` - Success status

#### `delete-note`
Delete a note (only by owner).

**Parameters:**
- `note-id` (uint): ID of the note to delete

**Returns:** `bool` - Success status

#### `share-note`
Share a note with another user.

**Parameters:**
- `note-id` (uint): ID of the note
- `recipient` (principal): Stacks address of recipient
- `permission` (string-ascii 20): "read" or "write"

**Returns:** `bool` - Success status

#### `revoke-share`
Revoke sharing access for a note.

**Parameters:**
- `note-id` (uint): ID of the note
- `recipient` (principal): Stacks address to revoke

**Returns:** `bool` - Success status

### Read-Only Functions

#### `get-note`
Get a note by ID (checks permissions).

**Parameters:**
- `note-id` (uint): ID of the note

**Returns:** `(optional {...})` - Note data or none

#### `has-access`
Check if a user has access to a note.

**Parameters:**
- `note-id` (uint): ID of the note
- `user` (principal): User address to check

**Returns:** `bool` - Access status

## 🏗️ Architecture

```
Sorters/
├── contracts/
│   ├── sorters.clar          # Main smart contract
│   └── Clarinet.toml         # Clarinet configuration
├── app/
│   ├── components/           # React components
│   │   ├── NoteCard.tsx
│   │   └── CreateNoteModal.tsx
│   ├── config.ts             # Contract configuration
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   ├── providers.tsx         # Stacks providers
│   └── globals.css           # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

- **On-chain Storage**: All notes stored on immutable blockchain
- **Access Control**: Owner-based permissions with sharing capabilities
- **Encryption Support**: Optional client-side encryption before storage
- **Version Tracking**: Automatic versioning for audit trail
- **Clarity Language**: Type-safe, secure smart contract language

## 🎯 Use Cases

- **Personal Notes**: Store private thoughts and ideas
- **Team Collaboration**: Share notes with team members
- **Research**: Organize research notes with tags and folders
- **Journaling**: Keep a decentralized journal
- **Documentation**: Store important documentation on-chain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built on [Stacks Blockchain](https://www.stacks.co/)
- Smart contracts written in [Clarity](https://docs.hiro.so/clarity)
- Frontend built with [Next.js](https://nextjs.org/)
- Wallet integration via [Stacks Connect](https://github.com/stacks-network/connect)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for the Stacks ecosystem**

