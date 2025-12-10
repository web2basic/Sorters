# Sorters Frontend

React/Next.js frontend application for the Sorters decentralized note-keeping app.

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## ✨ Features

- 🔐 **Wallet Integration**: Seamless connection with Hiro and Xverse wallets
- 📝 **Note Management**: Create, read, update, and delete notes
- 🏷️ **Tag System**: Organize notes with custom tags
- 🔍 **Search & Filter**: Find notes by title, content, or tags
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode**: Automatic dark mode support
- ⚡ **Real-time Updates**: Instant UI updates after transactions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Stacks Connect
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- Stacks wallet extension (Hiro or Xverse)
- Deployed smart contract (see main README for deployment)

## ⚙️ Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_CONTRACT_NAME=sorters
```

**Note**: Update `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address.

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with Stacks Connect provider
│   └── page.tsx            # Main page component
├── components/
│   ├── WalletButton.tsx    # Wallet connection component
│   ├── NoteCard.tsx        # Note display card
│   └── NoteEditor.tsx      # Note creation/editing modal
├── lib/
│   ├── config.ts           # Configuration constants
│   ├── contract.ts         # Contract interaction functions
│   └── wallet.tsx          # Wallet hook
└── styles/
    └── globals.css         # Global styles and Tailwind
```

## 🎯 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve in your wallet extension
2. **Create Note**: Click "New Note" to create your first note
3. **Edit Note**: Click the edit icon on any note card
4. **Delete Note**: Click the delete icon (with confirmation)
5. **Search**: Use the search bar to filter notes
6. **Add Tags**: Add tags when creating/editing notes for better organization

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔒 Security

- All transactions require wallet approval
- Only note owners can edit/delete their notes
- Input validation on both client and contract side
- No sensitive data stored in localStorage

## 🐛 Troubleshooting

### Wallet not connecting
- Ensure Hiro or Xverse extension is installed
- Check that you're on the correct network (testnet/mainnet)
- Refresh the page and try again

### Contract calls failing
- Verify contract address in `.env.local`
- Check that contract is deployed on the selected network
- Ensure you have sufficient STX for transaction fees

### Notes not loading
- Check browser console for errors
- Verify contract address matches deployed contract
- Ensure wallet is connected

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks Connect Documentation](https://docs.hiro.so/stacks.js)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) file for guidelines.

