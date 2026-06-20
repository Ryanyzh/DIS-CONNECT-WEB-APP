import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import { type Announcement, categoryConfig } from "../../types/Announcement";

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

	return (
		<button
			onClick={onClick}
			className={`w-full text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-l-4 ${cfg.border} rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4`}
		>
			<div className="flex-1 min-w-0">
				<span
					className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wide mb-2 ${cfg.badge}`}
				>
					{announcement.category}
				</span>
				<p className="font-bold text-wise-ink dark:text-zinc-100 text-base leading-snug line-clamp-2 mb-2">
					{announcement.title}
				</p>
				<div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
					<span className="flex items-center gap-1">
						<svg
							className="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						{announcement.author}
					</span>
					<span className="flex items-center gap-1">
						<svg
							className="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						{formatted}
					</span>
				</div>
			</div>
			<svg
				className="w-5 h-5 text-zinc-400 flex-shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 5l7 7-7 7"
				/>
			</svg>
		</button>
	);
}

export function AllAnnouncementsPage() {
	const navigate = useNavigate();
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between border-b border-wise-ink/10 dark:border-zinc-700 pb-6">
				<div>
					<h1 className="mt-2 text-2xl font-semibold text-wise-ink dark:text-zinc-100">
						Announcements
					</h1>
					<p className="mt-1 text-sm text-wise-body dark:text-zinc-400">
						Manage announcements, view recent notices, and publish updates.
					</p>
				</div>
				<button
					onClick={() => navigate("/announcements/create")}
					className="flex items-center gap-2 bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					New Announcement
				</button>
			</div>

			{loading && (
				<div className="flex items-center justify-center py-16">
					<span className="text-zinc-400 text-sm">Loading...</span>
				</div>
			)}

			{error && <div className="text-rose-500 text-sm text-center py-8">{error}</div>}

			{!loading && !error && announcements.length === 0 && (
				<div className="text-zinc-400 text-sm text-center py-16">No announcements yet.</div>
			)}

			{!loading && !error && (
				<div className="flex flex-col gap-3">
					{announcements.map((a) => (
						<AnnouncementCard
							key={a.id}
							announcement={a}
							onClick={() => navigate(`/announcements/${a.id}`)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
