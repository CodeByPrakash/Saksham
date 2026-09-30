# Sakhyam-AI — Google OAuth & Convex Implementation Guide

This guide details the technical implementation of the Clerk Google OAuth and Convex backend integration.

---

## 1. Authentication Architecture

```
                               ┌────────────────────────┐
                               │     Sakhyam-AI CLIENT     │
                               │  (Expo / React Native) │
                               └───────────┬────────────┘
                                           │
                                  [ Google OAuth 2.0 ]
                                  @clerk/expo
                                  useOAuth({ strategy: 'oauth_google' })
                                  startOAuthFlow()
                                           │
                                  [ Clerk Session JWT ]
                                           │
                                  [ Convex Client Sync ]
                                  ConvexProviderWithClerk
                                  api.users.syncUser
                                           │
                                  [ Dashboard Route ]
                                  router.replace('/(dashboard)')
```

---

## 2. Directory Structure & Screen Routing

| Route | File Path | Description |
|---|---|---|
| `/` | `src/app/index.tsx` | 3-slide Splash & Onboarding Carousel with custom SVGs |
| `/(onboarding)/language-select` | `src/app/(onboarding)/language-select.tsx` | Choose Language screen (English selected) |
| `/(auth)/login` | `src/app/(auth)/login.tsx` | Google OAuth single sign-on screen |
| `/(dashboard)` | `src/app/(dashboard)/index.tsx` | Dashboard with user profile, quests & Log Out button |

---

## 4. Automated Convex Synchronization

1. **`useConvexUserSync` Hook** (`src/hooks/useConvexUserSync.ts`):
   - Automatically watches Clerk `useUser()` and `useAuth()` state.
   - When the user signs in or app reopens with an active session, extracts `clerkId`, `name`, `email`, `phone`, and `avatarUrl`.
2. **`syncUserToConvex` Service** (`src/services/convexSync.ts`):
   - Executes `users:syncUser` mutation on Convex client.
   - Includes automatic HTTP fallback to `https://fantastic-bison-163.convex.cloud/api/mutation` ensuring zero-fail delivery.
3. **`UserSyncWatcher`** (`src/providers/ConvexClientProvider.tsx`):
   - Mounted globally within `ConvexClientProvider` to synchronize any authenticated session across the app.
4. **`users.ts` & `schema.ts`**:
   - Stores the user with `email`, `avatarUrl`, `phone`, `role`, and automatically creates an initial `beneficiaryProfiles` record in Convex.

## 4. Security & Compliance
- **Token Security**: Tokens are cached using hardware-backed keystores via `expo-secure-store`.
- **Zero Password Storage**: Uses standard Google OAuth 2.0 PKCE flow.
- **DPDP 2023 Aligned**: User identity verified without retaining sensitive raw credentials.
