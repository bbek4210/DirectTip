# DirectTip - Complete Setup & Integration Guide

## Quick Start

### Prerequisites
- Node.js 18+ with npm
- Phantom wallet browser extension
- MongoDB Atlas account (backend only)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in `Be/` directory:**
   ```bash
   PORT=5001
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/directtip
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start development server:**
   ```bash
   npm run start:dev
   ```
   Backend will run on **http://localhost:5001**

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file in `Fe/` directory:**
   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on **http://localhost:3000**

## File Structure Overview

```
DirectTip/
├── Be/                          # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── config.ts           # Configuration
│   │   ├── db/
│   │   │   ├── connect.ts      # MongoDB connection
│   │   │   └── models.ts       # Mongoose schemas
│   │   ├── controllers/        # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── creatorController.ts
│   │   │   └── tipController.ts
│   │   ├── routes/             # Express routes
│   │   │   ├── auth.ts
│   │   │   ├── creator.ts
│   │   │   └── tips.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   └── utils/
│   │       └── helpers.ts
│   ├── build/                  # Compiled JS
│   │   └── index.js
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
└── Fe/                          # Frontend (Next.js + React)
    ├── app/
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx            # Home page
    │   ├── lib/
    │   │   ├── api-config.ts   # API endpoints
    │   │   ├── api-service.ts  # API calls
    │   │   └── api-types.ts    # TypeScript types
    │   ├── hooks/              # Custom hooks
    │   │   ├── useAuth.ts
    │   │   ├── useTips.ts
    │   │   └── useAuthInitialization.ts
    │   ├── store/              # Zustand stores
    │   │   ├── authStore.ts
    │   │   └── tipStore.ts
    │   ├── components/         # React components
    │   │   ├── Navbar.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── TipModal.tsx
    │   │   └── TipOverlay.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── tip/
    │   │   └── [wallet]/
    │   │       └── page.tsx
    │   ├── overlay/
    │   │   └── [creatorId]/
    │   │       └── page.tsx
    │   ├── providers.tsx       # Query & Auth provider
    │   └── globals.css
    ├── extension/              # Chrome extension
    │   ├── manifest.json
    │   ├── popup.html
    │   ├── popup.js
    │   ├── content.js
    │   └── styles.css
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    └── postcss.config.mjs
```

## Backend Architecture

### Data Flow
```
HTTP Request → Express Route → Controller → Service/Model → MongoDB → Response
```

### Models
- **User**: email, walletAddress, role (creator/viewer)
- **Creator**: youtubeChannelId, overlayUrl, totalDonations
- **Tip**: senderWallet, receiverWallet, amount, token, status (pending/confirmed/failed)

### API Endpoints

#### Authentication
```
POST /api/auth/register      - Create new account
POST /api/auth/login         - Authenticate user
```

#### Creator Management
```
GET  /api/creator/:channelId           - Get creator by YouTube channel ID
GET  /api/creator/id/:creatorId        - Get creator by ID
POST /api/creator/update               - Update creator info
```

#### Tips
```
POST /api/tips                         - Create new tip
GET  /api/tips/creator/:creatorId      - Get tips received by creator
GET  /api/tips/overlay/:creatorId      - Get confirmed tips for overlay
POST /api/tips/:tipId/status           - Update tip status
GET  /api/tips/stats/:creatorId        - Get creator statistics
```

## Frontend Architecture

### Three-Layer State Management

**Layer 1: API Service**
```typescript
// app/lib/api-service.ts
authService.register(email, wallet, role)
creatorService.getByChannelId(id)
tipService.create(...)
```

**Layer 2: Data Fetching (TanStack Query)**
```typescript
// app/hooks/useAuth.ts
useRegisterMutation()
useLoginMutation()
useCreatorByChannelId(id)

// app/hooks/useTips.ts
useCreateTipMutation()
useTipsByCreator(id)
useOverlayTips(id)
```

**Layer 3: State Management (Zustand)**
```typescript
// app/store/authStore.ts
useAuthStore() -> { user, creator, register(), login(), logout() }

// app/store/tipStore.ts
useTipStore() -> { tips, filteredTips, setTips(), addTip() }
```

### Component Integration

```typescript
export function MyComponent() {
  // 1. Get persistent auth state
  const { user } = useAuthStore();
  
  // 2. Fetch data with auto-refresh
  const { data: tips } = useTipsByCreator(user?._id);
  
  // 3. Mutate with mutation state
  const mutation = useCreateTipMutation();
  
  return (
    <div>
      {tips?.map(tip => <div key={tip._id}>{tip.amount}</div>)}
      <button 
        onClick={() => mutation.mutateAsync({...})}
        disabled={mutation.isPending}
      >
        Send Tip
      </button>
    </div>
  );
}
```

## Key Features Explained

### 1. Auto-Refetch
Queries automatically refresh at set intervals:
- **Creator tips**: Every 5 seconds
- **Overlay tips**: Every 2 seconds (real-time effect)
- **Statistics**: Every 10 seconds

Disable or customize in `useAuth.ts` or `useTips.ts`:
```typescript
const { data: tips } = useQuery({
  queryFn: () => tipService.getByCreator(id),
  refetchInterval: 3000, // Change interval
});
```

### 2. Persistence
Auth state auto-saves to localStorage:
```typescript
// Automatically persists
const { setUser } = useAuthStore();
setUser(user); // localStorage.setItem('user', JSON.stringify(user))

// Auto-loads on app start
const { initializeFromStorage } = useAuthStore.getState();
initializeFromStorage(); // Called in Providers component
```

### 3. Error Handling
All API calls include error handling:
```typescript
try {
  const user = await authService.register(email, wallet, role);
} catch (error) {
  console.error(error.message); // "API Error: 400 - Email already exists"
}
```

### 4. Query Invalidation
Mutations auto-invalidate related queries:
```typescript
const createTipMutation = useCreateTipMutation();
await createTipMutation.mutateAsync(tipData);
// Automatically refetches: tips, stats, overlay data
```

## Environment Variables

### Backend (.env)
```
PORT=5001                          # Express server port
MONGO_URI=mongodb+srv://...       # MongoDB connection string
FRONTEND_URL=http://localhost:3000 # For CORS
NODE_ENV=development              # dev or production
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001  # Backend API base URL
```

## Testing Flow

### Test User Registration
1. Open http://localhost:3000/register
2. Enter email: `test@example.com`
3. Click "Connect" → Phantom wallet popup
4. Select account and approve
5. Choose role (creator/viewer)
6. Submit → Should redirect to dashboard

### Test Sending a Tip
1. Open http://localhost:3000/tip/[creator-wallet]
2. Enter amount (e.g., 0.1 SOL)
3. Add message (optional)
4. Click "Send Tip"
5. Phantom signs transaction
6. Tip recorded in backend after confirmation

### Test Creator Dashboard
1. Register as creator
2. Navigate to http://localhost:3000/dashboard
3. View stats and received tips
4. Tips should update every 5 seconds

### Test Overlay
1. Get creator ID from dashboard
2. Open http://localhost:3000/overlay/[creator-id]
3. Open in OBS as Browser Source
4. Send tips in another window
5. See real-time alerts on overlay (updates every 2s)

## Debugging

### Check Backend Connection
```bash
curl http://localhost:5001/api/health
# Should return: {"status":"ok"}
```

### Check Frontend API Config
```typescript
// In browser console
import { API_ENDPOINTS } from '@/lib/api-config';
console.log(API_ENDPOINTS);
```

### Check Auth Store State
```typescript
// In browser console
import { useAuthStore } from '@/store/authStore';
const state = useAuthStore.getState();
console.log(state.user);
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR
4. Perform actions to see API calls

### Enable React Query DevTools
```typescript
// In app/providers.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to return:
<ReactQueryDevtools initialIsOpen={false} />
```

## Common Issues & Solutions

### Issue: "Cannot GET /api/..." (404)
**Cause**: Frontend can't reach backend
**Solution**: 
- Check backend is running on 5001
- Check NEXT_PUBLIC_BACKEND_URL in .env.local
- Restart both servers

### Issue: Wallet connection fails
**Cause**: Phantom wallet not installed
**Solution**: Install Phantom extension

### Issue: Data not updating
**Cause**: Query disabled or not refetching
**Solution**:
- Check `enabled: !!creatorId` in query hooks
- Check refetchInterval is set
- Open DevTools → Network to see if requests are made

### Issue: Registration fails with email error
**Cause**: Email already registered
**Solution**: Use different email or delete user from MongoDB

### Issue: Tips not appearing in dashboard
**Cause**: Query not invalidated after mutation
**Solution**: Check useTipsByCreator hook has onSuccess invalidation

## Production Deployment

### Backend (Vercel/Railway/Heroku)
```bash
# Set environment variables
PORT=5001
MONGO_URI=<production-db>
FRONTEND_URL=<production-frontend>

# Deploy
npm run build
npm start
```

### Frontend (Vercel)
```bash
# Set environment variable
NEXT_PUBLIC_BACKEND_URL=<production-backend>

# Deploy via Vercel CLI
vercel deploy
```

## API Documentation

See `Fe/API_INTEGRATION.md` for detailed API documentation including:
- Complete endpoint reference
- Request/response examples
- Data types and interfaces
- Error handling
- Best practices

## Troubleshooting Commands

```bash
# Kill process on port 5001 (backend)
lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install
```

## Next Steps

1. ✅ Backend running on 5001
2. ✅ Frontend running on 3000
3. ✅ API integrated with service layer
4. ⏳ Test all flows
5. ⏳ Deploy to production
6. ⏳ Set up Chrome extension

See extension README for extension setup instructions.
