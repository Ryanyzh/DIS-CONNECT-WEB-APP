import type { HrOfficer } from "../types/HrOfficer";
import React, { useState } from "react";
import { getIdToken } from "../lib/authRepository";
import { useNavigate } from "react-router-dom";
import type { TicketAttachment } from "../types/TicketAttachment";
import type { Scholar } from "../types/Scholar";

// ticket lifecycle
export type TicketStatus = "Open" | "In Review" | "Waiting for Response" | "Resolved" | "Closed";

// ticket tags
export type TicketTag = "Reimbursement" | "Exchange" | "Policy" | "Finance" | "General Query";

// fields that a ticket will have when created
export interface TicketProps {
	id: string;
	code: string;
	title: string;
	tag: TicketTag;
	description: string; // description of the issue
	priority: number; // priority of the ticket, higher number means higher priority (e.g. 1-5, 1 = very low priority, 5 = very high priority)
	status: TicketStatus;
	deadline: Date; // deadline for resolving the ticket, can be used to compute "days until deadline/days overdue", maybe can also be used to compute priority
	lastUpdated: Date;
	createdAt: Date;
	scholar?: Scholar;
	officer?: HrOfficer; // the HR officer assigned to the ticket
	attachments?: TicketAttachment[];
}

// props for TicketCard component, for things specific to the UI of the ticket card
export interface TicketCardProps {
	ticket: TicketProps;
	onStatusChange: () => void; // function to call when status is changed to reload dashboard
}

export const tagStyles: Record<TicketTag, string> = {
	Reimbursement: "bg-blue-600/15 text-blue-800",
	Exchange: "bg-amber-600/15 text-amber-800",
	Policy: "bg-emerald-600/15 text-emerald-800",
	Finance: "bg-rose-600/15 text-rose-800",
	"General Query": "bg-cyan-600/15 text-cyan-800",
};

export const statusStyles: Record<TicketStatus, { text: string; bg: string }> = {
	Open: { text: "text-pink-400", bg: "bg-pink-400/15" },
	"In Review": { text: "text-blue-400", bg: "bg-blue-400/15" },
	"Waiting for Response": { text: "text-amber-400", bg: "bg-amber-400/15" },
	Resolved: { text: "text-emerald-400", bg: "bg-emerald-400/15" },
	Closed: { text: "text-violet-500", bg: "bg-violet-500/15" },
};

export const priorityStyles: Record<number, string> = {
	1: "text-green-400 bg-green-400/15",
	2: "text-green-400 bg-green-400/15",
	3: "text-green-400 bg-green-400/15",
	4: "text-yellow-400 bg-yellow-400/15",
	5: "text-yellow-400 bg-yellow-400/15",
	6: "text-yellow-400 bg-yellow-400/15",
	7: "text-yellow-400 bg-yellow-400/15",
	8: "text-red-400 bg-red-400/15",
	9: "text-red-400 bg-red-400/15",
	10: "text-red-400 bg-red-400/15",
};

function TicketCard({ ticket, onStatusChange }: TicketCardProps) {
	const navigate = useNavigate();
	const handleCardClick = () => {
		navigate(`/tickets/${ticket.id}`);
	};
	
	const [newStatus, setStatus] = useState<TicketStatus>(ticket.status);
	const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedStatus = e.target.value as TicketStatus;
		setStatus(selectedStatus);
		if (selectedStatus == ticket.status) {
			return; // don't need to do anything, status unchanged
		}

		try {
			const idToken = await getIdToken();

			// send HTTP PATCH request to backend to update ticket status
			const response = await fetch(`/api/v1/tickets/${ticket.id}/status`, {
				method: "PATCH",
				headers: {
					authorization: idToken ? `Bearer ${idToken}` : "",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: selectedStatus }),
			});

			if (response.ok) {
				// ticket status successfully updated, refresh the dashboard to show updated status
				onStatusChange();
			}
		} catch (error) {
			console.error("Error updating ticket status: ", error);
			// revert status change in UI
			setStatus(ticket.status);
		}
	};

	const isOverdue =
		ticket.deadline < new Date() && ticket.status !== "Resolved" && ticket.status !== "Closed";

	return (
		<div onClick={handleCardClick} className="bg-wise-canvas p-4 rounded-xl border border-zinc-300/40 shadow-md hover:border-zinc-700/40 transition-all w-full flex flex-col justify-between relative cursor-pointer">
			{/* Ticket ID and status dropdown */}
			<div className="flex flex-row justify-between mb-2 items-center">
				<span className="line-clamp-2 min-h-0 text-xs font-mono tracking-wider text-zinc-400">
					{ticket.code}
				</span>

				{/* Dropdown button for changing ticket status
				<select
					name="status"
					value={newStatus}
					onChange={handleStatusChange}
					className={`bg-wise-canvas line-clamp-2 flex font-semibold text-right w-fit min-h-0 text-xs leading-snug tracking-tight ${statusStyles[newStatus]} focus:outline-none`}
				>
					<option value="Open" className="bg-zinc-900 text-zinc-100">
						Open
					</option>
					<option value="In Review" className="bg-zinc-900 text-zinc-100">
						In Review
					</option>
					<option value="Waiting for Response" className="bg-zinc-900 text-zinc-100">
						Waiting for Response
					</option>
					<option value="Resolved" className="bg-zinc-900 text-zinc-100">
						Resolved
					</option>
					<option value="Closed" className="bg-zinc-900 text-zinc-100">
						Closed
					</option>
				</select> */}


				<span className={`line-clamp-2 flex font-semibold text-right w-fit min-h-0 text-xs leading-snug tracking-tight ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg} px-1.5 py-1 rounded-md`}>
					{ticket.status}
				</span>
			</div>

			{/* Ticket title */}
			<div className="text-lg font-semibold leading-snug tracking-tight line-clamp-2">
				{ticket.title}
			</div>

			{/* Assigned Officer, ticket category, last updated, deadline */}
			<div className="flex flex-wrap justify-between items-center pt-3 text-sm text-zinc-400 gap-4">
				<div className="flex flex-wrap items-center gap-4">
					{ticket.officer ? (
						<span className="font-medium text-zinc-300">{ticket.officer.name}</span>
					) : (
						<span className="font-medium text-pink-400">Unassigned</span>
					)}

					<span
						className={`text-xs px-1.5 py-1 mr-1 rounded-md font-semibold ${tagStyles[ticket.tag]}`}
					>
						{ticket.tag}
					</span>
					<span>Last updated: {ticket.lastUpdated.toLocaleString()}</span>
					<span className={`text-sm ${isOverdue ? "text-rose-500" : "text-zinc-400"}`}>
						Due by: {ticket.deadline.toLocaleString()}
					</span>
				</div>
				<span className={`px-1.5 py-1 rounded-md font-semibold ${priorityStyles[ticket.priority]}`}>
					{ticket.priority <= 3
						? `Low ${ticket.priority}`
						: ticket.priority >= 8
							? `High ${ticket.priority}`
							: `Medium ${ticket.priority}`}
				</span>
			</div>
		</div>
	);
}

export default TicketCard;
