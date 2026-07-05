import type { HrOfficer } from "../../types/HrOfficer";
import { useNavigate } from "react-router-dom";
import type { TicketAttachment } from "../../types/TicketAttachment";
import { formatDate, type Scholar } from "../../types/Scholar";

export type TicketStatus =
	| "Open"
	| "In Review"
	| "Waiting"
	| "Resolved"
	| "Closed"
	| "Escalated";

// ticket categories
export type TicketCategory =
	| "Reimbursement"
	| "Exchange"
	| "Policy"
	| "Scholarship"
	| "Leave"
	| "Internship"
	| string;
export type TicketView = "list" | "card";

export interface TicketProps {
	id: string;
	code: string;
	title: string;
	category: TicketCategory;
	description: string;
	priority: number;
	status: TicketStatus;
	deadline: string | null; // deadline for resolving the ticket, can be used to compute "days until deadline/days overdue", maybe can also be used to compute priority
	lastUpdated: string;
	createdAt: string;
	isEscalated: boolean;
	scholar?: Scholar;
	officer?: HrOfficer;
	attachments: TicketAttachment[];
}

export interface TicketCardProps {
	ticket: TicketProps;
	view?: TicketView;
}

// Fixed column widths used by both ListCard and the header row in AllTickets
export const LIST_GRID_COLS = "1fr 108px 132px 88px 100px 118px 16px";

export const categoryStyles: Record<string, string> = {
	Reimbursement: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	Exchange:      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
	Policy:        "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
	Scholarship:   "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
	Leave:         "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
	Internship:    "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
};

// Fallback for any category not in the map above
const CATEGORY_FALLBACK = "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-300";

export const statusStyles: Record<TicketStatus, { text: string; bg: string }> = {
	Open:        { text: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-400/15" },
	"In Review": { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-400/15" },
	Waiting:     { text: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-400/15" },
	Resolved:    { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-400/15" },
	Closed:      { text: "text-gray-500 dark:text-gray-400",    bg: "bg-gray-100 dark:bg-gray-400/15" },
	Escalated:   { text: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-400/15" },
};

export const statusStripeStyles: Record<TicketStatus, string> = {
	Open:        "bg-blue-500",
	"In Review": "bg-indigo-500",
	Waiting:     "bg-amber-400",
	Resolved:    "bg-emerald-500",
	Closed:      "bg-gray-400",
	Escalated:   "bg-rose-500",
};

// Abbreviated labels for compact list/table cells
export const statusShort: Record<TicketStatus, string> = {
	Open:        "Open",
	"In Review": "In Review",
	Waiting:     "Waiting",
	Resolved:    "Resolved",
	Closed:      "Closed",
	Escalated:   "Escalated",
};

export const priorityLabels: Record<number, string> = {
	1: "Low",
	2: "Medium",
	3: "High",
	4: "Critical",
};

export const priorityStyles: Record<number, string> = {
	1: "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-400/15",
	2: "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/15",
	3: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-400/15",
	4: "text-violet-700 bg-violet-50 dark:text-violet-400 dark:bg-violet-400/15",
};

// ─── List view ────────────────────────────────────────────────────────────────
// Uses a CSS grid with fixed column widths so every row aligns perfectly
// regardless of missing values. Empty cells render a "—" placeholder.

function ListCard({ ticket }: TicketCardProps) {
	const navigate = useNavigate();

	const isOverdue = ticket.deadline
		? new Date(ticket.deadline) < new Date() &&
			ticket.status !== "Resolved" &&
			ticket.status !== "Closed"
		: false;

	return (
		<div
			onClick={() => navigate(`/tickets/${ticket.id}`)}
			className="group bg-dc-surface dark:bg-zinc-900 rounded-xl border border-dc-border dark:border-zinc-800 shadow-dc-sm hover:shadow-dc-md hover:border-dc-primary/40 dark:hover:border-dc-primary/60 transition-all cursor-pointer flex items-stretch overflow-hidden"
		>
			{/* Status stripe — always rendered, gives instant color cue */}
			<div
				className={`w-1 flex-shrink-0 ${ticket.isEscalated ? "bg-red-500" : statusStripeStyles[ticket.status]}`}
			/>

			{/* Fixed-width grid — columns never shift when values are absent */}
			<div
				className="grid items-center gap-x-3 px-4 py-3 w-full min-w-0"
				style={{ gridTemplateColumns: LIST_GRID_COLS }}
			>
				{/* Col 1 – Ticket code + title */}
				<div className="min-w-0">
					<span className="text-[10px] font-mono tracking-widest text-dc-text-muted leading-tight block">
						{ticket.code}
					</span>
					<span className="text-sm font-semibold text-dc-text dark:text-white group-hover:text-dc-primary transition-colors leading-snug block truncate mt-0.5">
						{ticket.title}
					</span>
				</div>

				{/* Col 2 – Category pill */}
				<div>
					<span
						className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${categoryStyles[ticket.category] ?? CATEGORY_FALLBACK}`}
					>
						{ticket.category}
					</span>
				</div>

				{/* Col 3 – Assignee */}
				<div className="min-w-0">
					{ticket.officer ? (
						<span
							className={`text-xs block truncate ${ticket.isEscalated ? "text-dc-error dark:text-dc-error-dark font-medium" : "text-dc-text-muted"}`}
						>
							{ticket.officer.name}
						</span>
					) : (
						<span className="text-xs text-dc-error dark:text-dc-error-dark font-medium">
							Unassigned
						</span>
					)}
				</div>

				{/* Col 4 – Deadline (dash placeholder keeps column width stable) */}
				<div>
					{formatDate(ticket.deadline) ? (
						<span
							className={`text-xs ${isOverdue ? "text-dc-error dark:text-dc-error-dark font-medium" : "text-dc-text-muted"}`}
						>
							{formatDate(ticket.deadline)}
						</span>
					) : (
						<span className="text-xs text-dc-text-muted opacity-30">—</span>
					)}
				</div>

				{/* Col 5 – Priority pill */}
				<div>
					<span
						className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${priorityStyles[ticket.priority]}`}
					>
						{priorityLabels[ticket.priority]}
					</span>
				</div>

				{/* Col 6 – Status pill (abbreviated to fit fixed column) */}
				<div>
					<span
						className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}
					>
						{statusShort[ticket.status]}
					</span>
				</div>

				{/* Col 7 – Hover chevron */}
				<svg
					className="w-3.5 h-3.5 text-dc-text-muted opacity-0 group-hover:opacity-40 transition-opacity justify-self-end"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2.5}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</div>
		</div>
	);
}

// ─── Card view ────────────────────────────────────────────────────────────────
// Visual card for grid layout — full status name, 2-line title, footer with
// assignee and deadline always rendered so card heights stay consistent.

function CardView({ ticket }: TicketCardProps) {
	const navigate = useNavigate();

	const isOverdue =
		!!ticket.deadline &&
		new Date(ticket.deadline) < new Date() &&
		ticket.status !== "Resolved" &&
		ticket.status !== "Closed";

	const deadline = formatDate(ticket.deadline);

	return (
		<div
			onClick={() => navigate(`/tickets/${ticket.id}`)}
			className="group bg-dc-surface dark:bg-zinc-900 rounded-xl border border-dc-border dark:border-zinc-800 shadow-dc-sm hover:shadow-dc-md hover:border-dc-primary/40 dark:hover:border-dc-primary/60 transition-all cursor-pointer overflow-hidden min-h-[165px] flex flex-col"
		>
			{/* Thin top stripe */}
			<div
				className={`h-0.5 flex-shrink-0 ${ticket.isEscalated ? "bg-red-600" : statusStripeStyles[ticket.status]}`}
			/>

			<div className="p-3 flex flex-col gap-2 flex-1">
				{/* Row 1: code + abbreviated status */}
				<div className="flex items-center justify-between gap-2">
					<span className="text-[10px] font-mono tracking-widest text-dc-text-muted leading-none">
						{ticket.code}
					</span>
					<span
						className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}
					>
						{statusShort[ticket.status]}
					</span>
				</div>

				{/* Row 2: title */}
				<p className="text-sm font-semibold text-dc-text dark:text-white group-hover:text-dc-primary transition-colors leading-snug line-clamp-2">
					{ticket.title}
				</p>

				{/* Row 3: category + priority badges */}
				<div className="flex items-center gap-1.5 flex-wrap">
					<span
						className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryStyles[ticket.category] ?? CATEGORY_FALLBACK}`}
					>
						{ticket.category}
					</span>
					<span
						className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[ticket.priority]}`}
					>
						{priorityLabels[ticket.priority]}
					</span>
				</div>

				{/* Row 4: footer — assignee | deadline — mt-auto keeps it pinned to bottom */}
				<div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-dc-border dark:border-zinc-800">
					{ticket.officer ? (
						<span
							className={`text-[11px] truncate leading-none ${ticket.isEscalated ? "text-dc-error dark:text-dc-error-dark font-medium" : "text-dc-text-muted"}`}
						>
							{ticket.officer.name}
						</span>
					) : (
						<span className="text-[11px] text-dc-error dark:text-dc-error-dark font-medium leading-none">
							Unassigned
						</span>
					)}
					<span
						className={`text-[10px] flex-shrink-0 leading-none ${
							!deadline
								? "text-dc-text-muted opacity-25"
								: isOverdue
									? "text-orange-500 dark:text-orange-400 font-medium"
									: "text-dc-text-muted"
						}`}
					>
						{!deadline ? "—" : isOverdue ? "Overdue" : `Due ${deadline}`}
					</span>
				</div>
			</div>
		</div>
	);
}

function TicketCard({ ticket, view = "list" }: TicketCardProps) {
	if (view === "card") return <CardView ticket={ticket} />;
	return <ListCard ticket={ticket} />;
}

export default TicketCard;
