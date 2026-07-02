export type FaqCategory = "General" | "Tickets" | "Account" | "Notifications" | "Files";

export interface Faq {
	id: string;
	question: string;
	answer: string;
	category: FaqCategory;
	order: number;
	createdAt: string; // ISO 8601
	updatedAt: string; // ISO 8601
}

export interface FaqFormData {
	question: string;
	answer: string;
	category: FaqCategory;
	order: number;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
	"General",
	"Tickets",
	"Account",
	"Notifications",
	"Files",
];

export const faqCategoryConfig: Record<
	FaqCategory,
	{ border: string; badge: string; dot: string }
> = {
	General: {
		border: "border-l-violet-500 dark:border-l-violet-400",
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
		dot: "bg-violet-500 dark:bg-violet-400",
	},
	Tickets: {
		border: "border-l-blue-500 dark:border-l-blue-400",
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
		dot: "bg-blue-500 dark:bg-blue-400",
	},
	Account: {
		border: "border-l-amber-500 dark:border-l-amber-400",
		badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
		dot: "bg-amber-500 dark:bg-amber-400",
	},
	Notifications: {
		border: "border-l-emerald-500 dark:border-l-emerald-400",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
		dot: "bg-emerald-500 dark:bg-emerald-400",
	},
	Files: {
		border: "border-l-zinc-400 dark:border-l-zinc-500",
		badge: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
		dot: "bg-zinc-400 dark:bg-zinc-500",
	},
};
