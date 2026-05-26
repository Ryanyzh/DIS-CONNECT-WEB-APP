import type { HrOfficer } from "../types/HrOfficer";
import React, { useState } from "react";

// ticket lifecycle
export type TicketStatus =
  | "Open"
  | "In Review"
  | "Waiting for Response"
  | "Resolved"
  | "Closed";

// ticket tags
export type TicketTag =
  | "Reimbursement"
  | "Exchange"
  | "Policy"
  | "Finance"
  | "General Query";

// fields that a ticket will have when created
export interface TicketProps {
  id: string; // ticket id in the form of {Tag}-{year of deadline}-{numerical id (number of tickets created in that year with that tag)}
  title: string;
  tag: TicketTag;
  description: string; // description of the issue
  priority: number; // priority of the ticket, higher number means higher priority (e.g. 1-5, 1 = very low priority, 5 = very high priority)
  status: TicketStatus;
  deadline: Date; // deadline for resolving the ticket, can be used to compute "days until deadline/days overdue", maybe can also be used to compute priority
  lastUpdated: Date;
  officer: HrOfficer; // the HR officer assigned to the ticket
}

function TicketCard({ ticket }: { ticket: TicketProps }) {
  const tagStyles: Record<TicketTag, string> = {
    Reimbursement: "bg-blue-950/40 text-blue-300 border-blue-900/40",
    Exchange: "bg-amber-950/40 text-amber-300 border-amber-900/40",
    Policy: "bg-emerald-950/40 text-emerald-300 border-emerald-900/40",
    Finance: "bg-rose-950/40 text-rose-300 border-rose-900/40",
    "General Query": "bg-cyan-950/40 text-cyan-300 border-cyan-900/40",
  };

  const statusStyles: Record<TicketStatus, string> = {
    Open: "text-pink-400",
    "In Review": "text-blue-400",
    "Waiting for Response": "text-amber-400",
    Resolved: "text-emerald-400",
    Closed: "text-violet-500",
  };

  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as TicketStatus);
  };

  const isOverdue =
    ticket.deadline < new Date() &&
    ticket.status !== "Resolved" &&
    ticket.status !== "Closed";

  return (
    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700/40 shadow-md hover:border-zinc-100/40 transition-all w-full text-zinc-100 flex flex-col justify-between relative">
      {/* Ticket ID and status dropdown */}
      <div className="flex flex-row justify-between mb-2 items-center">
        <span className="text-xs font-mono tracking-wider text-zinc-500">
          {ticket.id}
        </span>
        {/* Dropdown button for changing ticket status */}
        <select
          name="status"
          value={status}
          onChange={handleStatusChange}
          className={`flex font-semibold text-right w-full py-2 text-xs leading-snug tracking-tight ${statusStyles[status]}`}
        >
          <option value="Open" className="text-zinc-200">
            Open
          </option>
          <option value="In Review" className="text-zinc-200">
            In Review
          </option>
          <option value="Waiting for Response" className="text-zinc-200">
            Waiting for Response
          </option>
          <option value="Resolved" className="text-zinc-200">
            Resolved
          </option>
          <option value="Closed" className="text-zinc-200">
            Closed
          </option>
        </select>
      </div>

      {/* Ticket title */}
      <div className="text-lg font-semibold leading-snug tracking-tight text-zinc-200 mb-4 line-clamp-2 ">
        {ticket.title}
      </div>

      {/* Ticket tag and deadline */}
      <div className="mb-5 flex justify-between items-center">
        <span
          className={`text-xs px-2.5 py-1 mr-1 rounded-md border font-medium ${tagStyles[ticket.tag]}`}
        >
          {ticket.tag}
        </span>
        <span
          className={`text-right text-sm ${isOverdue ? "text-rose-500" : "text-zinc-400"}`}
        >
          by: {ticket.deadline.toLocaleString()}
        </span>
      </div>

      {/* Assigned Officer and last updated */}
      <div className="flex justify-between items-center pt-3 border-t border-zinc-800/60 text-sm text-zinc-400">
        <div>
          <span className="font-medium text-zinc-300 mr-1">
            {ticket.officer.name}
          </span>
        </div>
        <span className="text-right">
          last updated: {ticket.lastUpdated.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default TicketCard;
