# DIS-CONNECT-WEB-APP

Used for Orbital Project, this is a web-based dashboard for HR officers to manage and resolve tickets.

---

# Ticket Dashboard

A ticketing dashboard to track, manage, and route scholar enquiries. Built with a decoupled **FastAPI** backend and a responsive, secure **React (Vite + TypeScript)** frontend workspace.

---

## Tech Stack Architecture

### Frontend Terminal
* **Core Framework:** React 18 (Vite-powered modular asset environment pipelines)
* **Language:** TypeScript (Strict structural type definitions for operational safety)
* **Styling Engine:** Tailwind CSS
* **Authentication Handler:** Firebase Auth Client SDK
* **State & Data Pipeline Architecture:** Custom asynchronous React hook abstractions and contextual consumer/provider patterns.

### Backend Controller
* **Core API Engine:** FastAPI (Python 3.10+)
* **Data Validation:** Pydantic `BaseModel` schemas
* **Database Driver:** Firebase Admin SDK (`firestore.client()`)
* **Server Gateway:** Uvicorn

---

## Key Features Implemented

* **Secure Login Authentication System:** Integrated a secure portal layout (`Login.tsx`) driven by **Firebase Auth**. Includes a robust user credential interface with real-time API authentication error translation (`friendlyError`) to capture client issues, and a route enforcement guard (`ProtectedRoute.tsx`) to shield dashboard data logs.
* **Persistent Sidebar Navigation Module:** Realized a uniform navigational shell (`Sidebar.tsx`) that lets administrative users pivot smoothly across separated target operations spaces:
  * **Overview Dashboard:** The master metrics desk reporting consolidated operational figures.
  * **All Tickets:** An administrative engine featuring inline column search filters.
  * **Open Tickets:** A status-column tracking layout showing real-time workloads grouped by operational state.
  * **Archived / Closed Tickets:** A historical repository log dedicated explicitly to finalized records.
* **Multi-Tier Frontend Filter Matrix:** Implemented complex list array filtration predicates inside the view templates. The dashboard can combine intersecting categories (e.g., `Reimbursement`, `Exchange`, `Policy`) and operational status flags dynamically without asking the database for extra reads.

---

## Ticket Lifecycle Workflow

The platform dynamically updates tickets to reflect specific operational phases based on user actions, background rules, and time-based triggers.

### Workflow Overview

```text
[ Scholar Submits Ticket ]
            │
            ▼
     1. OPEN STAGE ──────────► Visible to all HR officers in "All Tickets" & "Open Tickets" panels.
            │ (HR Officer Claims)
            ▼
┌──► 2. IN REVIEW ───────────► Officer locks ticket to their workspace to review details.
│        │   │
│        │   └─► (Request Info Action) ──► 3. WAITING FOR RESPONSE (Awaiting Scholar reply)
│        │   └─► (SLA Breach Trigger) ───► 4. OVERDUE ──► (Escalate Action) ──► 5. ESCALATED
│        │
│        └─────► (Resolve Issue Action) ─► 6. RESOLVED (Resolution details exposed to Scholar)
│                                               │
│                                               ├───► (Scholar Re-opens) ───┐
│                                               │                           │
│                                               └───► (Scholar Closes OR    │
│                                                      3 Working Days Pass) │
│                                                       │                   │
│                                                       ▼                   │
│                                                 7. CLOSED                 │
│                                                                           │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

```

### Operational Phases

| Phase | System Trigger / Action | Backend State Flag | Client Interface Behavior |
| --- | --- | --- | --- |
| **1. Open** | Ingestion payload generated upon scholar submission. | `status: "Open"` | Revealed globally across the `AllTickets` page and the `OpenTickets` page. |
| **2. In Review** | An HR officer triggers the `Assign Ticket` interaction panel. | `status: "In Review"`<br><br>`officer_id: "string"`<br> | Scoped directly to that assigned officer's working dashboard views. |
| **3. Waiting for Response** | HR officer initiates a `Request Info` communication hook. | `status: "Waiting for Response"` | Alerts the scholar on their client dashboard that documentation updates are required. |
| **4. Overdue** | `Current Time > Deadline` and ticket is active. | `status: "Overdue"` | Flags the ticket record with strict time-breach markers. |
| **5. Escalated** | HR officer manually executes an `Escalate Ticket` protocol. | `status: "Escalated"` | Routes accountability flags to multi-department or senior supervisor queues. |
| **6. Resolved** | HR officer submits the final solution text payload. | `status: "Resolved"` | Exposes the resolution text log directly to the student for confirmation. |
| **7. Closed** | Scholar clicks `Close` OR ticket remains resolved for **3 working days**. | `status: "Closed"` | Strips the ticket from active pools and commits it strictly to the historical archive logs. |

### Background Priority Ranking Engine

To maximize flexibility when sorting, priorities are evaluated computationally on the backend using a strict **1 to 10 integer scale** (with 10 being the highest urgency), while mapping onto distinct human-readable text tokens on the frontend interfaces.

#### 1. Priority Schema Mapping

The internal ranking scores map to user-facing severity tokens based on the following classification boundaries:

* `1 - 3` $\rightarrow$ **Low:** Routine administrative items with long-horizon deadlines.
* `4 - 7` $\rightarrow$ **Medium:** Standard operational inquiries requiring routine evaluation.
* `8 - 10` $\rightarrow$ **High:** Critical items needing immediate focus (e.g., urgent finance or travel clearances).

#### 2. Weighted Calculation Algorithm

Instead of requiring manual fields, a background utility running on the FastAPI backend evaluates incoming records dynamically using a multi-factor weighted configuration matrix bounded to our maximum ceiling of 10:

$$P_{\text{total}} = \min(10, W_{\text{category}} + W_{\text{urgency}})$$

* **Category Weight ($W_{\text{category}}$):** High-impact operational areas (such as `Finance` or critical `Policy` issues) inherently inject a heavier baseline ranking value than a routine `General Query`.
* **Urgency Weight ($W_{\text{urgency}}$):** As the current system clock converges closer to the trusted deadline timestamp specified by the scholar during ticket creation, the urgency integer systematically scales up, automatically bubbling critical issues to the top of the interface grids when sorted.

---

## Project Structure

```text
├── DIS-CONNECT-WEB-APP/          # Active React Project Root
│   ├── public/                   # Static browser asset directory
│   ├── src/                      # Monitored source code terminal
│   │   ├── assets/               # Integrated media and icon components
│   │   ├── components/           # Global reusable UI layout layouts
│   │   │   ├── Header.tsx        # Top status navigation utility
│   │   │   ├── Layout.tsx        # Shell blueprint wrapper
│   │   │   ├── ProtectedRoute.tsx # Route guard for verified user sessions
│   │   │   ├── Sidebar.tsx       # Primary navigation routing panel
│   │   │   └── TicketCard.tsx    # Operational ticket visualization component
│   │   ├── context/              # Global state management context containers
│   │   ├── hooks/                # Custom React hook abstractions
│   │   │   └── useTickets.ts     # Asynchronous ticket data fetching and orchestration
│   │   ├── lib/                  # Global shared configuration and initialization utilities
│   │   │   └── authRepository.ts # Core Firebase Auth API interactions bridge
│   │   ├── pages/                # High-level page layout terminals
│   │   │   ├── tickets/          
│   │   │   │   ├── AllTickets.tsx # Comprehensive ticket registry grid view
│   │   │   │   ├── ArchivedTickets.tsx # Historical resolved ticket logs terminal
│   │   │   │   └── OpenTickets.tsx # Open/Unassigned ticket management grid
│   │   │   ├── users/            # User account provisioning views
│   │   │   │   ├── CreateHrOfficerAccount.tsx # Register new HR team profiles
│   │   │   │   ├── CreateStudentAccount.tsx   # Provision scholar credential profiles
│   │   │   │   └── Users.tsx      # Comprehensive platform user directory
│   │   │   ├── Login.tsx         # Secure user authentication portal gateway
│   │   │   ├── Overview.tsx      # Main dashboard metric platform
│   │   │   ├── pages.tsx         # Central page router compilation
│   │   │   └── PageShell.tsx     # Context frame structure for views
│   │   ├── types/                # Strict TypeScript system data definitions
│   │   │   └── HrOfficer.ts      # Profile type interfaces for HR personnel
│   │   ├── App.css               # Base element style rules
│   │   ├── App.tsx               # Primary application core container
│   │   ├── index.css             # Compiled Tailwind directives inject gateway
│   │   ├── main.tsx              # React client Virtual DOM mount engine
│   │   └── vite-env.d.ts         # Native Vite runtime type definitions
│   ├── .firebaserc               # Firebase project target directory configuration
│   ├── .gitignore                # Production environment source control mask (.env)
│   ├── .prettierrc               # Code layout structural design configurations
│   ├── eslint.config.js          # Static code analysis configuration rules
│   ├── firebase.json             # Firebase runtime deployment parameters
│   ├── index.html                # Native entry DOM tree root shell
│   ├── package.json              # App dependency package manifest
│   ├── package-lock.json         # Strict dependency version locker manifest
│   ├── postcss.config.js         # CSS style processing engine matrix
│   ├── README.md                 # Primary system operations documentation
│   ├── tailwind.config.js        # Tailwind layout utility configuration
│   ├── tsconfig.app.json         # App runtime TypeScript compiler configurations
│   ├── tsconfig.json             # Strict TypeScript compiler root environment flags
│   └── vite.config.ts            # Vite asset server and environment configurations

```

---

## Local Development Installation

### 1. Repository Setup

```bash
git clone https://github.com/Ryanyzh/DIS-CONNECT-WEB-APP.git
cd DIS-CONNECT-WEB-APP

```

### 2. Frontend App Deployment

```bash
# Run installation loops
npm install

# Start the Vite local development engine
npm run dev

```

Open your browser terminal interface at the local address provided by Vite (typically `http://localhost:5173`).

---

## API Core Endpoints Documentation

### 1. Fetch User-Isolated Tickets

* **Route:** `GET /api/v1/tickets`
* **Response Status:** `200 OK`
* **Payload Type:** `Array<TicketProps>`
* **Required Headers:** `Authorization: Bearer <firebase_id_token>`

* **Description:** Extracts a specialized subset of operational ticket records mapped directly to the authenticated user. The backend decodes the incoming token string to verify the session and isolate user permissions securely.