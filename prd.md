# DirectTip — MVP Engineering PRD

## Overview

DirectTip is a **Solana-based non-custodial tipping platform** that allows viewers to tip creators in **SOL/USDC** directly to their wallet while showing real-time donation alerts in stream overlays.

It combines:

* Creator onboarding platform
* YouTube donate button injection (Chrome extension MVP)
* Real-time OBS overlay alerts
* Direct wallet-to-wallet crypto payments

---

# Tech Stack

## Frontend

* Next.js (App Router)
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand
* Socket.io client

## Backend

* Node.js
* TypeScript
* Express.js
* MongoDB
* Mongoose
* JWT auth
* bcrypt
* Socket.io

## Solana Libraries

* `@solana/web3.js` → SOL transfers + tx verification
* `@solana/spl-token` → USDC transfers
* Solana Wallet Adapter → wallet connection
* Helius / QuickNode → RPC provider

---

# Database Collections

## users

```javascript
{
 id,
 name,
 email,
 password,
 role
}
```

## creators

```javascript
{
 id,
 userId,
 youtubeChannelId,
 walletAddress,
 overlayToken,
 totalTipsReceived
}
```

## tips

```javascript
{
 id,
 creatorId,
 senderWallet,
 receiverWallet,
 amount,
 tokenType,
 message,
 txSignature,
 status,
 createdAt
}
```

---

# Backend Folder Structure

```bash
src/
 ├── config/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── services/
 ├── utils/
 ├── app.ts
 └── server.ts
```

---

# API Endpoints

## Auth

### POST /api/auth/register

Register user

### POST /api/auth/login

Login user

### GET /api/auth/me

Get profile

---

## Creator

### POST /api/creator/register-channel

Register YouTube channel + wallet

### GET /api/creator/:channelId

Fetch creator wallet by channel ID

### GET /api/creator/dashboard

Fetch creator dashboard stats

---

## Tips

### POST /api/tips/create

Create pending tip

### POST /api/tips/confirm

Confirm blockchain transaction

### GET /api/tips/history

Get tip history

---

## Overlay

### GET /api/overlay/url

Generate overlay URL

### GET /api/overlay/recent/:creatorId

Get recent donations

---

## Health

### GET /api/health

Health check endpoint

---

# Chrome Extension Flow

1. User installs extension
2. Opens YouTube video
3. Extension detects creator channel
4. Calls backend API
5. Injects donate button beside subscribe button

---

# Overlay Flow

Viewer tips creator
→ Transaction confirmed
→ Backend emits socket event
→ Overlay shows donation alert

Socket event:

```javascript
new_tip_received
```

---

# Deployment

Frontend → Vercel
Backend → Railway / Render
Database → MongoDB Atlas
RPC → Helius

---

# MVP Build Order

### Phase 1

Auth + DB models + creator onboarding

### Phase 2

SOL tipping flow

### Phase 3

USDC tipping flow

### Phase 4

OBS overlay alerts

### Phase 5

Chrome extension

### Phase 6

Deployment

---

# Core MVP Goal

Viewer sends crypto → creator receives directly → live alert appears instantly.

This is the real wow factor of DirectTip.
