# Solcial - Social Media on Solana

A decentralized social media platform built on Solana blockchain with React Native mobile app and NestJS backend.

## 🏗️ Monorepo Structure

```
solcial/
├── apps/
│   ├── mobile/          # React Native mobile app (Expo)
│   └── backend/         # NestJS backend API
├── packages/            # Shared packages (future)
└── README.md
```

## 📱 Apps

### Mobile App
- **Tech Stack**: React Native, Expo, TypeScript
- **Features**: Social feed, wallet, mini apps, messaging
- **Location**: `apps/mobile/`

### Backend API
- **Tech Stack**: NestJS, MongoDB, Solana Web3.js
- **Features**: User management, posts, wallet, mini apps
- **Location**: `apps/backend/`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- MongoDB
- Solana CLI (for devnet)

### Installation

```bash
# Install dependencies for all apps
pnpm install

# Or install individually
cd apps/mobile && pnpm install
cd apps/backend && pnpm install
```

### Development

```bash
# Run mobile app
cd apps/mobile
pnpm start

# Run backend
cd apps/backend
pnpm start:dev
```

## 🎮 Features

- **Social Feed**: Create posts, like, comment, and share
- **Wallet**: Manage SOL and tokens
- **Mini Apps**: 
  - Token Swap
  - Food Delivery
  - Dice Game
  - Coin Flip
  - Lucky Spin
  - Daily Airdrop
- **Messaging**: Real-time chat
- **Profile**: User profiles with followers

## 🔧 Tech Stack

- **Frontend**: React Native, Expo, TypeScript, TailwindCSS (NativeWind)
- **Backend**: NestJS, MongoDB, Mongoose
- **Blockchain**: Solana Web3.js, Jupiter Aggregator
- **Push Notifications**: Firebase Cloud Messaging
- **State Management**: React Query

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
