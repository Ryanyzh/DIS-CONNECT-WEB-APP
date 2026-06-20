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
		border: "border-l-blue-500",
		badge: "bg-blue-50 text-blue-700 border-blue-200",
		text: "text-blue-600",
	},
	Deadline: {
		border: "border-l-rose-500",
		badge: "bg-rose-50 text-rose-700 border-rose-200",
		text: "text-rose-600",
	},
	Result: {
		border: "border-l-emerald-500",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
		text: "text-emerald-600",
	},
	Maintenance: {
		border: "border-l-zinc-400",
		badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
		text: "text-zinc-500",
	},
	General: {
		border: "border-l-violet-500",
		badge: "bg-violet-50 text-violet-700 border-violet-200",
		text: "text-violet-600",
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
