import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type Announcement,
	type AnnouncementCategory,
	categoryConfig,
	getInitials,
	readingTime,
} from "../../types/Announcement";
import PageShell from "../PageShell";

const CATEGORY_FILTERS: (AnnouncementCategory | "All")[] = [
	"All",
	"Event",
	"Deadline",
	"Result",
	"Maintenance",
	"General",
];

const AVATAR_COLOR: Record<AnnouncementCategory, string> = {
	Event: "bg-blue-500",
	Deadline: "bg-rose-500",
	Result: "bg-emerald-500",
	Maintenance: "bg-zinc-500",
	General: "bg-violet-500",
};

function AnnouncementCard({
	announcement,
	onClick,
}: {
	announcement: Announcement;
	onClick: () => void;
}) {
	const cfg = categoryConfig[announcement.category];
	const date = new Date(announcement.date);
	const formatted = date.toLocaleDateString("en-SG", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
	const initials = getInitials(announcement.author);
	const readTime = readingTime(announcement.body);
	const avatarColor = AVATAR_COLOR[announcement.category];

	return (
		<button
			onClick={onClick}
			className={`w-full text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-l-4 ${cfg.border} rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition-all group`}
		>
			<div className="flex items-start justify-between gap-6">
				<div className="flex-1 min-w-0">
					{/* Category badge + date */}
					<div className="flex items-center gap-2.5 mb-2.5">
						<span
							className={`text-xs font-semibold px-2.5 py-0.5 rounded border uppercase tracking-wide ${cfg.badge}`}
						>
							{announcement.category}
						</span>
						<span className="text-xs text-zinc-400">{formatted}</span>
					</div>

					{/* Title */}
					<p className="font-bold text-wise-ink dark:text-zinc-100 text-base leading-snug mb-2 line-clamp-2">
						{announcement.title}
					</p>

					{/* Body preview */}
					<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
						{announcement.body}
					</p>

					{/* Author + meta */}
					<div className="flex items-center gap-2.5 flex-wrap">
						<div
							className={`w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
						>
							{initials}
						</div>
						<span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
							{announcement.author}
						</span>
						<span className="text-zinc-300 dark:text-zinc-600">·</span>
						<span className="text-xs text-zinc-400">{announcement.authorRole}</span>
						<span className="text-zinc-300 dark:text-zinc-600">·</span>
						<span className="text-xs text-zinc-400">{readTime}</span>
						{announcement.tags.slice(0, 2).map((tag) => (
							<span
								key={tag}
								className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-md"
							>
								{tag}
							</span>
						))}
					</div>
				</div>

				<svg
					className="w-5 h-5 text-zinc-300 dark:text-zinc-600 flex-shrink-0 mt-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</button>
	);
}

export function AllAnnouncementsPage() {
	const navigate = useNavigate();
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<AnnouncementCategory | "All">("All");

	const fetchAnnouncements = useCallback(() => {
		setLoading(true);
		apiFetch("/api/announcements")
			.then((res) => res.json())
			.then((data: Announcement[]) => setAnnouncements(data))
			.catch(() => setError("Failed to load announcements."))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

	const filtered =
		categoryFilter === "All"
			? announcements
			: announcements.filter((a) => a.category === categoryFilter);

	const counts = announcements.reduce<Record<string, number>>((acc, a) => {
		acc[a.category] = (acc[a.category] ?? 0) + 1;
		return acc;
	}, {});

	return (
		<PageShell
			description="Manage announcements, view recent notices, and publish updates."
			actions={
				<button
					onClick={() => navigate("/announcements/create")}
					className="flex items-center gap-1.5 bg-dc-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-dc-primary-hover transition-colors"
				>
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					New Announcement
				</button>
			}
		>
			{/* Category filter */}
			<div className="flex flex-wrap gap-2">
				{CATEGORY_FILTERS.map((cat) => {
					const active = categoryFilter === cat;
					const count = cat === "All" ? announcements.length : (counts[cat] ?? 0);
					return (
						<button
							key={cat}
							onClick={() => setCategoryFilter(cat)}
							className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
								active
									? "bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 border-wise-ink dark:border-zinc-100"
									: "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
							}`}
						>
							{cat}
							<span className={active ? "opacity-60" : "text-zinc-400"}>{count}</span>
						</button>
					);
				})}
			</div>

			{loading && (
				<div className="flex items-center justify-center py-16">
					<span className="text-zinc-400 text-sm">Loading...</span>
				</div>
			)}

			{error && <div className="text-rose-500 text-sm text-center py-8">{error}</div>}

			{!loading && !error && filtered.length === 0 && (
				<div className="text-zinc-400 text-sm text-center py-16">No announcements yet.</div>
			)}

			{!loading && !error && filtered.length > 0 && (
				<div className="flex flex-col gap-3">
					{filtered.map((a) => (
						<AnnouncementCard
							key={a.id}
							announcement={a}
							onClick={() => navigate(`/announcements/${a.id}`)}
						/>
					))}
				</div>
			)}
		</PageShell>
	);
}
