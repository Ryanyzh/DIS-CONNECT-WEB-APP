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

