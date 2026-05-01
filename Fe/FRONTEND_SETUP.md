# DirectTip Frontend - API & State Management Setup

## Architecture

### API Configuration
All API calls are centralized in `app/lib/api-config.ts`:
- **Base URL**: Configured via `NEXT_PUBLIC_BACKEND_URL` environment variable (default: http://localhost:5001)
- **Endpoints**: Defined in `API_ENDPOINTS` object for easy reuse across the app
- **Fetch Wrapper**: `fetchAPI()` function handles all HTTP requests with error handling

### State Management
Uses **Zustand** for lightweight, scalable state management:

#### Auth Store (`app/store/authStore.ts`)
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, creator, isLoading, error, register, login, logout } = useAuthStore();
```

#### Tip Store (`app/store/tipStore.ts`)
```typescript
import { useTipStore } from '@/store/tipStore';

const { tips, filteredTips, addTip, updateTipStatus } = useTipStore();
```

### Data Fetching & Mutations
Uses **TanStack Query (React Query)** for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

#### Auth Hooks (`app/hooks/useAuth.ts`)
```typescript
// Register
const { mutate: register, isPending } = useRegisterMutation();

// Login
const { mutate: login, isPending } = useLoginMutation();

// Get creator
const { data: creatorData, isLoading } = useCreatorById(creatorId);

// Update creator
const { mutate: updateCreator, isPending } = useUpdateCreatorMutation();
```

#### Tips Hooks (`app/hooks/useTips.ts`)
```typescript
// Create tip
const { mutate: createTip, isPending } = useCreateTipMutation();

// Get tips (auto-refetch every 5s)
const { data: tipsData, isLoading } = useTipsByCreator(creatorId);

// Get overlay tips (auto-refetch every 2s)
const { data: overlayTips } = useOverlayTips(creatorId);

// Update tip status
const { mutate: updateStatus } = useUpdateTipStatusMutation();

// Get statistics
const { data: statsData } = useTipStats(creatorId);
```

## File Structure

```
app/
├── lib/
│   ├── api-config.ts       # API configuration & endpoints
│   └── api-types.ts        # TypeScript interfaces
├── store/
│   ├── authStore.ts        # Zustand auth store
│   └── tipStore.ts         # Zustand tip store
├── hooks/
│   ├── useAuth.ts          # TanStack Query auth hooks
│   └── useTips.ts          # TanStack Query tip hooks
├── components/
│   ├── Dashboard.tsx       # Uses useAuthStore + useTipsByCreator
│   ├── TipModal.tsx        # Uses useCreateTipMutation
│   └── TipOverlay.tsx      # Uses useOverlayTips
├── providers.tsx           # QueryClientProvider wrapper
└── layout.tsx              # Wraps app with Providers
```

## Usage Examples

### Using Zustand Store
```typescript
import { useAuthStore } from '@/store/authStore';

export function MyComponent() {
  const { user, logout } = useAuthStore();
  
  return (
    <div>
      <p>Hello, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using TanStack Query Hook
```typescript
import { useTipsByCreator } from '@/hooks/useTips';

export function MyComponent({ creatorId }: { creatorId: string }) {
  const { data: tipsData, isLoading, error } = useTipsByCreator(creatorId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {tipsData?.tips.map(tip => (
        <div key={tip._id}>{tip.amount} {tip.token}</div>
      ))}
    </div>
  );
}
```

### Combining Stores and Queries
```typescript
import { useAuthStore } from '@/store/authStore';
import { useTipsByCreator } from '@/hooks/useTips';
import { useTipStore } from '@/store/tipStore';

export function Dashboard() {
  const { user } = useAuthStore();
  const { tips, addTip } = useTipStore();
  const { data: tipsData } = useTipsByCreator(user?._id || null);
  
  useEffect(() => {
    if (tipsData?.tips) {
      tips.forEach(tip => addTip(tip));
    }
  }, [tipsData]);
  
  return <div>Dashboard</div>;
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Install Zustand and TanStack Query
npm install zustand @tanstack/react-query

# Start development server
npm run dev
```

## API Endpoints

All endpoints are defined in `API_ENDPOINTS`:

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Creator
- `GET /api/creator/:channelId` - Get by YouTube channel
- `GET /api/creator/id/:creatorId` - Get by creator ID
- `POST /api/creator/update` - Update creator info

### Tips
- `POST /api/tips` - Create new tip
- `GET /api/tips/creator/:creatorId` - Get tips for creator
- `GET /api/tips/overlay/:creatorId` - Get tips for overlay
- `POST /api/tips/:tipId/status` - Update tip status
- `GET /api/tips/stats/:creatorId` - Get statistics

## Best Practices

1. **Always use hooks** - Don't make direct fetch calls in components
2. **Use stores for UI state** - Use Zustand for things like UI toggles, filters
3. **Use queries for server state** - Use TanStack Query for API data
4. **Leverage API_CONFIG** - Always import endpoints from `api-config.ts`
5. **Type safety** - Use types from `api-types.ts` for all API responses

## Performance Optimization

- **Stale Time**: 5 minutes (queries won't refetch unless explicitly invalidated)
- **Cache Time**: 10 minutes (data is kept in memory)
- **Auto-refetch**: Overlay tips refetch every 2 seconds for real-time updates
- **Mutations**: Automatically invalidate relevant queries on success
