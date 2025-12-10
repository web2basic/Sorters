#!/bin/bash

# Mainnet Deployment Script for Sorters
# ⚠️ WARNING: Mainnet deployment is PERMANENT
# Ensure you have tested thoroughly on testnet first!

set -e

echo "🚀 Sorters Mainnet Deployment"
echo "=============================="
echo ""
echo "⚠️  WARNING: This will deploy to Stacks MAINNET"
echo "⚠️  Mainnet deployments are PERMANENT and cannot be undone"
echo ""

# Check if Clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Error: Clarinet is not installed"
    echo "Install it with: cargo install clarinet"
    exit 1
fi

# Check if contract file exists
if [ ! -f "contracts/sorters.clar" ]; then
    echo "❌ Error: Contract file not found at contracts/sorters.clar"
    exit 1
fi

# Run tests first
echo "📋 Running tests..."
if ! clarinet test; then
    echo "❌ Tests failed! Please fix issues before deploying to mainnet."
    exit 1
fi

echo ""
echo "✅ Tests passed!"
echo ""
read -p "Are you sure you want to deploy to MAINNET? (type 'yes' to continue): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "📦 Deploying contract to mainnet..."
echo ""

# Deploy to mainnet
if clarinet deploy --mainnet; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Save the contract address from the output above"
    echo "2. Update frontend/.env.local with:"
    echo "   NEXT_PUBLIC_STACKS_NETWORK=mainnet"
    echo "   NEXT_PUBLIC_CONTRACT_ADDRESS=<your-contract-address>"
    echo "3. Verify contract on Stacks Explorer:"
    echo "   https://explorer.stacks.co/?chain=mainnet"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Check the error messages above and try again."
    exit 1
fi

