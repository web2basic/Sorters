#!/bin/bash

# Simple Contract Deployment Script
# This script helps you deploy the Sorters contract to mainnet

set -e

echo "🚀 Sorters Contract Deployment"
echo "=============================="
echo ""
echo "⚠️  WARNING: This will deploy to MAINNET (permanent!)"
echo ""

# Check if contract exists
if [ ! -f "contracts/sorters.clar" ]; then
    echo "❌ Error: Contract file not found"
    exit 1
fi

echo "Contract file found: contracts/sorters.clar"
echo ""
echo "Choose deployment method:"
echo "1) Copy contract code to clipboard (for Hiro Wallet/Explorer)"
echo "2) Use Stacks CLI (if installed)"
echo "3) Show contract code"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        if command -v pbcopy &> /dev/null; then
            cat contracts/sorters.clar | pbcopy
            echo "✅ Contract code copied to clipboard!"
            echo "Now:"
            echo "1. Open Hiro Wallet"
            echo "2. Go to Deploy Contract"
            echo "3. Make sure you're on MAINNET"
            echo "4. Paste and deploy"
        else
            echo "Clipboard not available. Showing contract code:"
            cat contracts/sorters.clar
        fi
        ;;
    2)
        if command -v stacks &> /dev/null; then
            echo "Deploying with Stacks CLI..."
            read -p "Enter contract name (default: sorters): " contract_name
            contract_name=${contract_name:-sorters}
            stacks deploy "$contract_name" contracts/sorters.clar --mainnet
        else
            echo "❌ Stacks CLI not found"
            echo "Install with: npm install -g @stacks/cli"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "=== CONTRACT CODE ==="
        cat contracts/sorters.clar
        echo ""
        echo "=== END CONTRACT CODE ==="
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📝 After deployment:"
echo "1. Save your contract address"
echo "2. Update frontend/.env.local with:"
echo "   NEXT_PUBLIC_STACKS_NETWORK=mainnet"
echo "   NEXT_PUBLIC_CONTRACT_ADDRESS=<your-address>"
echo "3. Verify on: https://explorer.stacks.co/?chain=mainnet"


