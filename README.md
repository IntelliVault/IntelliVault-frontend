# 🎨 IntelliVault Frontend

> ETHOnline 2025 Hackathon Project - Tokenized Real-World Assets Platform

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-cyan.svg)](https://tailwindcss.com/)

Built with **Blockscout MCP**, **Hardhat**, and **PayPal USD (PYUSD)** for ETHOnline 2025

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Sponsor Integration](#sponsor-integration)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [AI Agent Modes](#ai-agent-modes)
- [Development](#development)
- [Deployment](#deployment)

---

## 🎯 Overview

IntelliVault is a modern Web3 platform that tokenizes real-world assets (RWAs) using smart contracts deployed on Sepolia testnet. The frontend provides an intuitive interface for users to interact with tokenized assets, AI-powered blockchain analytics, and seamless wallet integration.

**Built For:** ETHOnline 2025 Hackathon  
**Main Sponsors:** Blockscout, Hardhat & PayPal USD (PYUSD)

---

## ✨ Key Features

- **🤖 Dual AI Agent System**
  - **Agent Mode**: Token trading with LangChain + WebSocket
  - **Query Mode**: Multi-chain analysis with Blockscout MCP Server
  
- **💼 Portfolio Management**: Real-time portfolio tracking and analytics
- **🏦 Vault Dashboard**: Total Value Locked (TVL) and asset metrics
- **🔗 Wallet Integration**: Reown AppKit (WalletConnect v2)
- **⚡ MetaMask Transactions**: One-click buy/sell with auto network switching
- **📊 Multi-Chain Support**: View blockchain data across 5+ networks
- **🎨 Modern UI**: Glassmorphic design with smooth animations

---

## 🛠️ Tech Stack

### Core Technologies

- **React 19.0** - UI framework
- **TypeScript 5.7** - Type safety
- **Vite 6.0** - Build tool & dev server
- **Tailwind CSS 4.0** - Styling
- **shadcn/ui** - Component library

### Blockchain Integration

- **Ethers.js v6.13** - Blockchain interactions
- **Wagmi 2.15** - React hooks for Ethereum
- **Reown AppKit 1.6** - Multi-wallet connection
- **Hardhat 2.22** - Smart contract development

### AI & Analytics

- **Blockscout MCP Server** - Multi-chain blockchain analytics (Query Mode)
- **LangChain 0.3** - AI agent orchestration (Agent Mode)
- **Gemini 2.0 Flash** - LLM provider
- **Socket.IO 4.8** - Real-time WebSocket communication

---

## 🏆 Sponsor Integration

### Blockscout MCP Server

Used for **Query Mode** - provides multi-chain blockchain analytics:

- Contract analysis across 5 chains (Ethereum, Sepolia, Base, Optimism, Arbitrum)
- Transaction history and gas analytics
- Token holdings and address information
- Smart contract verification status

**Integration:** The frontend's Query Mode directly calls the Blockscout MCP server on port 3001 for cross-chain blockchain intelligence.

### Hardhat

Used for smart contract development and deployment:

- Vault contract deployment
- RWA token contracts
- Local testing environment
- Contract verification

**Deployment Network:** Sepolia Testnet (Chain ID: 11155111)

### PayPal USD (PYUSD)

Used as the settlement and stablecoin currency:

- **Token:** PYUSD on Sepolia Testnet
- **Purpose:** Settlement currency for buying/selling tokenized RWAs
- **Contract:** `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **Integration:** All vault transactions use PYUSD as the payment token

**Features:**
- Buy RWA tokens with PYUSD
- Sell RWA tokens for PYUSD
- Portfolio value calculated in PYUSD
- Stablecoin-backed vault liquidity

---

## 🚀 Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible Web3 wallet

### Setup Steps

1. **Clone Repository**

```bash
cd frontend
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment**

Create `.env` file:

```env
# Smart Contract Addresses (Sepolia Testnet)
VITE_VAULT_ADDRESS=0xB6C58FDB4BBffeD7B7224634AB932518a29e4C4b
VITE_PYUSD_ADDRESS=0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9
VITE_RPC_URL=https://0xrpc.io/sep

# RWA Token Addresses (comma-separated)
VITE_STOCK_TOKENS=0x09572cED4772527f28c6Ea8E62B08C973fc47671,0xC411824F1695feeC0f9b8C3d4810c2FD1AB1000a,0x98e565A1d46d4018E46052C936322479431CA883

# WalletConnect Project ID (from https://cloud.walletconnect.com/)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

4. **Start Development Server**

```bash
npm run dev
```

Access at: `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_VAULT_ADDRESS` | Vault smart contract address | ✅ |
| `VITE_PYUSD_ADDRESS` | PYUSD token address | ✅ |
| `VITE_RPC_URL` | Sepolia RPC endpoint | ✅ |
| `VITE_STOCK_TOKENS` | RWA token addresses (comma-separated) | ✅ |
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | ✅ |

### Network Configuration

Default network: **Sepolia Testnet**
- Chain ID: `11155111`
- Explorer: `https://eth-sepolia.blockscout.com/`

---

## 📖 Usage

### Starting the Application

**Important:** The frontend requires backend AI agent servers to be running:

```bash
# Terminal 1 - Vault AI Agent (Agent Mode)
cd agent
npm run dev:ai
# Runs on port 3002

# Terminal 2 - Blockscout MCP Server (Query Mode)
cd agent
npm run dev
# Runs on port 3001

# Terminal 3 - Frontend
cd frontend
npm run dev
# Runs on port 5173
```

### User Flow

1. **Connect Wallet** - Click "Connect Wallet" in header
2. **View Dashboard** - Navigate to User page to see portfolio
3. **Chat with AI** - Use Chat page for AI-powered interactions
4. **View Analytics** - Check Vault page for global metrics

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # Navigation with wallet
│   │   └── ...              # Feature components
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Chat.tsx         # AI chat interface
│   │   ├── User.tsx         # Portfolio dashboard
│   │   └── Vault.tsx        # Vault analytics
│   ├── services/
│   │   └── aiAgentService.ts # WebSocket client for Agent Mode
│   ├── lib/
│   │   ├── contracts.ts     # Contract ABIs
│   │   └── readers.ts       # Blockchain read functions
│   ├── config/
│   │   └── constants.ts     # Contract addresses & network config
│   ├── App.tsx              # Router configuration
│   └── main.tsx             # Entry point with providers
├── .env                     # Environment variables
├── package.json
└── README.md
```

---

## 🤖 AI Agent Modes

### Agent Mode (LangChain + WebSocket)

**Port:** 3002  
**Purpose:** Token trading and vault operations  
**Technology:** LangChain + Gemini 2.0 Flash + Socket.IO

**Features:**
- Get real-time token prices
- Calculate buy/sell costs
- Prepare MetaMask transactions
- Execute buy/sell operations

**Example Queries:**
```
- "What's the Tesla token price?"
- "How much to buy 5 Google tokens?"
- "Buy 3 Microsoft tokens"
- "Sell 2 Tesla tokens"
```

**Implementation:**
```typescript
import { aiAgentService } from '@/services/aiAgentService';

// Connect to WebSocket
aiAgentService.connect();

// Send message
await aiAgentService.sendMessage("What's the Tesla token price?");

// Listen for responses
aiAgentService.onMessage((response) => {
  console.log(response.data.response);
  console.log(response.data.toolCalls); // Tool execution details
});
```

### Query Mode (Blockscout MCP)

**Port:** 3001  
**Purpose:** Multi-chain blockchain analytics  
**Technology:** Blockscout MCP Server + Model Context Protocol

**Features:**
- Cross-chain transaction history (5 chains)
- Smart contract analysis and verification
- Token holdings across networks
- Gas spend calculations
- Address risk assessment

**Supported Chains:**
- Ethereum Mainnet (1)
- Sepolia Testnet (11155111)
- Base Sepolia (84532)
- Optimism (10)
- Arbitrum One (42161)

**Example Queries:**
```
- "Show transactions for 0x49f5... across all chains"
- "Analyze contract 0xB6C5... on Sepolia"
- "What tokens does 0x49f5... hold?"
- "Calculate total gas spent for 0x49f5..."
```

**Implementation:**
```typescript
// Direct HTTP call to MCP server
const response = await fetch('http://localhost:3001/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Analyze contract 0xB6C5... on Sepolia"
  })
});

const data = await response.json();
console.log(data.response); // AI analysis
console.log(data.toolCalls); // MCP tool executions
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Wallet connects successfully
- [ ] Agent Mode: Token price queries work
- [ ] Agent Mode: MetaMask transactions execute
- [ ] Query Mode: Cross-chain analysis works
- [ ] Portfolio dashboard loads data
- [ ] Vault analytics display correctly
- [ ] Responsive design on mobile

### Test Queries

**Agent Mode:**
```
1. "What's the Tesla token price?"
2. "Buy 5 Google tokens"
```

**Query Mode:**
```
1. "Show transactions for 0x49f51e3C94B459677c3B1e611DB3E44d4E6b1D55"
2. "Analyze contract 0xB6C58FDB4BBffeD7B7224634AB932518a29e4C4b on Sepolia"
```

---

## 🐛 Troubleshooting

### Common Issues

**1. AI Agent Connection Failed**
- Ensure agent server is running: `npm run dev:ai` (port 3002)
- Check console for WebSocket errors
- Verify server health: `curl http://localhost:3002/health`

**2. Query Mode Not Working**
- Ensure MCP server is running: `npm run dev` (port 3001)
- Check Docker is running (MCP uses Docker)
- Verify server health: `curl http://localhost:3001/health`

**3. Wallet Connection Failed**
- Verify WalletConnect Project ID in `.env`
- Check MetaMask is installed
- Try clearing browser cache

**4. Transaction Failed**
- Ensure you're on Sepolia testnet
- Check PYUSD balance
- Get testnet tokens from faucet

**5. Portfolio Not Loading**
- Verify contract addresses in `.env`
- Check RPC URL is working
- Ensure wallet is connected

---

## 📚 Resources

### Documentation
- [Blockscout MCP Documentation](https://docs.blockscout.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [LangChain Documentation](https://js.langchain.com/)
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [Reown AppKit](https://docs.reown.com/appkit/overview)

### Smart Contracts
- **Vault Contract:** `0xB6C58FDB4BBffeD7B7224634AB932518a29e4C4b`
- **PYUSD Token:** `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **Network:** Sepolia Testnet
- **Explorer:** https://eth-sepolia.blockscout.com/

---

## 🏆 ETHOnline 2025

### Sponsor Bounties

**Blockscout** - Multi-chain blockchain analytics
- Integrated MCP server for Query Mode
- Cross-chain transaction analysis
- Smart contract verification

**Hardhat** - Smart contract development
- Vault contract deployment
- RWA token contracts
- Testing infrastructure

**PayPal USD (PYUSD)** - Stablecoin settlement
- PYUSD as settlement currency
- Buy/sell RWA tokens with PYUSD
- Stablecoin-backed vault liquidity

### Project Links
- **Demo:** [Coming Soon]
- **Video:** [Coming Soon]
- **GitHub:** [Repository Link]

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- **Blockscout** - For the amazing MCP server and multi-chain analytics
- **Hardhat** - For the best-in-class smart contract development tools
- **PayPal USD** - For providing PYUSD as a stablecoin settlement layer
- **ETHOnline 2025** - For the opportunity to build and innovate
- **Google Gemini** - For the powerful LLM capabilities
- **Reown/WalletConnect** - For seamless wallet integration

---

## 📞 Contact

For questions or issues, please open a GitHub issue or reach out to the team.

**Built with ❤️ for ETHOnline 2025**
