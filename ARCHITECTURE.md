# SkillBox - Architecture Overview

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│           Mobile Apps (iOS/Android/Web)     │
│  ┌─────────────────────────────────────┐   │
│  │        React Native / Expo          │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │      UI Components           │   │   │
│  │  │   (NativeWind + Reanimated)  │   │   │
│  │  └──────────────────────────────┘   │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │    State Management          │   │   │
│  │  │  (Zustand + Context API)     │   │   │
│  │  └──────────────────────────────┘   │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │    Business Logic            │   │   │
│  │  │  (Hooks + Services)          │   │   │
│  │  └──────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│            Supabase Backend                 │
│  ┌─────────────────────────────────────┐   │
│  │      PostgreSQL Database            │   │
│  │    (with RLS & Policies)            │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │         Realtime Engine             │   │
│  │   (WebSocket subscriptions)         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │      Authentication Service         │   │
│  │   (JWT tokens, OAuth)               │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │        Storage Service              │   │
│  │   (Files, images, videos)           │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SkillBox/
├── app/                          # Screens (File-based routing)
│   ├── (auth)/                   # Auth group routes
│   ├── (student)/                # Student dashboard routes
│   ├── (creator)/                # Creator dashboard routes
│   ├── (tabs)/                   # Bottom tab navigation
│   ├── courses/                  # Course screens
│   ├── profile/                  # Profile screens
│   ├── settings/                 # Settings screens
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Entry point
│   ├── login.tsx                 # Login screen
│   └── signup.tsx                # Signup screen
│
├── components/                   # Reusable UI components
│   ├── common/                   # Shared components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── Toast.tsx
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── auth/                     # Auth-specific components
│   ├── student/                  # Student components
│   └── ...
│
├── src/                          # Source code
│   ├── components/               # Additional components
│   │   ├── ui/                   # UI components
│   │   ├── course/               # Course components
│   │   └── chat/                 # Chat components
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useChat.ts
│   │   ├── useRealtimeMessages.ts
│   │   └── useRealtimeNotifications.ts
│   │
│   ├── services/                 # API & Business logic
│   │   ├── supabase.ts           # Supabase client
│   │   ├── auth.ts               # Auth service
│   │   ├── courses.ts            # Courses service
│   │   ├── realtime-messaging.ts # Real-time messaging
│   │   ├── realtime-notifications.ts
│   │   └── realtime-progress.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── database.ts           # Database types
│   │   └── models.d.ts           # Model types
│   │
│   └── theme/                    # Theme configuration
│       └── index.ts              # Theme colors & hooks
│
├── context/                      # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   ├── EnhancedThemeContext.tsx  # Theme state
│   └── AIModelContext.tsx        # AI model state
│
├── lib/                          # Utilities & helpers
│   ├── supabase.ts               # Supabase setup
│   ├── configManager.ts          # Config management
│   └── ...
│
├── constants/                    # App constants
│   ├── Theme.ts                  # Theme constants
│   └── Colors.ts                 # Color palette
│
├── assets/                       # Static assets
│   ├── images/                   # Images
│   └── fonts/                    # Custom fonts
│
├── database/                     # Database schema
│   └── schema.sql                # Supabase SQL schema
│
└── config files                  # Configuration
    ├── app.json                  # Expo config
    ├── package.json              # Dependencies
    ├── tsconfig.json             # TypeScript config
    ├── tailwind.config.js        # TailwindCSS config
    └── babel.config.js           # Babel config
```

---

## 🔄 Data Flow

### Authentication Flow

```
User Input → useAuth Hook → Auth Service → Supabase Auth
     ↓                                           ↓
Update UI ← AuthContext ← Session State ← JWT Token
```

### Course Enrollment Flow

```
User Action → useCourses Hook → Courses Service → Supabase DB
      ↓                                               ↓
   Optimistic Update                           Insert Record
      ↓                                               ↓
   Update UI ← Confirm/Rollback ← Success/Error ← Response
```

### Real-time Messaging Flow

```
User Sends Message → Messages Service → Supabase DB
                                            ↓
                                    Realtime Trigger
                                            ↓
All Connected Clients ← WebSocket ← Realtime Event
         ↓
   Update Chat UI
```

---

## 🎨 UI Component Hierarchy

```
App Root
  └── RootLayout (Providers)
      ├── ErrorBoundary
      ├── EnhancedThemeProvider
      ├── AuthProvider
      ├── AIModelProvider
      └── ToastProvider
          └── Stack Navigation
              ├── Auth Screens
              │   ├── Login
              │   ├── Signup
              │   └── Verify Email
              │
              ├── Tab Navigation
              │   ├── Home/Dashboard
              │   ├── Explore
              │   ├── My Courses
              │   └── Profile
              │
              └── Modal Screens
                  ├── Course Details
                  ├── Lesson Player
                  ├── Settings
                  └── Notifications
```

---

## 🔐 Security Architecture

### 1. Row Level Security (RLS)

All database tables protected with RLS policies:

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

### 2. Authentication

- JWT tokens stored securely (Secure Store on native)
- Auto-refresh tokens
- Biometric authentication option
- OAuth2 for social login

### 3. Data Encryption

- Sensitive data encrypted at rest
- HTTPS for all network communication
- End-to-end encryption for messages (optional)

---

## 📊 State Management Strategy

### 1. Global State (Zustand)

Used for:
- Theme preferences
- App-wide settings
- Cached data

```typescript
import create from 'zustand';

const useStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

### 2. Context API

Used for:
- Authentication state
- AI model configuration
- Feature flags

### 3. Local State

Used for:
- Form inputs
- UI state (modals, dropdowns)
- Component-specific data

---

## 🌐 API Architecture

### Service Layer Pattern

```typescript
// Service definition
class CourseService {
  async getCourses(filters) {
    // Business logic
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .filter();
    
    if (error) throw error;
    return data;
  }
}

// Hook wrapper
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    courseService.getCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);
  
  return { courses, loading };
}
```

---

## 🚀 Performance Architecture

### 1. Rendering Optimization

- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers
- FlashList for long lists

### 2. Data Fetching

- SWR pattern (Stale-While-Revalidate)
- Request deduplication
- Pagination for large datasets
- Prefetching for likely next screens

### 3. Asset Optimization

- expo-image with blurhash
- Lazy loading images
- WebP format support
- Icon font instead of SVG

---

## 🔧 Build & Deployment Architecture

### Development

```
Local Development
  ↓
Expo Go App (for testing)
  ↓
Hot Reload / Fast Refresh
```

### Production

```
Git Push → GitHub Actions → EAS Build
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
iOS Build               Android Build
    ↓                       ↓
App Store            Google Play Store
```

---

## 📈 Scalability Considerations

### Database

- Indexes on frequently queried columns
- Composite indexes for complex queries
- Partitioning for large tables (future)
- Read replicas (if needed)

### Application

- Stateless architecture (scales horizontally)
- CDN for static assets
- Edge caching
- Load balancing (future)

### Real-time

- Connection pooling
- Subscription limits per user
- Heartbeat for connection health
- Automatic reconnection

---

## 🧪 Testing Strategy

### Unit Tests

- Utility functions
- Pure components
- Business logic in services
- Custom hooks

### Integration Tests

- API calls
- Database queries
- Authentication flow
- Real-time features

### E2E Tests

- Critical user flows
- Course enrollment
- Payment processing
- Content consumption

---

## 📚 Design Patterns Used

1. **Provider Pattern**: Context providers for global state
2. **Repository Pattern**: Services abstract database access
3. **Observer Pattern**: Real-time subscriptions
4. **Factory Pattern**: Component factories
5. **Singleton Pattern**: Service instances
6. **HOC Pattern**: Enhanced components
7. **Render Props**: Flexible components
8. **Compound Components**: Complex UI elements

---

## 🎯 Key Technical Decisions

### Why Expo?

- Faster development
- OTA updates
- Built-in modules
- Easier native integration
- Better DX

### Why Supabase?

- PostgreSQL (powerful & reliable)
- Real-time built-in
- Row-level security
- Excellent TypeScript support
- Great developer experience

### Why NativeWind?

- TailwindCSS familiar syntax
- Type-safe
- Better performance than styled-components
- Smaller bundle size

### Why Zustand?

- Minimal boilerplate
- Better performance than Redux
- TypeScript friendly
- Easy to learn

---

## 🔮 Future Architecture Plans

1. **Microservices**: Split into smaller services
2. **GraphQL**: Consider for complex queries
3. **Redis**: Add caching layer
4. **CDN**: For video streaming
5. **Message Queue**: For background jobs
6. **Kubernetes**: For orchestration

---

## 📞 Architecture Review

For architecture questions or proposals:
- Create GitHub Discussion
- Tag with `architecture` label
- Provide use case and alternatives considered

---

**This architecture is designed to be:**
- 🔒 Secure
- ⚡ Fast
- 📈 Scalable
- 🧹 Maintainable
- 🎨 Developer-friendly
