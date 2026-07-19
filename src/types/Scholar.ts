import type { TicketStatus, TicketCategory } from "../components/TicketCard";

export type ScholarStatus = "Active" | "On Leave" | "Graduated" | "Inactive";

export interface ScholarExchange {
	university: string;
	country: string;
	startDate: string;
	endDate: string;
	status: "Upcoming" | "Ongoing" | "Completed";
}

export interface ScholarTicket {
	id: string;
	title: string;
	category: TicketCategory;
	status: TicketStatus;
	priority: number;
	createdAt: string;
	lastUpdated: string;
}

export interface Scholar {
	id: string;
	name: string;
	email: string;
	studentId: string;
	faculty: string;
	program: string;
	yearOfStudy: string;
	phone: string;
	preferredContact: "Email" | "Phone" | "SMS";
	scholarshipType: string;
	status: ScholarStatus;
	createdAt: string;
	exchange?: ScholarExchange;
	tickets: ScholarTicket[];
}

export const scholarStatusConfig: Record<ScholarStatus, { badge: string; dot: string }> = {
	Active: {
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
		dot: "bg-emerald-500 dark:bg-emerald-400",
	},
	"On Leave": {
		badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
		dot: "bg-amber-500 dark:bg-amber-400",
	},
	Graduated: {
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
		dot: "bg-blue-500 dark:bg-blue-400",
	},
	Inactive: {
		badge: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
		dot: "bg-zinc-400 dark:bg-zinc-500",
	},
};

export const ticketStatusConfig: Record<TicketStatus, { badge: string }> = {
	Open: {
		badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
	},
	"In Review": {
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
	},
	Waiting: {
		badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
	},
	Resolved: {
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
	},
	Closed: {
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
	},
	Escalated: {
		badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
	},
};

export const ticketCategoryConfig: Record<TicketCategory, string> = {
	Reimbursement: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
	Exchange: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
	Policy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
	Internship: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
	Leave: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
	Scholarship: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
};

export function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function formatDate(iso: string | null) {
	return iso
		? new Date(iso).toLocaleDateString("en-SG", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "";
}

