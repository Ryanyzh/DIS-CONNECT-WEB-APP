# Dis-Connect · Web Dashboard

> HR officer interface for the Dis-Connect scholarship support ticketing system.
> Part of a tri-platform architecture — this SPA handles the HR officer side. The scholar-facing mobile app (Flutter) and shared REST API (FastAPI + Firestore) live in separate repositories.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Authentication & Authorisation](#authentication--authorisation)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Ticket Lifecycle](#ticket-lifecycle)
- [Testing](#testing)
- [Design System](#design-system)
- [Known Limitations](#known-limitations)

---

## Overview

A React single-page application serving as the HR officer workspace for the Dis-Connect scholarship support system. HR officers use this dashboard to:

- Triage and manage scholar support tickets across all status stages
- Communicate with scholars via per-ticket conversation threads
- Publish announcements and maintain a searchable FAQ knowledge base
- Provision and manage scholar and HR officer accounts
- View enriched scholar profiles alongside ticket details

---

## Tech Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| UI framework | React | 19.2.6 |
| Build tool | Vite | 8 |
| Language | TypeScript | ~6.0 |
| Styling | Tailwind CSS | 4.3 |
| Routing | React Router | 7.15 |
| Authentication | Firebase Auth SDK | 12.15 |
| File storage | Firebase Cloud Storage | 12.15 |
| Testing framework | Vitest | 4.1 |
| Component testing | React Testing Library | 16.3 |
| Linting | ESLint 10 + typescript-eslint | — |
| Formatting | Prettier | 3.8 |

---

## Architecture

This app sits at the top of a three-tier system:

```
┌──────────────────────────────┐    ┌─────────────────────────────┐
│  Web Dashboard  (this repo)  │    │  Mobile App  (Flutter repo) │
│  React 19 + Vite + TS        │    │  Scholar-facing interface    │
└──────────────┬───────────────┘    └──────────────┬──────────────┘
               │ HTTP + Bearer token               │ HTTP + Bearer token
               ▼                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                    REST API  (backend repo)                      │
│                    FastAPI + Firebase Admin SDK                  │
└─────────────────────────────┬────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        Firebase Auth    Firestore       Cloud Storage
```

**Key design decisions:**

- **Decoupled frontend/backend** — the web app has zero knowledge of the database schema; all data access goes through the REST API.
- **Dev proxy** — Vite proxies all `/api/*` requests to `http://127.0.0.1:8000`, so no backend URL is ever hardcoded in application code.
- **Server-side enrichment** — ticket detail responses from the API embed the full scholar profile, assigned officer, status object, priority object, and attachment list in a single payload, eliminating waterfall requests from the client.
- **Token-aware HTTP client** — a custom `apiFetch` wrapper centralises token injection and handles silent token refresh, keeping all page/hook code free of auth concerns.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- The FastAPI backend running at `http://127.0.0.1:8000` (see backend repo)
- Firebase project with **Authentication** (email/password provider) and **Cloud Storage** enabled
- Firebase web config copied into `.env` (see [Environment Variables](#environment-variables))

### Install and run

```bash
npm install
npm run dev        # starts dev server at http://localhost:5173
```

### All scripts

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc --noEmit + vite build (type-checked production bundle)
npm run preview    # Serve the production build locally
npm run lint       # ESLint across src/
npm run format     # Prettier write across src/
npm run test       # Vitest in watch mode
```

---

## Environment Variables

Create a `.env` file in the project root (never commit this file):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These are consumed in `src/lib/firebase.ts` via `import.meta.env.VITE_*`. All variables are prefixed with `VITE_` to be exposed to the browser bundle by Vite.

---

## Project Structure

```
src/
├── components/                    # Shared UI primitives
│   ├── Header.tsx                 # Global top bar (breadcrumbs, search)
│   ├── Layout.tsx                 # Authenticated shell — Sidebar + <Outlet>
│   ├── Sidebar.tsx                # Persistent left-nav with route groups
│   ├── ProtectedRoute.tsx         # Auth guard; redirects to /login if no session
│   ├── TicketCard.tsx             # Ticket summary card + statusStyles colour map
│   ├── ActionsPanel.tsx           # Status update dropdown + assignee selector
│   ├── TicketInfoPanel.tsx        # Ticket metadata sidebar (code, dates, category)
│   ├── ActivityTab.tsx            # Chronological status-change audit log
│   └── ConversationTab.tsx        # Bidirectional HR ↔ Scholar message thread
│
├── context/
│   └── AuthContext.tsx            # Provides Firebase currentUser + decoded role
│
├── hooks/
│   ├── useTickets.ts              # GET /api/v1/tickets — returns tickets[], loading, error
│   ├── useCategories.ts           # GET /api/v1/categories — returns Category[]
│   ├── useStatuses.ts             # GET /api/v1/tickets/statuses — returns Status[]
│   └── useRole.ts                 # Resolves current user role from Firebase token claims
│
├── lib/
│   ├── firebase.ts                # Firebase app + auth + storage initialisation
│   ├── apiFetch.ts                # Fetch wrapper: injects Bearer token, retries on 401
│   └── authRepository.ts         # signInAsHr(), signOut() — Firebase Auth helpers
│
├── pages/
│   ├── Login.tsx                  # Email/password sign-in with Firebase error mapping
│   ├── Overview.tsx               # Metrics summary dashboard
│   ├── PageShell.tsx              # Consistent page chrome: title, description, slot
│   │
│   ├── tickets/
│   │   ├── AllTickets.tsx         # Full ticket registry — status + category filters
│   │   ├── OpenTickets.tsx        # Unassigned tickets queue
│   │   ├── ArchivedTickets.tsx    # Closed/resolved historical log
│   │   ├── TicketDetails.tsx      # Tri-panel detail view (info / thread / attachments)
│   │   └── __tests__/
│   │       ├── AllTicketsPage.test.tsx
│   │       ├── OpenTicketsPage.test.tsx
│   │       └── TicketDetailsPage.test.tsx
│   │
│   ├── users/
│   │   ├── AllAccounts.tsx        # Tabbed user directory — Students | HR Officers
│   │   ├── CreateStudentAccount.tsx     # POST /api/v1/auth/register-scholar form
│   │   ├── CreateHrOfficerAccount.tsx   # POST /api/v1/auth/register-hr form
│   │   └── RolesAndPermissions.tsx
│   │
│   ├── scholars/
│   │   ├── ScholarProfiles.tsx    # Scholar directory (pending live data)
│   │   ├── ScholarDetail.tsx      # Individual scholar profile (pending live data)
│   │   ├── ScholarExchange.tsx    # Overseas exchange placements (pending live data)
│   │   ├── ScholarExchangeForm.tsx
│   │   └── ScholarActivityLogs.tsx
│   │
│   ├── announcements/
│   │   ├── AllAnnouncements.tsx   # Announcement feed — newest first
│   │   ├── AnnouncementDetail.tsx # Full announcement view
│   │   └── CreateAnnouncement.tsx # Create / edit form (shared via ?edit= param)
│   │
│   └── faq/
│       ├── AllFaqs.tsx            # FAQ list with edit/delete controls
│       └── CreateFaq.tsx          # Create / edit form
│
├── types/                         # Shared TypeScript interfaces (snake_case to match API)
│   ├── Announcement.ts
│   ├── Faq.ts
│   ├── Scholar.ts
│   ├── HrOfficer.ts
│   ├── ActivityLog.ts
│   ├── TicketAttachment.ts
│   └── ExchangePlacement.ts
│
├── data/
│   └── mockScholars.ts            # Temporary fixtures; in use until scholar API endpoints land
│
├── App.tsx                        # Route tree (React Router v7 createBrowserRouter)
└── main.tsx                       # ReactDOM.createRoot entry point
```

---

## Routing

All routes under `/` are wrapped in `<ProtectedRoute>`. Unauthenticated requests redirect to `/login`.

| Path | Component | Notes |
|------|-----------|-------|
| `/login` | `Login` | Public |
| `/` | `Overview` | |
| `/tickets/all` | `AllTickets` | Status + category filters |
| `/tickets/open` | `OpenTickets` | Unassigned only |
| `/tickets/archived` | `ArchivedTickets` | `is_closed: true` |
| `/tickets/:ticketId` | `TicketDetails` | Param extracted via `useParams` |
| `/announcements/all` | `AllAnnouncements` | |
| `/announcements/create` | `CreateAnnouncement` | |
| `/announcements/:id` | `AnnouncementDetail` | |
| `/announcements/:id/edit` | `CreateAnnouncement` | Pre-populates form |
| `/knowledge-base/faqs` | `AllFaqs` | |
| `/knowledge-base/faqs/create` | `CreateFaq` | |
| `/knowledge-base/faqs/:id/edit` | `CreateFaq` | Pre-populates form |
| `/users/users` | `AllAccounts` | HR auth required (API + page) |
| `/users/create-student` | `CreateStudentAccount` | |
| `/users/create-hr-officer` | `CreateHrOfficerAccount` | |
| `/users/roles-and-permissions` | `RolesAndPermissions` | |
| `/scholars/profiles` | `ScholarProfiles` | |
| `/scholars/profiles/:id` | `ScholarDetail` | |
| `/scholars/exchange` | `ScholarExchange` | |
| `/scholars/activity` | `ScholarActivityLogs` | |
| `/profile/account` | `MyAccount` | |
| `/logout` | `Logout` | Calls `signOut()`, redirects to `/login` |

---

## Authentication & Authorisation

### Authentication flow

```
1. User submits credentials on /login
         │
         ▼
2. signInWithEmailAndPassword(auth, email, password)   [Firebase Auth SDK]
         │
         ▼
3. Firebase returns IdToken (JWT, 1-hour TTL)
         │
         ▼
4. Token stored in-memory by Firebase SDK;
   AuthContext reads currentUser and decodes role claim
         │
         ▼
5. All subsequent requests pass through apiFetch:
   GET /api/v1/...
   Authorization: Bearer <IdToken>
         │
         ▼
6. Backend verifies token via Firebase Admin SDK,
   checks role claim, returns data or 401/403
```

### `apiFetch` — token lifecycle

`src/lib/apiFetch.ts` wraps every outbound request:

1. Calls `getIdToken(false)` — returns the cached token if not expired.
2. Injects `Authorization: Bearer <token>`.
3. On `401`, calls `getIdToken(true)` to force-refresh from Firebase, then retries the request once.
4. If the retry returns `401`, clears the session and redirects to `/login`.

This keeps every page component and hook completely free of token management logic.

### Route guards

`ProtectedRoute` checks `AuthContext.currentUser` on every render. If `null`, it issues a `<Navigate to="/login" replace />` before mounting the protected subtree. Role-level UI restrictions (e.g., hiding admin controls from non-HR users) are applied at the component level by reading `AuthContext.role`.

---

## API Integration

All requests use `apiFetch` — never raw `fetch`. The Vite proxy in `vite.config.ts` rewrites `/api/*` to `http://127.0.0.1:8000/api/*` at the network layer, so no origin switch occurs from the browser's perspective.

### Endpoint reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/v1/tickets` | Bearer | List all tickets (enriched) |
| `GET` | `/api/v1/tickets/:id` | Bearer | Single ticket — embeds scholar, officer, status, priority, category, attachments |
| `PATCH` | `/api/v1/tickets/:id/status` | Bearer (HR) | Update status and optional assignee |
| `GET` | `/api/v1/tickets/:id/messages` | Bearer | Conversation thread |
| `POST` | `/api/v1/tickets/:id/messages` | Bearer | Send a message |
| `GET` | `/api/v1/tickets/:id/history` | Bearer | Status-change audit log |
| `GET` | `/api/v1/tickets/:id/attachments` | Bearer | List file attachments |
| `GET` | `/api/v1/users/` | Bearer (HR) | All user accounts with merged profiles |
| `GET` | `/api/v1/users/:id` | Bearer | Single user — self or HR |
| `PATCH` | `/api/v1/users/:id/activate` | Bearer (HR) | Set `is_active: true` |
| `PATCH` | `/api/v1/users/:id/deactivate` | Bearer (HR) | Set `is_active: false` |
| `POST` | `/api/v1/auth/register-scholar` | Bearer (HR) | Create Firebase user + scholar profile |
| `POST` | `/api/v1/auth/register-hr` | Bearer (HR) | Create Firebase user + HR profile |
| `GET` | `/api/v1/categories` | Public | Ticket category reference data |
| `GET` | `/api/v1/priorities` | Public | Ticket priority reference data with colour codes |
| `GET` | `/api/announcements` | Public | All announcements, newest first |
| `POST` | `/api/announcements` | Bearer (HR) | Create announcement |
| `PATCH` | `/api/announcements/:id` | Bearer (HR) | Update announcement fields |
| `GET` | `/api/faqs` | Public | All FAQs ordered by `order` field |
| `POST` | `/api/faqs` | Bearer (HR) | Create FAQ |
| `PATCH` | `/api/faqs/:id` | Bearer (HR) | Update FAQ fields |
| `DELETE` | `/api/faqs/:id` | Bearer (HR) | Delete FAQ |

### Enriched ticket response shape

`GET /api/v1/tickets/:id` returns a single flat object — the backend resolves all foreign key references before responding:

```jsonc
{
  "ticket_id": "uuid",
  "ticket_code": "TKT-2026-A1B2C3",
  "subject": "Hostel Reimbursement",
  "description": "...",
  "source": "mobile",
  "status": {
    "status_id": "uuid",
    "status_name": "In Review",
    "status_type": "active",
    "is_closed": false
  },
  "priority": {
    "priority_id": "uuid",
    "priority_name": "High",
    "color_code": "#EF4444",
    "level": 3
  },
  "category": {
    "category_id": "uuid",
    "category_name": "Reimbursement"
  },
  "scholar": {
    "user_id": "uid",
    "full_name": "Ryan Tan",
    "email": "e1234567@u.nus.edu",
    "student_id": "A0123456B",
    "faculty": "Computing",
    "program": "Computer Science",
    "year_of_study": 2,
    "scholarship_type": "Merit Scholarship",
    "preferred_contact": "Email"
  },
  "assigned_officer": { "user_id": "uid", "full_name": "Jane Smith" },
  "attachments": [
    {
      "attachment_id": "uuid",
      "file_name": "receipt.pdf",
      "file_path": "tickets/uuid/receipt.pdf",
      "file_type": "application/pdf",
      "file_size": 204800,
      "uploaded_at": "2026-06-15T08:00:00Z"
    }
  ],
  "created_at": "2026-06-15T08:00:00Z",
  "updated_at": "2026-06-15T10:30:00Z"
}
```

> Note: `file_path` is a Firebase Storage object path, not a signed URL. The client resolves download URLs on demand via `getDownloadURL(ref(storage, filePath))`.

---

## State Management

There is no global client-side state library. Data is managed at two levels:

**Custom hooks** (server state) — each hook owns one resource:

| Hook | Source | Returns |
|------|--------|---------|
| `useTickets` | `GET /api/v1/tickets` | `{ tickets, loading, error }` |
| `useCategories` | `GET /api/v1/categories` | `Category[]` |
| `useStatuses` | `GET /api/v1/tickets/statuses` | `Status[]` |
| `useRole` | Firebase token claim | `"hr" \| "scholar" \| null` |

**`AuthContext`** (session state) — wraps `onAuthStateChanged` and exposes `{ currentUser, role }` to the entire tree via `useContext(AuthContext)`.

Page-level component state (`useState`) handles ephemeral UI concerns: filter selections, form inputs, loading indicators, and submitting flags.

---

## Ticket Lifecycle

```
Scholar submits ticket
         │
         ▼
      ┌──────┐
      │ OPEN │ ◄── visible to all HR officers in All Tickets + Open Tickets
      └──┬───┘
         │ HR claims ticket
         ▼
   ┌───────────┐
   │ IN REVIEW │
   └─────┬─────┘
         │
         ├─── Request info ───► WAITING FOR RESPONSE
         │                               │
         │                        Scholar replies
         │                               │
         │◄──────────────────────────────┘
         │
         ├─── Escalate ────────► ESCALATED
         │
         └─── Resolve ─────────► RESOLVED
                                       │
                              Scholar closes ticket
                              OR 3 working days elapse
                                       │
                                       ▼
                                   CLOSED ── moved to Archived Tickets view
```

Status transitions are recorded in the Firestore `tickets/{id}/history` sub-collection by the backend on every `PATCH /api/v1/tickets/:id/status` call. The `ActivityTab` component renders this log in the ticket detail view.

---

## Testing

Integration tests use **Vitest** + **React Testing Library** and live co-located with their target pages under `src/pages/tickets/__tests__/`.

```bash
npm run test          # watch mode
npm run test -- --run # single pass (CI)
```

### Test coverage

| File | Strategy | What is verified |
|------|----------|-----------------|
| `AllTicketsPage.test.tsx` | `fetch` mocked via `vi.spyOn` | Ticket codes and subjects render; loading state resolves |
| `OpenTicketsPage.test.tsx` | `fetch` mocked via `vi.spyOn` | Unassigned tickets render correctly |
| `TicketDetailsPage.test.tsx` | URL-aware `fetch` mock + Firebase Storage mock | Route param extraction; scholar name, ticket code, status, priority rendered; Attachments tab click; attachment button triggers `getDownloadURL` and opens signed URL in new tab |

### Mocking approach

**Network** — `vi.spyOn(globalThis, "fetch")` is used rather than MSW to intercept requests. In `TicketDetailsPage.test.tsx` the mock is URL-aware, returning different fixtures for the ticket endpoint vs. the user profile endpoint:

```typescript
vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
  if (url.toString().includes(scholarId)) {
    return Promise.resolve(Response.json(mockUserProfile, { status: 200 }));
  }
  return Promise.resolve(Response.json(mockTicketDetails, { status: 200 }));
});
```

**Firebase Storage** — `firebase/storage` is mocked at the module level to prevent real GCS calls:

```typescript
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  ref: vi.fn(() => ({})),
  getDownloadURL: vi.fn(() => Promise.resolve("https://firebasestorage...")),
}));
```

All mocks are torn down in `afterEach(() => vi.restoreAllMocks())`.

---

## Design System

The app uses a custom Tailwind CSS token layer built on top of Tailwind 4's CSS variable system. Semantic colour tokens are defined in `index.css` and consumed throughout components:

| Token | Usage |
|-------|-------|
| `wise-canvas` | Page and panel backgrounds |
| `wise-ink` | Primary text |
| `wise-mute` | Secondary / placeholder text |
| `wise-neutral` | Borders and dividers |

Ticket status colours are centralised in `TicketCard.tsx` as the `statusStyles` map, keyed by `status_name`. Every component that needs to colour a status badge imports from this single source, ensuring consistency across the All Tickets view, Open Tickets view, and Ticket Details panel.

---

## Known Limitations

| Area | Detail |
|------|--------|
| Scholar pages | `/scholars/profiles`, `/scholars/profiles/:id`, `/scholars/exchange`, and `/scholars/activity` render mock data. The backend endpoint `GET /api/v1/scholars/activity` does not exist yet. |
| Pagination | All list endpoints return the full result set. Cursor-based pagination is not implemented. |
| Analytics | `/analytics/tickets` and `/analytics/sla` routes are scaffolded but the pages contain no real data or charts. |
| File upload progress | Attachment uploads via Firebase Storage client SDK have no progress indicator in the UI. |
| Offline support | All data is fetched live; there is no client-side cache or offline fallback. |
