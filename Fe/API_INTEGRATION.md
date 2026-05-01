# DirectTip - API Integration Guide

## Overview

The frontend is fully integrated with the backend API using a layered architecture:

```
Components → Hooks (TanStack Query) → Services (API calls) → Backend API
                ↓
           Zustand Stores (Local state)
```

## Architecture Layers

### 1. API Configuration Layer
**File:** `app/lib/api-config.ts`
- Base URL configuration via environment variables
- Centralized endpoint definitions
- Fetch wrapper with error handling

### 2. API Service Layer
**File:** `app/lib/api-service.ts`
- Auth service: register, login
- Creator service: get, update
- Tip service: create, get, update status
- Health check service

**Example:**
```typescript
import { authService } from '@/lib/api-service';

const user = await authService.register(email, wallet, role);
```

### 3. Data Fetching Layer (TanStack Query)
**Files:** `app/hooks/useAuth.ts`, `app/hooks/useTips.ts`
- Mutations for POST/PUT operations
- Queries for GET operations with auto-refetch
- Error handling and cache invalidation

**Example:**
```typescript
import { useRegisterMutation } from '@/hooks/useAuth';

const registerMutation = useRegisterMutation();
await registerMutation.mutateAsync({ email, walletAddress, role });
```

### 4. State Management Layer (Zustand)
**Files:** `app/store/authStore.ts`, `app/store/tipStore.ts`
- Global state for auth and tips
- localStorage persistence
- Simplified state updates

**Example:**
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, logout } = useAuthStore();
```

### 5. Component Layer
Use hooks and stores together:
```typescript
export function MyComponent() {
  const { user } = useAuthStore();
  const { data: tips } = useTipsByCreator(user?._id || null);
  const registerMutation = useRegisterMutation();
  
  return <div>{/* Use data */}</div>;
}
```

## API Endpoints Reference

### Auth Endpoints

#### Register
```typescript
POST /api/auth/register
Body: {
  email: string
  walletAddress: string
  role: 'creator' | 'viewer'
}
Response: { user: User }
```

#### Login
```typescript
POST /api/auth/login
Body: { email: string }
Response: { user: User }
```

### Creator Endpoints

#### Get by Channel ID
```typescript
GET /api/creator/:channelId
Response: { creator: Creator }
```

#### Get by Creator ID
```typescript
GET /api/creator/id/:creatorId
Response: { creator: Creator }
```

#### Update Creator
```typescript
POST /api/creator/update
Body: {
  userId: string
  youtubeChannelId: string
  walletAddress: string
}
Response: { creator: Creator }
```

### Tips Endpoints

#### Create Tip
```typescript
POST /api/tips
Body: {
  senderWallet: string
  receiverWallet: string
  amount: number
  token: 'SOL' | 'USDC'
  message?: string
  txSignature?: string
  creatorId?: string
}
Response: { tip: Tip }
```

#### Get Creator Tips
```typescript
GET /api/tips/creator/:creatorId
Response: { tips: Tip[] }
Auto-refetch every 5 seconds
```

#### Get Overlay Tips
```typescript
GET /api/tips/overlay/:creatorId
Response: { tips: Tip[] }
Auto-refetch every 2 seconds
```

#### Update Tip Status
```typescript
POST /api/tips/:tipId/status
Body: { status: 'pending' | 'confirmed' | 'failed' }
Response: { tip: Tip }
```

#### Get Stats
```typescript
GET /api/tips/stats/:creatorId
Response: {
  stats: {
    totalAmount: number
    totalCount: number
    avgAmount: number
  }
}
```

## Usage Examples

### Example 1: Register New User
```typescript
import { useRegisterMutation } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export function RegisterForm() {
  const { setUser } = useAuthStore();
  const registerMutation = useRegisterMutation();
  
  const handleRegister = async () => {
    try {
      const user = await registerMutation.mutateAsync({
        email: 'user@example.com',
        walletAddress: 'userwalletaddress',
        role: 'creator',
      });
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return <button onClick={handleRegister}>Register</button>;
}
```

### Example 2: Display Creator Dashboard
```typescript
import { useAuthStore } from '@/store/authStore';
import { useTipsByCreator, useTipStats } from '@/hooks/useTips';

export function Dashboard() {
  const { user } = useAuthStore();
  const { data: tips, isLoading } = useTipsByCreator(user?._id || null);
  const { data: stats } = useTipStats(user?._id || null);
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total: {stats?.totalAmount} SOL</p>
      <p>Tips: {stats?.totalCount}</p>
      {tips?.map(tip => (
        <div key={tip._id}>{tip.amount} {tip.token}</div>
      ))}
    </div>
  );
}
```

### Example 3: Send a Tip
```typescript
import { useCreateTipMutation } from '@/hooks/useTips';

export function SendTip() {
  const createTipMutation = useCreateTipMutation();
  
  const handleSendTip = async () => {
    try {
      const tip = await createTipMutation.mutateAsync({
        senderWallet: 'sender-wallet',
        receiverWallet: 'receiver-wallet',
        amount: 0.5,
        token: 'SOL',
        message: 'Love your stream!',
      });
      console.log('Tip sent:', tip);
    } catch (error) {
      console.error('Failed to send tip:', error);
    }
  };
  
  return <button onClick={handleSendTip}>Send Tip</button>;
}
```

### Example 4: Real-time Overlay
```typescript
import { useOverlayTips } from '@/hooks/useTips';

export function TipOverlay({ creatorId }: { creatorId: string }) {
  const { data: tips } = useOverlayTips(creatorId);
  
  if (!tips?.length) return null;
  
  const latestTip = tips[0];
  return (
    <div>
      New Tip: {latestTip.amount} {latestTip.token} from {latestTip.senderWallet}
    </div>
  );
}
```

## Data Types

### User
```typescript
interface User {
  _id: string;
  email: string;
  walletAddress: string;
  role: 'creator' | 'viewer';
  createdAt: string;
}
```

### Creator
```typescript
interface Creator {
  _id: string;
  userId: string;
  youtubeChannelId?: string;
  walletAddress: string;
  overlayUrl: string;
  totalDonations: number;
  createdAt: string;
}
```

### Tip
```typescript
interface Tip {
  _id: string;
  senderWallet: string;
  receiverWallet: string;
  amount: number;
  token: 'SOL' | 'USDC';
  message?: string;
  txSignature?: string;
  status: 'pending' | 'confirmed' | 'failed';
  creatorId: string;
  createdAt: string;
}
```

## Error Handling

All API calls are wrapped with error handling. Errors are thrown with descriptive messages:

```typescript
try {
  await authService.register(email, wallet, role);
} catch (error) {
  console.error(error.message); // e.g., "API Error: 400"
}
```

## Query Configuration

### Auto-refetch Intervals
- Creator tips: 5 seconds
- Overlay tips: 2 seconds
- Statistics: 10 seconds

### Cache Configuration
- Stale time: 5 minutes (5000ms for overlay)
- Cache time: 10 minutes
- Retry: 1 time on failure

### Customizing
```typescript
export const useTipsByCreator = (creatorId: string | null) => {
  return useQuery({
    queryKey: ['tips', 'creator', creatorId],
    queryFn: () => tipService.getByCreator(creatorId!),
    enabled: !!creatorId,
    refetchInterval: 5000, // ← Change here
    staleTime: 2000,        // ← Or here
  });
};
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

## Debugging

### Enable Query Logging
```typescript
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  logger: {
    log: (message) => console.log('[Query]', message),
    warn: (message) => console.warn('[Query]', message),
    error: (message) => console.error('[Query]', message),
  },
});
```

### Check Store State
```typescript
const state = useAuthStore.getState();
console.log(state.user);
```

### Monitor Cache
Use React Query DevTools:
```bash
npm install @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Best Practices

1. **Always use hooks** - Don't make direct API calls
2. **Use services for complex logic** - Keep components clean
3. **Leverage auto-refetch** - For real-time data
4. **Handle errors properly** - Show user-friendly messages
5. **Persist important data** - Use localStorage via Zustand
6. **Type-safe endpoints** - Use API_ENDPOINTS object
7. **Cache invalidation** - Use queryClient.invalidateQueries()

## File Structure

```
app/
├── lib/
│   ├── api-config.ts       # Endpoints and fetch config
│   ├── api-service.ts      # Service functions
│   └── api-types.ts        # TypeScript interfaces
├── hooks/
│   ├── useAuth.ts          # Auth queries and mutations
│   ├── useTips.ts          # Tips queries and mutations
│   └── useAuthInitialization.ts # Init hook
├── store/
│   ├── authStore.ts        # Auth state
│   └── tipStore.ts         # Tips state
└── components/
    ├── Dashboard.tsx       # Example usage
    ├── TipModal.tsx        # Example usage
    └── TipOverlay.tsx      # Example usage
```

## Troubleshooting

### Issue: API calls returning 404
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Verify backend is running on port 5001
- Check endpoint paths match backend routes

### Issue: Data not updating
- Check query is enabled: `enabled: !!creatorId`
- Verify refetchInterval is set
- Check browser console for errors

### Issue: Auth state lost on refresh
- Ensure `initializeFromStorage()` is called
- Check localStorage in DevTools
- Verify `useAuthInitialization` hook is used

### Issue: Mutations not working
- Check network tab for failed requests
- Verify request body format matches backend
- Check error message in console
