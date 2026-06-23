export type ActivityEventType =
	| "account_created"
	| "profile_updated"
	| "ticket_submitted"
	| "ticket_status_changed"
	| "ticket_resolved"
	| "exchange_registered"
	| "document_uploaded"
	| "note_added";

export interface ActivityLog {
	id: string;
	scholarId: string;
	scholarName: string;
	studentId: string;
	eventType: ActivityEventType;
	description: string;
	metadata?: Record<string, string>;
	performedBy: string; // HR officer name, "Scholar", or "System"
	timestamp: string; // ISO 8601
}

export const EVENT_TYPES: ActivityEventType[] = [
	"account_created",
	"profile_updated",
	"ticket_submitted",
	"ticket_status_changed",
	"ticket_resolved",
	"exchange_registered",
	"document_uploaded",
	"note_added",
];

export const eventConfig: Record<
	ActivityEventType,
	{ label: string; icon: string; color: string; badge: string }
> = {
	account_created: {
		label: "Account Created",
		icon: "user-plus",
		color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
	},
	profile_updated: {
		label: "Profile Updated",
		icon: "pencil",
		color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
	},
	ticket_submitted: {
		label: "Ticket Submitted",
		icon: "ticket",
		color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
	},
	ticket_status_changed: {
		label: "Status Changed",
		icon: "arrow",
		color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
		badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
	},
	ticket_resolved: {
		label: "Ticket Resolved",
		icon: "check",
		color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
		badge: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
	},
	exchange_registered: {
		label: "Placement Registered",
		icon: "globe",
		color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
		badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
	},
	document_uploaded: {
		label: "Document Uploaded",
		icon: "document",
		color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
		badge: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
	},
	note_added: {
		label: "Note Added",
		icon: "note",
		color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
		badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
	},
};

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
	{
		id: "1",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "account_created",
		description: "Scholar account created and onboarded to the portal.",
		performedBy: "Sarah Williams",
		timestamp: "2022-08-01T09:15:00Z",
	},
	{
		id: "2",
		scholarId: "2",
		scholarName: "Bob Smith",
		studentId: "A0234568C",
		eventType: "account_created",
		description: "Scholar account created and onboarded to the portal.",
		performedBy: "Sarah Williams",
		timestamp: "2023-08-01T10:00:00Z",
	},
	{
		id: "3",
		scholarId: "3",
		scholarName: "Carol White",
		studentId: "A0234569D",
		eventType: "account_created",
		description: "Scholar account created and onboarded to the portal.",
		performedBy: "Mark Johnson",
		timestamp: "2024-08-01T09:30:00Z",
	},
	{
		id: "4",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "exchange_registered",
		description: "Exchange placement registered at ETH Zürich, Switzerland.",
		metadata: { institution: "ETH Zürich", country: "Switzerland", type: "Exchange" },
		performedBy: "Sarah Williams",
		timestamp: "2023-11-01T11:00:00Z",
	},
	{
		id: "5",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "ticket_submitted",
		description: "Ticket EXC-2024-001 submitted: Exchange housing reimbursement claim.",
		metadata: { ticketId: "EXC-2024-001", category: "Reimbursement" },
		performedBy: "Scholar",
		timestamp: "2024-03-10T14:22:00Z",
	},
	{
		id: "6",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "ticket_status_changed",
		description: "Ticket EXC-2024-001 moved from Open → In Review.",
		metadata: { ticketId: "EXC-2024-001", from: "Open", to: "In Review" },
		performedBy: "Sarah Williams",
		timestamp: "2024-03-12T09:05:00Z",
	},
	{
		id: "7",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "document_uploaded",
		description: "Supporting document uploaded for reimbursement claim (receipt_ethhsg.pdf).",
		metadata: { file: "receipt_ethhsg.pdf", ticketId: "EXC-2024-001" },
		performedBy: "Scholar",
		timestamp: "2024-03-13T16:45:00Z",
	},
	{
		id: "8",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "ticket_resolved",
		description: "Ticket EXC-2024-001 marked Resolved. Reimbursement approved.",
		metadata: { ticketId: "EXC-2024-001" },
		performedBy: "Sarah Williams",
		timestamp: "2024-04-02T10:30:00Z",
	},
	{
		id: "9",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "ticket_submitted",
		description: "Ticket POL-2024-007 submitted: Clarification on bond obligation terms.",
		metadata: { ticketId: "POL-2024-007", category: "Policy" },
		performedBy: "Scholar",
		timestamp: "2024-05-15T11:10:00Z",
	},
	{
		id: "10",
		scholarId: "4",
		scholarName: "David Tan",
		studentId: "A0211234E",
		eventType: "profile_updated",
		description: "Scholar status updated to On Leave.",
		metadata: { field: "status", from: "Active", to: "On Leave" },
		performedBy: "Mark Johnson",
		timestamp: "2024-05-30T08:50:00Z",
	},
	{
		id: "11",
		scholarId: "2",
		scholarName: "Bob Smith",
		studentId: "A0234568C",
		eventType: "ticket_submitted",
		description: "Ticket FIN-2024-003 submitted: Allowance disbursement delay — May 2024.",
		metadata: { ticketId: "FIN-2024-003", category: "Finance" },
		performedBy: "Scholar",
		timestamp: "2024-05-20T13:35:00Z",
	},
	{
		id: "12",
		scholarId: "4",
		scholarName: "David Tan",
		studentId: "A0211234E",
		eventType: "ticket_submitted",
		description: "Ticket GEN-2024-012 submitted: Leave of absence documentation request.",
		metadata: { ticketId: "GEN-2024-012", category: "General Query" },
		performedBy: "Scholar",
		timestamp: "2024-06-01T10:00:00Z",
	},
	{
		id: "13",
		scholarId: "4",
		scholarName: "David Tan",
		studentId: "A0211234E",
		eventType: "ticket_submitted",
		description: "Ticket FIN-2024-009 submitted: Stipend suspension during leave period.",
		metadata: { ticketId: "FIN-2024-009", category: "Finance" },
		performedBy: "Scholar",
		timestamp: "2024-06-10T09:15:00Z",
	},
	{
		id: "14",
		scholarId: "5",
		scholarName: "Emily Chen",
		studentId: "A0198765F",
		eventType: "note_added",
		description: "HR note added: Scholar has completed bond service obligations for Year 1.",
		performedBy: "Sarah Williams",
		timestamp: "2024-06-15T15:00:00Z",
	},
	{
		id: "15",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "exchange_registered",
		description: "Internship placement registered at Google, Singapore.",
		metadata: { institution: "Google", country: "Singapore", type: "Internship" },
		performedBy: "Mark Johnson",
		timestamp: "2026-03-28T10:20:00Z",
	},
	{
		id: "16",
		scholarId: "2",
		scholarName: "Bob Smith",
		studentId: "A0234568C",
		eventType: "exchange_registered",
		description: "Internship placement registered at McKinsey & Company, Singapore.",
		metadata: { institution: "McKinsey & Company", country: "Singapore", type: "Internship" },
		performedBy: "Sarah Williams",
		timestamp: "2026-03-15T11:45:00Z",
	},
	{
		id: "17",
		scholarId: "3",
		scholarName: "Carol White",
		studentId: "A0234569D",
		eventType: "exchange_registered",
		description: "Exchange placement registered at University of Amsterdam, Netherlands.",
		metadata: {
			institution: "University of Amsterdam",
			country: "Netherlands",
			type: "Exchange",
		},
		performedBy: "Mark Johnson",
		timestamp: "2026-04-20T14:00:00Z",
	},
	{
		id: "18",
		scholarId: "2",
		scholarName: "Bob Smith",
		studentId: "A0234568C",
		eventType: "ticket_status_changed",
		description: "Ticket FIN-2024-003 moved from Open → In Review.",
		metadata: { ticketId: "FIN-2024-003", from: "Open", to: "In Review" },
		performedBy: "Sarah Williams",
		timestamp: "2026-05-22T09:00:00Z",
	},
	{
		id: "19",
		scholarId: "3",
		scholarName: "Carol White",
		studentId: "A0234569D",
		eventType: "profile_updated",
		description: "Preferred contact method updated to Email.",
		metadata: { field: "preferredContact", from: "SMS", to: "Email" },
		performedBy: "Scholar",
		timestamp: "2026-06-02T08:30:00Z",
	},
	{
		id: "20",
		scholarId: "1",
		scholarName: "Alice Johnson",
		studentId: "A0234567B",
		eventType: "note_added",
		description: "HR note added: Internship mid-point check-in scheduled for Week 6.",
		performedBy: "Mark Johnson",
		timestamp: "2026-06-10T16:00:00Z",
	},
];
