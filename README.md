# DirectTip: Solana Tipping for YouTube Live

DirectTip is a comprehensive platform that enables real-time, non-custodial tipping for YouTube creators using the Solana blockchain.

## 🌟 Project Components

### 1. Chrome Extension (`/extension`)
- **Non-Custodial**: Connects directly to Phantom Wallet.
- **YouTube Injection**: Automatically injects a tipping overlay into YouTube watch pages.
- **Real-Time Feed**: Displays tip status (Pending -> Confirmed) with Solscan links.
- **Multi-Token**: Supports SOL and USDC transfers.

### 2. Next.js Web Application (`/app`)
- **Landing Page**: A premium, Solana-branded home page explaining the platform.
- **Creator Dashboard**: A dedicated interface at `/dashboard` for creators to track tips in real-time.
- **Backend API**: Minimal indexing service at `/api/tips` to track tip history.

## 🚀 Quick Start

### Extension Setup
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension` folder.
4. Click the DirectTip icon in your toolbar to configure your **Creator Wallet**.

### Web App Setup
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Visit `http://localhost:3000` to see the landing page.
4. Visit `http://localhost:3000/dashboard` to see the tip tracker.

## 🛠️ Tech Stack
- **Blockchain**: Solana Web3.js
- **Frontend**: Next.js 15+, Tailwind CSS, Geist Sans
- **Extension**: Manifest V3, Vanilla JS/CSS
- **Backend**: Next.js API Routes (Route Handlers)

## 🔒 Security
- DirectTip never stores your private keys.
- All transactions are signed locally via your Phantom Wallet.
- Direct blockchain interaction ensures transparency and speed.
