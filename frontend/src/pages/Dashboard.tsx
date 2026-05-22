import React from "react";
import TicketCard from "../components/TicketCard";
import type { TicketProps, TicketStatus } from "../components/TicketCard";
import logo from "../assets/dis-connect.png";

const testTickets: TicketProps[] = [
  // In Review
  {
    id: "REB-2024-0012",
    title: "Hostel Reimbursement Year 1 Semester 1",
    tag: "Reimbursement",
    description:
      "Requesting reimbursement for hostel fees for Year 1 Semester 1",
    priority: 3,
    status: "In Review",
    deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
    lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
    officer: {
      id: "0",
      name: "Eileen T.",
      email: "eileen.t@example.com",
      department: "HR",
    },
  },
  // Waiting for Response
  {
    id: "EXCH-2024-0051",
    title: "NOC overseas extension",
    tag: "Exchange",
    description: "Requesting extension for overseas exchange",
    priority: 4,
    status: "Waiting for Response",
    deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
    lastUpdated: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
    officer: {
      id: "1",
      name: "Marcus W.",
      email: "marcus.w@example.com",
      department: "HR",
    },
  },
  // Resolved
  {
    id: "POL-2024-0030",
    title: "Bond deferral - postgrad",
    tag: "Policy",
    description: "Requesting bond deferral for further studies",
    priority: 1,
    status: "Resolved",
    deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
    lastUpdated: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
    officer: {
      id: "1",
      name: "Marcus W.",
      email: "marcus.w@example.com",
      department: "HR",
    },
  },
  // Overdue
  {
    id: "EXCH-2024-0040",
    title: "NOC request - urgent",
    tag: "Exchange",
    description: "Requesting permission for overseas exchange",
    priority: 5,
    status: "In Review",
    deadline: new Date(new Date().getTime() - 10 * 60000), // 10 minutes ago
    lastUpdated: new Date(new Date().getTime() - 20 * 60000), // 20 minutes ago
    officer: {
      id: "0",
      name: "Eileen T.",
      email: "eileen.t@example.com",
      department: "HR",
    },
  },
];

function Dashboard() {
  return (
    <div className="h-screen w-screen bg-zinc-950 flex flex-col text-zinc-200">
      {/* Top banner */}
      <div className="max-h-22 w-screen border-b border-zinc-700 flex flex-row items-center">
        <img
          src={logo}
          alt="dis-connect logo"
          className="w-20 h-20 object-contain m-4"
        />
        <span className="text-[#c7ed41] text-3xl font-extrabold">
          DIS-CONNECT
        </span>
      </div>

      {/* Ticket Board */}
      <div className="grid grid-cols-4 gap-4">
        
      </div>
    </div>
  );
}

export default Dashboard;
