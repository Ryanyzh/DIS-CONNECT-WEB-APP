export type PlacementType = "Exchange" | "Internship";
export type PlacementStatus = "Upcoming" | "Ongoing" | "Completed" | "Cancelled";

export interface ExchangePlacement {
	id: string;
	type: PlacementType;
	// Scholar
	scholarId: string;
	scholarName: string;
	studentId: string;
	faculty: string;
	// Placement
	hostInstitution: string;
	country: string;
	city: string;
	startDate: string; // ISO date
	endDate: string; // ISO date
	status: PlacementStatus;
	// Exchange-specific
	academicCredits?: number;
	// Internship-specific
	department?: string;
	supervisorName?: string;
	// Common
	notes?: string;
	createdAt: string;
}

export interface ExchangePlacementFormData {
	type: PlacementType;
	scholarId: string;
	hostInstitution: string;
	country: string;
	city: string;
	startDate: string;
	endDate: string;
	status: PlacementStatus;
	academicCredits: string; // string in form, parsed to number on submit
	department: string;
	supervisorName: string;
	notes: string;
}

export const PLACEMENT_STATUSES: PlacementStatus[] = [
	"Upcoming",
	"Ongoing",
	"Completed",
	"Cancelled",
];

export const placementStatusConfig: Record<PlacementStatus, { badge: string; dot: string }> = {
	Upcoming: {
		badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
		dot: "bg-amber-500",
	},
	Ongoing: {
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
		dot: "bg-emerald-500",
	},
	Completed: {
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
		dot: "bg-blue-500",
	},
	Cancelled: {
		badge: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
		dot: "bg-zinc-400",
	},
};

export const placementTypeConfig: Record<PlacementType, { badge: string }> = {
	Exchange: {
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
	},
	Internship: {
		badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
	},
};
