# Backend Architecture

## Project Structure

```
src/
├── index.ts                 # Main entry point
├── config.ts               # Environment config
├── db/
│   ├── models.ts          # MongoDB schemas & models
│   └── connection.ts      # DB connection logic
├── controllers/
│   ├── authController.ts  # Auth business logic
│   ├── creatorController.ts # Creator business logic
│   └── tipController.ts   # Tip business logic
└── routes/
    ├── auth.ts            # Auth routes
    ├── creator.ts         # Creator routes
    └── tips.ts            # Tip routes
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Creator Management
- `GET /api/creator/:channelId` - Get creator by YouTube channel ID
- `GET /api/creator/id/:creatorId` - Get creator by ID
- `POST /api/creator/update` - Update creator info

### Tips
- `POST /api/tips` - Create a new tip
- `GET /api/tips/creator/:creatorId` - Get all tips for creator
- `GET /api/tips/overlay/:creatorId` - Get confirmed tips for overlay
- `POST /api/tips/:tipId/status` - Update tip status
- `GET /api/tips/stats/:creatorId` - Get statistics for creator

### Health
- `GET /api/health` - Health check

## Running the Server

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production mode (after build)
npm start
```

## Environment Variables

```
MONGO_URI=mongodb+srv://...
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Models

### User
- email (unique)
- walletAddress
- role (creator | viewer)
- createdAt

### Creator
- userId (reference to User)
- youtubeChannelId
- walletAddress
- overlayUrl
- totalDonations
- createdAt

### Tip
- senderWallet
- receiverWallet
- amount
- token (SOL | USDC)
- message
- txSignature
- status (pending | confirmed | failed)
- creatorId (reference to Creator)
- createdAt
