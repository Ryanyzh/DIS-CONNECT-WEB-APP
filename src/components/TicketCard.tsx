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

// ticket categories
export type TicketCategory = "Reimbursement" | "Exchange" | "Policy" | "Finance" | "General Query";

// fields that a ticket will have when created
export interface TicketProps {
	id: string;
	code: string;
	title: string;
	category: TicketCategory;
	description: string;
	priority: number;
	status: TicketStatus;
	deadline: string;
	lastUpdated: string;
	createdAt: string;
	isEscalated: boolean;
	scholar?: Scholar;
	officer?: HrOfficer;
	attachments: TicketAttachment[];
}

export interface TicketCardProps {
	ticket: TicketProps;
}

export const categoryStyles: Record<TicketCategory, string> = {
	Reimbursement: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	Exchange:      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
	Policy:        "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
	Finance:       "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
	"General Query": "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
};

export const statusStyles: Record<TicketStatus, { text: string; bg: string }> = {
	Open:                   { text: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-400/15" },
	"In Review":            { text: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-400/15" },
	"Waiting for Response": { text: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-400/15" },
	Resolved:               { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-400/15" },
	Closed:                 { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-400/15" },
	Escalated:              { text: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-500/15" },
};

export const priorityLabels: Record<number, string> = {
	1: "P1 · Low",
	2: "P2 · Low",
	3: "P3 · Low",
	4: "P4 · Medium",
	5: "P5 · Medium",
	6: "P6 · Medium",
	7: "P7 · Medium",
	8: "P8 · High",
	9: "P9 · High",
	10: "P10 · High",
};

export const priorityStyles: Record<number, string> = {
	1:  "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-400/15",
	2:  "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-400/15",
	3:  "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-400/15",
	4:  "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/15",
	5:  "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/15",
	6:  "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/15",
	7:  "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/15",
	8:  "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-400/15",
	9:  "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-400/15",
	10: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-400/15",
};

function TicketCard({ ticket }: TicketCardProps) {
	const navigate = useNavigate();

	const isOverdue =
		new Date(ticket.deadline) < new Date() &&
		ticket.status !== "Resolved" &&
		ticket.status !== "Closed";

	return (
		<div
			onClick={() => navigate(`/tickets/${ticket.id}`)}
			className="bg-dc-surface dark:bg-dc-surface-dark p-4 rounded-xl border border-dc-border dark:border-dc-border-dark shadow-dc-sm hover:shadow-dc-md hover:border-dc-primary/40 dark:hover:border-dc-primary/60 transition-all w-full flex flex-col justify-between cursor-pointer"
		>
			{/* Ticket code and status */}
			<div className="flex flex-row justify-between mb-2 items-center">
				<span className="text-xs font-mono tracking-wider text-dc-text-muted">
					{ticket.code}
				</span>
				<span
					className={`text-xs font-semibold px-2 py-0.5 rounded-md ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}
				>
					{ticket.status}
				</span>
			</div>

			{/* Title */}
			<div className="text-sm font-semibold leading-snug tracking-tight line-clamp-2 text-dc-text dark:text-white mb-1">
				{ticket.title}
			</div>

			{/* Meta row */}
			<div className="flex flex-wrap justify-between items-center pt-3 text-xs text-dc-text-muted gap-3">
				<div className="flex flex-wrap items-center gap-3">
					{ticket.officer ? (
						<span className={ticket.isEscalated ? "text-dc-error dark:text-dc-error-dark" : "text-dc-text-muted"}>
							{ticket.officer.name}
						</span>
					) : (
						<span className="text-dc-error dark:text-dc-error-dark font-medium">Unassigned</span>
					)}

					<span className={`px-1.5 py-0.5 rounded-md font-semibold text-xs ${categoryStyles[ticket.category]}`}>
						{ticket.category}
					</span>

					<span className={isOverdue ? "text-dc-error dark:text-dc-error-dark font-medium" : ""}>
						{formatDate(ticket.deadline) ? `Due ${formatDate(ticket.deadline)}` : ""}
					</span>
				</div>

				<span className={`px-1.5 py-0.5 rounded-md font-semibold text-xs ${priorityStyles[ticket.priority]}`}>
					{priorityLabels[ticket.priority]}
				</span>
			</div>
		</div>
	);
}

export default TicketCard;
