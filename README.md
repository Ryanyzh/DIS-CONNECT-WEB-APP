# Dis-Connect · Web Dashboard

> HR officer interface for the Dis-Connect scholarship support ticketing system.
> Part of a tri-platform architecture — this SPA handles the HR officer side. The scholar-facing mobile app (Flutter) and shared REST API (FastAPI + Firestore) live in separate repositories.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
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
- [Real-Time Notifications](#real-time-notifications)
- [Analytics](#analytics)
- [Testing](#testing)
- [Design System](#design-system)
- [Known Limitations](#known-limitations)

---

## Overview

A React single-page application serving as the HR officer workspace for the Dis-Connect scholarship support system. HR officers use this dashboard to:

- Triage and manage scholar support tickets across all status stages, including escalation and reassignment
- Communicate with scholars via per-ticket conversation threads with multi-file attachments
- Get notified in real time when a ticket needs attention, via a live inbox dropdown
- Monitor SLA compliance and ticket analytics across categories, priorities, and officers
- Publish announcements and maintain a searchable FAQ knowledge base
- Provision and manage scholar and HR officer accounts
- View scholar profiles and exchange/internship placements alongside ticket details

---

## Tech Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| UI framework | React | 19.2.6 |
| Build tool | Vite | 8 |
| Language | TypeScript | ~6.0 |
| Styling | Tailwind CSS | 3.4 |
| Icons | lucide-react + inline SVG | 1.25 |
| Routing | React Router | 7.15 |
| Authentication | Firebase Auth SDK | 12.15 |
| File storage | Firebase Cloud Storage | 12.15 |
| Real-time data | Firestore (inbox) + Realtime Database (conversation) | 12.15 |
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
              ┌───────────────┼───────────────┬───────────────┐
              ▼               ▼               ▼               ▼
        Firebase Auth    Firestore       Cloud Storage   Realtime DB
                                                          (conversation
                                                           live sync)
```

**Key design decisions:**

- **Decoupled frontend/backend** — the web app has zero knowledge of the database schema; all data access goes through the REST API.
- **Dev proxy** — Vite proxies all `/api/*` requests to `http://127.0.0.1:8000`, so no backend URL is ever hardcoded in application code.
- **Server-side enrichment** — ticket detail responses from the API embed the full scholar profile, assigned officer (including precomputed initials), status object, priority object, and attachment list in a single payload, eliminating waterfall requests from the client.
- **Token-aware HTTP client** — a custom `apiFetch` wrapper centralises token injection and handles silent token refresh, keeping all page/hook code free of auth concerns.
- **Two real-time channels, two jobs** — the inbox notification badge listens directly to a per-user Firestore subcollection via `onSnapshot`; the conversation thread listens to the Realtime Database instead, since message delivery needs lower-latency, high-frequency updates than the inbox does.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- The FastAPI backend running at `http://127.0.0.1:8000` (see backend repo)
- Firebase project with **Authentication** (email/password provider), **Firestore**, **Realtime Database**, and **Cloud Storage** enabled
- Firebase web config copied into `.env` (see [Environment Variables](#environment-variables))

### Install and run

```bash
npm install
npm run dev        # starts dev server at http://localhost:5173
```

### All scripts

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b + vite build (type-checked production bundle)
npm run preview    # Serve the production build locally
npm run lint       # ESLint across the repo
npm run format     # Prettier write across the repo
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
VITE_FIREBASE_DATABASE_URL=
```

These are consumed in `src/lib/firebase.ts` via `import.meta.env.VITE_*`. All variables are prefixed with `VITE_` to be exposed to the browser bundle by Vite. `VITE_FIREBASE_DATABASE_URL` points at the Realtime Database instance used for live conversation sync.

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx                     # Global top bar (breadcrumbs, search, inbox dropdown)
│   ├── Layout.tsx                     # Authenticated shell — Sidebar + <Outlet>
│   ├── Sidebar.tsx                    # Persistent left-nav with route groups
│   ├── ProtectedRoute.tsx             # Auth guard; redirects to /login if no session
│   │
│   ├── tickets/                       # Everything ticket-detail-related
│   │   ├── TicketCard.tsx             # Ticket summary card + statusStyles colour map
│   │   ├── ActionsPanel.tsx           # Status transition buttons (claim, escalate, resolve…)
│   │   ├── AssignOfficerModal.tsx     # Officer picker for assignment/reassignment
│   │   ├── TicketInfoPanel.tsx        # Ticket metadata sidebar (code, dates, category)
│   │   ├── ScholarInfoPanel.tsx       # Slide-out scholar profile panel (hover or click)
│   │   ├── ActivityTab.tsx            # Chronological status-change audit log
│   │   ├── ConversationTab.tsx        # HR ↔ Scholar message thread, Realtime DB-backed, multi-file attachments
│   │   └── __tests__/
│   │       └── TicketCard.test.tsx
│   │
│   ├── users/
│   │   └── InboxDropdown.tsx          # Header notification bell — live unread count + list
│   │
│   └── analytics/
│       └── SlaKpiCards.tsx            # Reusable KPI stat-card row for the SLA Analytics page
│
├── context/
│   └── AuthContext.tsx                # Provides Firebase currentUser + decoded role
│
├── hooks/
│   ├── useTickets.ts                  # GET /api/v1/tickets — returns { tickets, triggerRefresh, loading }
│   ├── useCategories.ts               # GET /api/v1/categories — returns Category[]
│   ├── useStatuses.ts                 # GET /api/v1/tickets/statuses — returns a status-name → id map
│   ├── useOfficers.ts                 # GET /api/v1/users/ filtered to role === "hr"
│   ├── useInbox.ts                    # Firestore onSnapshot on users/{uid}/inbox + mark-as-read actions
│   └── useRole.ts                     # Resolves current user role from Firebase token claims
│
├── lib/
│   ├── firebase.ts                    # Firebase app + auth + Firestore + storage + RTDB init
│   ├── apiFetch.ts                    # Fetch wrapper: injects Bearer token, retries on 401
│   └── authRepository.ts              # signInAsHr(), signOut() — Firebase Auth helpers
│
├── pages/
│   ├── Login.tsx                      # Email/password sign-in with Firebase error mapping
│   ├── PageShell.tsx                  # Consistent page chrome: title, description, slot
│   │
│   ├── tickets/
│   │   ├── AllTickets.tsx             # Full ticket registry — status + category filters
│   │   ├── OpenTickets.tsx            # Unassigned tickets queue
│   │   ├── ArchivedTickets.tsx        # Closed/resolved historical log
│   │   ├── TicketDetails.tsx          # Multi-panel detail view (info / actions / conversation / activity / attachments)
│   │   └── __tests__/
│   │       ├── AllTicketsPage.test.tsx
│   │       ├── OpenTicketsPage.test.tsx
│   │       ├── TicketDetailsPage.test.tsx
│   │       ├── ActivityTab.test.tsx
│   │       └── ConversationTab.test.tsx
│   │
│   ├── users/
│   │   ├── AllAccounts.tsx            # Tabbed user directory — Students | HR Officers
│   │   ├── CreateStudentAccount.tsx   # POST /api/v1/auth/register-scholar form
│   │   ├── CreateHrOfficerAccount.tsx # POST /api/v1/auth/register-hr form
│   │   └── RolesAndPermissions.tsx
│   │
│   ├── scholars/                      # Still mock-data-driven — see Known Limitations
│   │   ├── ScholarProfiles.tsx        # Scholar directory
│   │   ├── ScholarDetail.tsx          # Individual scholar profile
│   │   ├── ScholarExchange.tsx        # Overseas exchange / internship placements
│   │   ├── ScholarExchangeForm.tsx    # Create / edit placement form
│   │   └── ScholarActivityLogs.tsx
│   │
│   ├── announcements/
│   │   ├── AllAnnouncements.tsx       # Announcement feed — newest first
│   │   ├── AnnouncementDetail.tsx     # Full announcement view
│   │   └── CreateAnnouncement.tsx     # Create / edit form (shared via ?edit= param)
│   │
│   ├── faq/
│   │   ├── AllFaqs.tsx                # FAQ list with edit/delete controls
│   │   └── CreateFaq.tsx              # Create / edit form
│   │
│   └── analytics/
│       ├── TicketAnalytics.tsx        # Category/priority breakdowns, time-in-status chart
│       └── SlaAnalytics.tsx           # SLA KPIs, breach leaderboard, 14-day breach trend
│
├── types/                             # Shared TypeScript interfaces (snake_case to match API)
│   ├── Announcement.ts
│   ├── Faq.ts
│   ├── Scholar.ts
│   ├── HrOfficer.ts
│   ├── ActivityLog.ts
│   ├── TicketAttachment.ts
│   ├── TicketHistoryLog.ts            # Shape of a single /tickets/:id/history audit entry
│   └── ExchangePlacement.ts
│
├── data/
│   └── mockScholars.ts                # Temporary fixtures; still the only source for scholar pages
│
├── App.tsx                            # Route tree (React Router v7 <Routes>)
└── main.tsx                           # ReactDOM.createRoot entry point
```

---

## Routing

All routes under `/` are wrapped in `<ProtectedRoute>`. Unauthenticated requests redirect to `/login`.

| Path | Component | Notes |
|------|-----------|-------|
| `/login` | `Login` | Public |
| `/` | — | Redirects to `/tickets/all` |
| `/tickets/all` | `AllTickets` | Status + category filters |
| `/tickets/open` | `OpenTickets` | Unassigned only |
| `/tickets/sla` | `SlaMonitoring` | Placeholder page |
| `/tickets/archived` | `ArchivedTickets` | `is_closed: true` |
| `/tickets/:ticketId` | `TicketDetails` | Param extracted via `useParams` |
| `/scholars/profiles` | `ScholarProfiles` | Mock data |
| `/scholars/profiles/:id` | `ScholarDetail` | Mock data |
| `/scholars/exchange` | `ScholarExchange` | Live API, falls back to mock on failure |
| `/scholars/exchange/create` | `ScholarExchangeForm` | Create mode |
| `/scholars/exchange/:id/edit` | `ScholarExchangeForm` | Edit mode — fetches the placement live |
| `/scholars/activity` | `ScholarActivityLogs` | Live API, falls back to mock on failure |
| `/announcements/all` | `AllAnnouncements` | |
| `/announcements/create` | `CreateAnnouncement` | |
| `/announcements/:id` | `AnnouncementDetail` | |
| `/announcements/:id/edit` | `CreateAnnouncement` | Pre-populates form |
| `/knowledge-base/faqs` | `FaqArticles` | |
| `/knowledge-base/faqs/create` | `CreateFaq` | |
| `/knowledge-base/faqs/:id/edit` | `CreateFaq` | Pre-populates form |
| `/analytics/tickets` | `TicketAnalytics` | |
| `/analytics/sla` | `SlaAnalytics` | |
| `/notifications/settings` | `NotificationSettings` | Placeholder page |
| `/users/users` | `AllAccounts` | HR auth required (API + page) |
| `/users/create-student` | `CreateStudentAccount` | |
| `/users/create-hr-officer` | `CreateHrOfficerAccount` | |
| `/users/roles-and-permissions` | `RolesAndPermissions` | |
| `/profile/account` | `MyAccount` | |
| `/logout` | `Logout` | Calls `signOut()`, redirects to `/login` |
| `*` | — | Redirects to `/` |

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
3. Firebase returns IdToken (JWT, 1-hour TTL) with a custom "role" claim
         │
         ▼
4. signInAsHr() checks the claim client-side — a non-"hr" token is
   signed out immediately and rejected with AccessDeniedError
         │
         ▼
5. AuthContext reads currentUser and exposes { currentUser, role }
         │
         ▼
6. All subsequent requests pass through apiFetch:
   GET /api/v1/...
   Authorization: Bearer <IdToken>
         │
         ▼
7. Backend re-verifies the token via Firebase Admin SDK on every
   request, checks the role claim again, returns data or 401/403
```

### `apiFetch` — token lifecycle

`src/lib/apiFetch.ts` wraps every outbound request:

1. Calls `getIdToken(false)` — returns the cached token if not expired.
2. Injects `Authorization: Bearer <token>`.
3. On `401`, calls `getIdToken(true)` to force-refresh from Firebase, then retries the request once.
4. If the retry returns `401`, clears the session and redirects to `/login`.

This keeps every page component and hook completely free of token management logic.

### Route guards

`ProtectedRoute` checks `AuthContext.currentUser` on every render. If `null`, it issues a `<Navigate to="/login" replace />` before mounting the protected subtree. Role-level UI restrictions — e.g. hiding the `ActionsPanel` from non-HR users on the ticket detail page — are applied at the component level by reading `AuthContext.role`. The backend enforces the same `role == "hr"` rule independently, so the check isn't just cosmetic.

---

## API Integration

All requests use `apiFetch` — never raw `fetch`. The Vite proxy in `vite.config.ts` rewrites `/api/*` to `http://127.0.0.1:8000/api/*` at the network layer, so no origin switch occurs from the browser's perspective.

### Endpoint reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/v1/tickets` | Bearer | List all tickets (enriched) |
| `GET` | `/api/v1/tickets/:id` | Bearer | Single ticket — embeds scholar, officer, status, priority, category, attachments |
| `PATCH` | `/api/v1/tickets/:id/status` | Bearer (HR) | Update status and optional assignee/escalation metadata |
| `GET` | `/api/v1/tickets/:id/messages` | Bearer | Conversation thread |
| `POST` | `/api/v1/tickets/:id/messages` | Bearer | Send a message, optionally with attachments |
| `GET` | `/api/v1/tickets/:id/history` | Bearer | Status-change audit log |
| `GET` | `/api/v1/tickets/:id/attachments` | Bearer | List file attachments |
| `GET` | `/api/v1/users/` | Bearer (HR) | All user accounts with merged profiles |
| `GET` | `/api/v1/users/:id` | Bearer | Single user — self or HR |
| `PATCH` | `/api/v1/users/inbox/read` | Bearer | Mark one or all inbox notifications as read |
| `POST` | `/api/v1/auth/register-scholar` | Bearer (HR) | Create Firebase user + scholar profile |
| `POST` | `/api/v1/auth/register-hr` | Bearer (HR) | Create Firebase user + HR profile |
| `GET` | `/api/v1/categories` | Public | Ticket category reference data |
| `GET` | `/api/v1/tickets/statuses` | Public | Ticket status reference data |
| `GET` | `/api/v1/scholars` | Bearer (HR) | Scholar directory — not yet called by any page, see Known Limitations |
| `GET` | `/api/v1/scholars/activity` | Bearer (HR) | Activity log entries |
| `GET` | `/api/v1/scholars/exchange` | Bearer (HR) | Exchange/internship placements |
| `POST` | `/api/v1/scholars/exchange` | Bearer (HR) | Create a placement |
| `GET` | `/api/v1/scholars/exchange/:id` | Bearer (HR) | Single placement |
| `PATCH` | `/api/v1/scholars/exchange/:id` | Bearer (HR) | Update a placement |
| `DELETE` | `/api/v1/scholars/exchange/:id` | Bearer (HR) | Remove a placement |
| `GET` | `/api/announcements` | Public | All announcements, newest first |
| `POST` | `/api/announcements` | Bearer (HR) | Create announcement |
| `PATCH` | `/api/announcements/:id` | Bearer (HR) | Update announcement fields |
| `DELETE` | `/api/announcements/:id` | Bearer (HR) | Delete announcement |
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
  "is_escalated": false,
  "escalated_at": null,
  "resolved_at": null,
  "status": { "status_id": "uuid", "status_name": "In Review", "status_type": "active", "is_closed": false },
  "priority": { "priority_id": "uuid", "priority_name": "High", "color_code": "#EF4444", "level": 3 },
  "category": { "category_id": "uuid", "category_name": "Reimbursement" },
  "scholar": {
    "id": "uid", "name": "Ryan Tan", "email": "e1234567@u.nus.edu",
    "student_id": "A0123456B", "faculty": "Computing", "program": "Computer Science",
    "year_of_study": 2, "scholarship_type": "Merit Scholarship", "preferred_contact": "Email"
  },
  "assigned_officer": { "id": "uid", "name": "Jane Smith", "email": "jane@nus.edu.sg", "role": "hr", "initials": "JS" },
  "attachments": [
    {
      "attachment_id": "uuid", "file_name": "receipt.pdf", "file_path": "tickets/uuid/receipt.pdf",
      "file_type": "application/pdf", "file_size": 204800, "uploaded_at": "2026-06-15T08:00:00Z"
    }
  ],
  "created_at": "2026-06-15T08:00:00Z",
  "updated_at": "2026-06-15T10:30:00Z"
}
```

> Note: `file_path` is a Firebase Storage object path, not a signed URL. The client resolves download URLs on demand via `getDownloadURL(ref(storage, filePath))` — both for ticket attachments and for files attached to individual conversation messages.

---

## State Management

There is no global client-side state library. Data is managed at three levels:

**Custom hooks** (server state) — each hook owns one resource:

| Hook | Source | Returns |
|------|--------|---------|
| `useTickets` | `GET /api/v1/tickets` | `{ tickets, triggerRefresh, loading }` |
| `useCategories` | `GET /api/v1/categories` | `Category[]` |
| `useStatuses` | `GET /api/v1/tickets/statuses` | Status-name → status-id map, for building `PATCH` payloads |
| `useOfficers` | `GET /api/v1/users/` (filtered to `role === "hr"`) | `{ officers, loading, error, refetch }` |
| `useInbox` | Firestore `users/{uid}/inbox` via `onSnapshot` | `{ notifications, unreadCount, loading, markAsRead, markAllAsRead }` |
| `useRole` | Firebase token claim | `{ role, roleLoading }` |

**`AuthContext`** (session state) — wraps `onAuthStateChanged` and exposes `{ currentUser, role }` to the entire tree via `useContext(AuthContext)`.

**Page-level component state** (`useState`) handles ephemeral UI concerns: filter selections, form inputs, loading indicators, submitting flags, and — on the ticket detail page — which side panel (scholar info, actions) is open.

Note the scholar pages (`ScholarProfiles`, `ScholarDetail`, `ScholarExchangeForm`'s scholar picker) don't go through a hook at all yet — they read `MOCK_SCHOLARS` directly from `src/data/mockScholars.ts`. See [Known Limitations](#known-limitations).

---

## Ticket Lifecycle

```
Scholar submits ticket
         │
         ▼
      ┌──────┐
      │ OPEN │ ◄── visible to all HR officers in All Tickets + Open Tickets
      └──┬───┘
         │ HR claims or is assigned the ticket
         ▼
   ┌───────────┐
   │ IN REVIEW │ ◄─────────────────────────────┐
   └─────┬─────┘                                │
         │                                       │ De-escalate
         ├─── Request info ───► WAITING          │
         │                          │            │
         │                   Scholar replies     │
         │                          │            │
         │◄─────────────────────────┘            │
         │                                       │
         ├─── Escalate ────────► ESCALATED ──────┘
         │
         └─── Resolve ─────────► RESOLVED
                                       │
                              Scholar closes ticket
                              OR 3 working days elapse
                                       │
                                       ▼
                                   CLOSED ── moved to Archived Tickets view
```

Every transition is written to the Firestore `tickets/{id}/history` sub-collection by the backend on `PATCH /api/v1/tickets/:id/status`, including the acting officer, the action type (e.g. `Assignment`, `De-escalate`, `Waiting for Response`), and a timestamp. `ActivityTab` renders this log directly; `SlaAnalyticsPage` additionally reconstructs how long a ticket spent in each state from the same log (see [Analytics](#analytics)). An officer attempting a status change on a ticket they aren't assigned to gets a `403`, surfaced in the UI as a dismissable toast rather than a silent failure.

---

## Real-Time Notifications

The header's inbox bell (`InboxDropdown`) is backed by `useInbox`, which opens a live Firestore listener on `users/{uid}/inbox` rather than polling:

- New documents in that subcollection (written server-side on ticket creation, assignment, and new messages) appear in the dropdown immediately, with an unread-count badge.
- Clicking a notification marks it read via `PATCH /api/v1/users/inbox/read` and navigates straight to the relevant ticket.
- "Mark all as read" sends the same endpoint with an empty `notification_ids` array, which the backend interprets as "all unread for this user."

Conversation messages (`ConversationTab`) use a *separate* real-time channel — the Firebase Realtime Database — rather than Firestore, since message delivery benefits from RTDB's lower-latency push model. Attachments on a message are uploaded to Cloud Storage client-side before the message payload (with resolved `attachment_id`s) is POSTed to the backend.

---

## Analytics

Two pages under `/analytics`, both built entirely from data the ticket API already exposes — neither requires a dedicated analytics backend:

- **Ticket Analytics** (`/analytics/tickets`) — category and priority breakdowns, and a time-in-status distribution chart driven by the `STATUS_META` colour/label map (also reused by SLA Analytics).
- **SLA Analytics** (`/analytics/sla`) — SLA KPI cards (active breaches, breach rate, average resolution and first-response time, at-risk count), a time-in-status lifecycle breakdown, category/priority breach rankings, an officer compliance leaderboard, and a 14-day breach trend.

SLA Analytics is the more involved of the two: beyond `useTickets`, it fetches `/api/v1/tickets/:id/history` individually for every non-`Open` ticket (concurrently, via `Promise.all`, behind its own `loadingHistory` flag) so it can reconstruct how long each ticket actually spent in each state — mapping both legacy and current audit action types (`Assignment`, `De-escalate`, `Waiting for Response`, …) to a standardised status, then walking the log sequentially to compute time deltas, attributing the remaining duration up to "now" for tickets still open. Breach determination itself is multi-factor: it compares resolution timestamps against each ticket's deadline where one exists, and falls back to `escalated_at` for manual escalations that never had an explicit deadline.

---

## Testing

Tests use **Vitest** + **React Testing Library**, co-located with their target code under `__tests__/` directories (`src/pages/tickets/__tests__/` and `src/components/tickets/__tests__/`).

```bash
npm run test          # watch mode
npm run test -- --run # single pass (CI)
```

### Test coverage

| File | Type | What is verified |
|------|------|-------------------|
| `TicketCard.test.tsx` | Unit | Props render correctly; navigates to ticket detail on click; "Unassigned" and escalated styling render conditionally; overdue-deadline styling is suppressed for Resolved/Closed tickets; a `null` deadline renders without crashing |
| `AllTicketsPage.test.tsx` | Integration | Ticket list renders from a mocked `fetch`, with `useOfficers`/`useCategories` mocked out |
| `OpenTicketsPage.test.tsx` | Integration | Only non-closed tickets render; closed tickets are excluded |
| `ActivityTab.test.tsx` | Integration | Status-change history renders; escalated entries get distinct border styling; an empty log shows "No activity history found." |
| `ConversationTab.test.tsx` | Integration | Messages render as chat bubbles; layout mirrors sender role (scholar vs. officer); sending a message posts the expected payload through `apiFetch` |
| `TicketDetailsPage.test.tsx` | System | Route param → fetch → render pipeline; scholar name/code/status/priority all display; Attachments tab click resolves a download URL via mocked `getDownloadURL` and opens it in a new tab; `ActionsPanel` is shown for HR and hidden for scholars; clicking Escalate calls the status-update endpoint; a `403` response surfaces the "not the assigned officer" toast |

### Mocking approach

**Network** — `vi.spyOn(globalThis, "fetch")` intercepts requests rather than MSW. Where a page needs different responses per endpoint (e.g. the ticket vs. the officer/category lookups), the mock inspects the request URL:

```typescript
vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
  if (url.toString().includes(scholarId)) {
    return Promise.resolve(Response.json(mockUserProfile, { status: 200 }));
  }
  return Promise.resolve(Response.json(mockTicketDetails, { status: 200 }));
});
```

**Hooks** — `useRole`, `useOfficers`, and `useStatuses` are mocked at the module level in `TicketDetailsPage.test.tsx` and `AllTicketsPage.test.tsx` so tests aren't coupled to their internal fetch timing:

```typescript
vi.mock("../../../hooks/useRole", () => ({
  useRole: () => ({ role: "hr", roleLoading: false }),
}));
```

**Firebase Storage** — mocked at the module level to avoid real GCS calls:

```typescript
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  ref: vi.fn(() => ({})),
  getDownloadURL: vi.fn(() => Promise.resolve("https://firebasestorage...")),
}));
```

All mocks are torn down in `afterEach(() => vi.restoreAllMocks())`, and `vitest.config` runs the suite under `jsdom` with `globals: true` so `describe`/`it`/`expect` don't need per-file imports.

### Not yet covered

- `ScholarProfiles`, `ScholarDetail`, `ScholarExchange`, `ScholarExchangeForm`, and `ScholarActivityLogs` have no tests.
- `SlaAnalyticsPage` and `TicketAnalyticsPage` — the most logic-heavy pages in the app (state-duration reconstruction, breach determination) — have no tests either.
- No end-to-end/browser-level tests exist; everything above is component/integration level against a mocked network.

---

## Design System

The app uses a custom Tailwind CSS token layer defined in `tailwind.config.js` and consumed throughout components:

| Token | Usage |
|-------|-------|
| `wise-canvas` | Page and panel backgrounds |
| `wise-ink` | Primary text |
| `wise-mute` | Secondary / placeholder text |
| `wise-neutral` | Borders and dividers |

Ticket status colours are centralised in `src/components/tickets/TicketCard.tsx` as the `statusStyles` map, keyed by `status_name`. Every component that needs to colour a status badge — the ticket list, ticket detail, `TicketInfoPanel`, and both analytics pages via `STATUS_META` — imports from this single source, so a status's colour only has one place to change.

Icons are a mix of `lucide-react` (used in newer components like `InboxDropdown`) and hand-written inline SVGs (used in most older pages) — not yet consolidated on one approach.

---

## Known Limitations

| Area | Detail |
|------|--------|
| Scholar directory | `ScholarProfiles` and `ScholarDetail` are fully mock-data-driven — they never call the live `GET /api/v1/scholars` endpoint even though the backend implements it. |
| Scholar pickers | The scholar filter/picker dropdowns inside `ScholarActivityLogs` and `ScholarExchangeForm` also read from `MOCK_SCHOLARS`, independently of whichever data source powers the rest of those pages. |
| Exchange & Activity Logs | These two pages *do* call their live endpoints (`/scholars/exchange`, `/scholars/activity`) first, falling back to mock data only if the request fails — so behaviour can differ between a working and unreachable backend. |
| Pagination | All list endpoints return the full result set. Cursor-based pagination is not implemented. |
| Analytics test coverage | `TicketAnalyticsPage` and `SlaAnalyticsPage` have no automated tests despite being the most computationally involved pages in the app. |
| File upload progress | Attachment uploads via the Firebase Storage client SDK (tickets and conversation messages) have no progress indicator in the UI. |
| Offline support | All data is fetched live; there is no client-side cache or offline fallback. |
| Placeholder pages | `/tickets/sla` and `/notifications/settings` are registered routes with no real content yet. |
