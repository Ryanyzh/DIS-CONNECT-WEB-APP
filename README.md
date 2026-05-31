# DIS-CONNECT-WEB-APP

Used for Orbital Project, this is a web-based dashboard for HR officers to manage and resolve tickets.

---

# Ticket Dashboard

An ticketing dashboard to track, manage, and route scholar enquiries. Built with a decoupled **FastAPI** backend and a responsive **React (Vite + TypeScript)** frontend.

---

## Tech Stack Architecture

### Frontend Terminal

* **Core Framework:** React 18 (Vite-powered environment pipelines)
* **Language:** TypeScript (Strict type interfaces for object payloads)
* **Styling Engine:** Tailwind CSS
* **Data Flow Architecture:** Asynchronous browser DOM Event listeners and event loops

### Backend Controller

* **Core API Engine:** FastAPI (Python 3.10+)
* **Data Validation:** Pydantic `BaseModel` schemas
* **Server Gateway:** Uvicorn

---

## 🚀 Key Features Implemented

* **Dynamic Ticket Dashboard:** Real-time columnar ticket layout filtering utilizing specialized mapping criteria configurations (`columns`).
* **Ticket Status Dropdown Menus:** HTML `<select>` dropdown menus to update ticket status in real-time.

---

## 📂 Project Structure

```text
├── DIS-CONNECT-WEB-APP/          # Active React Project Root
│   ├── public/                   # Static browser asset directory
│   ├── src/                      # Monitored source code terminal
│   │   ├── assets/               # Integrated media and icon components
│   │   ├── components/           # Global reusable UI layout layouts
│   │   │   ├── Header.tsx        # Top status navigation utility
│   │   │   ├── Layout.tsx        # Shell blueprint wrapper
│   │   │   ├── Sidebar.tsx       # Primary navigation routing panel
│   │   │   └── TicketCard.tsx    # Operational ticket visualization component
│   │   ├── pages/                # High-level page layout terminals
│   │   │   ├── tickets/          
│   │   │   │   └── OpenTickets.tsx # Open/Unassigned ticket management grid
│   │   │   ├── users/            # Officer profile management node
│   │   │   ├── Overview.tsx      # Main dashboard metric platform
│   │   │   ├── pages.tsx         # Central page router compilation
│   │   │   └── PageShell.tsx     # Context frame structure for views
│   │   ├── types/                # Strict TypeScript system data definitions
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
│   ├── package-lock.json         # Strict dependency version locker manifest
│   ├── package.json              # App dependency package manifest
│   ├── postcss.config.js         # CSS style processing engine matrix
│   ├── README.md                 # Primary system operations documentation
│   ├── tailwind.config.js        # Tailwind layout utility configuration
│   └── vite.config.ts            # Vite asset server and environment configurations
```

---

## 🛠️ Local Development Installation

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

## 📡 API Core Endpoints Documentation

### 1. Fetch All Operational Tickets

* **Route:** `GET /api/tickets`
* **Response Status:** `200 OK`
* **Payload Type:** `Array<TicketProps>`

### 2. Update Ticket Status Pipeline

* **Route:** `PATCH /api/tickets/{ticket_id}/status`
* **Request Guard Body:** ```json
{
"status": "In Review"
}
```

```


* **Validation Failure:** `422 Unprocessable Entity` (Pydantic Schema Error)
* **Target Missing:** `404 Not Found` (Invalid Ticket Identifier string)
* **Success Response:** `200 OK`

---