import type { TicketStatus, TicketCategory } from "../components/tickets/TicketCard";

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

export const MOCK_SCHOLARS: Scholar[] = [
	{
		id: "1",
		name: "Alice Johnson",
		email: "alice@u.nus.edu",
		studentId: "A0234567B",
		faculty: "School of Computing",
		program: "Computer Science",
		yearOfStudy: "3",
		phone: "+65 9123 4567",
		preferredContact: "Email",
		scholarshipType: "ASEAN Undergraduate Scholarship",
		status: "Active",
		createdAt: "2022-08-01",
		exchange: {
			university: "ETH Zürich",
			country: "Switzerland",
			startDate: "2024-02-01",
			endDate: "2024-06-30",
			status: "Completed",
		},
		tickets: [
			{
				id: "EXC-2024-001",
				title: "Exchange housing reimbursement claim",
				category: "Reimbursement",
				status: "Resolved",
				priority: 3,
				createdAt: "2024-03-10",
				lastUpdated: "2024-04-02",
			},
			{
				id: "POL-2024-007",
				title: "Clarification on bond obligation terms",
				category: "Policy",
				status: "Closed",
				priority: 2,
				createdAt: "2024-05-15",
				lastUpdated: "2024-05-28",
			},
		],
	},
	{
		id: "2",
		name: "Bob Smith",
		email: "bob@u.nus.edu",
		studentId: "A0234568C",
		faculty: "NUS Business School",
		program: "Business Administration",
		yearOfStudy: "2",
		phone: "+65 9234 5678",
		preferredContact: "Phone",
		scholarshipType: "NUS Merit Scholarship",
		status: "Active",
		createdAt: "2023-08-01",
		tickets: [
			{
				id: "FIN-2024-003",
				title: "Allowance disbursement delay — May 2024",
				category: "Scholarship",
				status: "In Review",
				priority: 4,
				createdAt: "2024-05-20",
				lastUpdated: "2024-05-22",
			},
		],
	},
	{
		id: "3",
		name: "Carol White",
		email: "carol@u.nus.edu",
		studentId: "A0234569D",
		faculty: "College of Humanities & Sciences",
		program: "Psychology",
		yearOfStudy: "1",
		phone: "+65 9345 6789",
		preferredContact: "Email",
		scholarshipType: "Science & Technology Undergraduate Scholarship",
		status: "Active",
		createdAt: "2024-08-01",
		tickets: [],
	},
	{
		id: "4",
		name: "David Tan",
		email: "david@u.nus.edu",
		studentId: "A0211234E",
		faculty: "College of Design & Engineering",
		program: "Mechanical Engineering",
		yearOfStudy: "4",
		phone: "+65 9456 7890",
		preferredContact: "SMS",
		scholarshipType: "ASEAN Undergraduate Scholarship",
		status: "On Leave",
		createdAt: "2021-08-01",
		tickets: [
			{
				id: "GEN-2024-012",
				title: "Leave of absence documentation request",
				category: "Leave",
				status: "Waiting",
				priority: 3,
				createdAt: "2024-06-01",
				lastUpdated: "2024-06-05",
			},
			{
				id: "FIN-2024-009",
				title: "Stipend suspension during leave period",
				category: "Leave",
				status: "Open",
				priority: 3,
				createdAt: "2024-06-10",
				lastUpdated: "2024-06-10",
			},
		],
	},
	{
		id: "5",
		name: "Emily Chen",
		email: "emily@u.nus.edu",
		studentId: "A0198765F",
		faculty: "Yong Loo Lin School of Medicine",
		program: "Medicine",
		yearOfStudy: "5",
		phone: "+65 9567 8901",
		preferredContact: "Email",
		scholarshipType: "NUS Medicine Scholarship",
		status: "Graduated",
		createdAt: "2019-08-01",
		tickets: [
			{
				id: "POL-2023-044",
				title: "Post-graduation bond service query",
				category: "Policy",
				status: "Resolved",
				priority: 2,
				createdAt: "2023-11-10",
				lastUpdated: "2023-12-01",
			},
		],
	},
];
