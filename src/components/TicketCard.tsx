import type { HrOfficer } from "../types/HrOfficer";
import { useNavigate } from "react-router-dom";
import type { TicketAttachment } from "../types/TicketAttachment";
import { formatDate, type Scholar } from "../types/Scholar";

// ticket lifecycle
export type TicketStatus =
	| "Open"
	| "In Review"
	| "Waiting for Response"
	| "Resolved"
	| "Closed"
	| "Escalated";

// ticket categorys
export type TicketCategory = "Reimbursement" | "Exchange" | "Policy" | "Finance" | "General Query";

// fields that a ticket will have when created
export interface TicketProps {
	id: string;
	code: string;
	title: string;
	category: TicketCategory;
	description: string; // description of the issue
	priority: number; // priority of the ticket, higher number means higher priority (e.g. 1-5, 1 = very low priority, 5 = very high priority)
	status: TicketStatus;
	deadline: string; // deadline for resolving the ticket, can be used to compute "days until deadline/days overdue", maybe can also be used to compute priority
	lastUpdated: string;
	createdAt: string;
	isEscalated: boolean;
	scholar?: Scholar;
	officer?: HrOfficer; // the HR officer assigned to the ticket
	attachments: TicketAttachment[];
}

// props for TicketCard component, for things specific to the UI of the ticket card
export interface TicketCardProps {
	ticket: TicketProps;
}

export const categoryStyles: Record<TicketCategory, string> = {
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
	Escalated: { text: "text-rose-500", bg: "bg-rose-500/15" },
};

export const priorityLabels: Record<number, string> = {
	1: "Low Priority 1",
	2: "Low Priority 2",
	3: "Low Priority 3",
	4: "Medium Priority 4",
	5: "Medium Priority 5",
	6: "Medium Priority 6",
	7: "Medium Priority 7",
	8: "High Priority 8",
	9: "High Priority 9",
	10: "High Priority 10",
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

function TicketCard({ ticket }: TicketCardProps) {
	const navigate = useNavigate();
	const handleCardClick = () => {
		navigate(`/tickets/${ticket.id}`);
	};

	const isOverdue =
		new Date(ticket.deadline) < new Date() && ticket.status !== "Resolved" && ticket.status !== "Closed";

	return (
		<div
			onClick={handleCardClick}
			className="bg-wise-canvas p-4 rounded-xl border border-zinc-300/40 shadow-md hover:border-zinc-700/40 transition-all w-full flex flex-col justify-between relative cursor-pointer"
		>
			{/* Ticket ID and status dropdown */}
			<div className="flex flex-row justify-between mb-2 items-center">
				<span className="line-clamp-2 min-h-0 text-xs font-mono tracking-wider text-zinc-400">
					{ticket.code}
				</span>

				<span
					className={`line-clamp-2 flex font-semibold w-fit min-h-0 text-xs leading-snug tracking-tight ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg} px-1.5 py-1 rounded-md`}
				>
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
						<span className={`${ticket.isEscalated ? "text-rose-500" : "text-zinc-400" }`}>Assigned to: {ticket.officer.name}</span>
					) : (
						<span className="text-pink-400">Unassigned</span>
					)}

					<span
						className={`text-xs px-1.5 py-1 mr-1 rounded-md font-semibold ${categoryStyles[ticket.category]}`}
					>
						{ticket.category}
					</span>
					<span>Last updated: {formatDate(ticket.lastUpdated)}</span>
					<span className={`text-sm ${isOverdue ? "text-rose-500" : "text-zinc-400"}`}>
						{formatDate(ticket.deadline) ? `Due by: ${formatDate(ticket.deadline)}` : ""}
					</span>
				</div>
				<span
					className={`px-1.5 py-1 rounded-md font-semibold ${priorityStyles[ticket.priority]}`}
				>
					{priorityLabels[ticket.priority]}
				</span>
			</div>
		</div>
	);
}

export default TicketCard;
