#!/bin/bash

# Deploy Sorters Contract using Secret Key from .env
# This script reads the secret key from .env file and deploys to Stacks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Sorters Contract Deployment${NC}"
echo "=============================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create .env file from .env.example"
    echo "cp .env.example .env"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check if secret key is set
if [ -z "$STACKS_SECRET_KEY" ]; then
    echo -e "${RED}❌ Error: STACKS_SECRET_KEY not set in .env file${NC}"
    echo "Please add your Stacks secret key to .env file"
    exit 1
fi

# Check if network is set
if [ -z "$STACKS_NETWORK" ]; then
    echo -e "${YELLOW}⚠️  STACKS_NETWORK not set, defaulting to mainnet${NC}"
    STACKS_NETWORK="mainnet"
fi

# Check if contract name is set
if [ -z "$CONTRACT_NAME" ]; then
    CONTRACT_NAME="sorters"
fi

# Check if contract file exists
if [ ! -f "contracts/${CONTRACT_NAME}.clar" ]; then
    echo -e "${RED}❌ Error: Contract file not found: contracts/${CONTRACT_NAME}.clar${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will deploy to ${STACKS_NETWORK^^}${NC}"
if [ "$STACKS_NETWORK" = "mainnet" ]; then
    echo -e "${RED}⚠️  MAINNET deployment is PERMANENT and IRREVERSIBLE!${NC}"
fi
echo ""
echo "Contract: ${CONTRACT_NAME}"
echo "Network: ${STACKS_NETWORK}"
echo "Contract file: contracts/${CONTRACT_NAME}.clar"
echo ""

# Confirm deployment
read -p "Are you sure you want to deploy? (type 'yes' to continue): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "📦 Deploying contract..."

# Check if Stacks CLI is installed
if command -v stacks &> /dev/null; then
    echo "Using Stacks CLI..."
    
    # Determine network flag
    if [ "$STACKS_NETWORK" = "mainnet" ]; then
        NETWORK_FLAG="--mainnet"
    else
        NETWORK_FLAG="--testnet"
    fi
    
    # Deploy using Stacks CLI
    STACKS_PRIVATE_KEY="$STACKS_SECRET_KEY" \
    stacks deploy "$CONTRACT_NAME" "contracts/${CONTRACT_NAME}.clar" $NETWORK_FLAG
    
    echo ""
    echo -e "${GREEN}✅ Deployment initiated!${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "1. Wait for transaction confirmation"
    echo "2. Save the contract address from the output above"
    echo "3. Update frontend/.env.local with:"
    echo "   NEXT_PUBLIC_STACKS_NETWORK=${STACKS_NETWORK}"
    echo "   NEXT_PUBLIC_CONTRACT_ADDRESS=<your-contract-address>"
    echo "4. Verify on Stacks Explorer:"
    if [ "$STACKS_NETWORK" = "mainnet" ]; then
        echo "   https://explorer.stacks.co/?chain=mainnet"
    else
        echo "   https://explorer.stacks.co/?chain=testnet"
    fi
    
elif command -v clarinet &> /dev/null; then
    echo "Using Clarinet..."
    echo -e "${YELLOW}Note: Clarinet deployment with secret key requires additional setup${NC}"
    echo "Consider using Stacks CLI instead: npm install -g @stacks/cli"
    exit 1
else
    echo -e "${RED}❌ Error: Neither Stacks CLI nor Clarinet found${NC}"
    echo "Install Stacks CLI: npm install -g @stacks/cli"
    exit 1
fi


