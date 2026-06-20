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
		border: "border-l-violet-500",
		badge: "bg-violet-50 text-violet-700 border-violet-200",
		dot: "bg-violet-500",
	},
	Tickets: {
		border: "border-l-blue-500",
		badge: "bg-blue-50 text-blue-700 border-blue-200",
		dot: "bg-blue-500",
	},
	Account: {
		border: "border-l-amber-500",
		badge: "bg-amber-50 text-amber-700 border-amber-200",
		dot: "bg-amber-500",
	},
	Notifications: {
		border: "border-l-emerald-500",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
		dot: "bg-emerald-500",
	},
	Files: {
		border: "border-l-zinc-400",
		badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
		dot: "bg-zinc-400",
	},
};
