export type AnnouncementCategory = "Event" | "Deadline" | "Result" | "Maintenance" | "General";

export interface Announcement {
	id: string;
	title: string;
	date: string; // ISO 8601
	author: string;
	authorRole: string;
	category: AnnouncementCategory;
	tags: string[];
	body: string;
}

export interface AnnouncementFormData {
	title: string;
	author: string;
	authorRole: string;
	category: AnnouncementCategory;
	tags: string; // comma-separated string in the form
	body: string;
}

export const categoryConfig: Record<
	AnnouncementCategory,
	{ border: string; badge: string; text: string }
> = {
	Event: {
		border: "border-l-blue-500 dark:border-l-blue-400",
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
		text: "text-blue-600 dark:text-blue-400",
	},
	Deadline: {
		border: "border-l-rose-500 dark:border-l-rose-400",
		badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
		text: "text-rose-600 dark:text-rose-400",
	},
	Result: {
		border: "border-l-emerald-500 dark:border-l-emerald-400",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
		text: "text-emerald-600 dark:text-emerald-400",
	},
	Maintenance: {
		border: "border-l-zinc-400 dark:border-l-zinc-500",
		badge: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
		text: "text-zinc-500 dark:text-zinc-400",
	},
	General: {
		border: "border-l-violet-500 dark:border-l-violet-400",
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
		text: "text-violet-600 dark:text-violet-400",
	},
};

export function readingTime(body: string): string {
	const words = body.trim().split(/\s+/).length;
	const minutes = Math.max(1, Math.round(words / 200));
	return `${minutes} min read`;
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}
