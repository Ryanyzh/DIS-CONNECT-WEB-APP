import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type Announcement,
	categoryConfig,
	getInitials,
	readingTime,
} from "../../types/Announcement";
import PageShell from "../PageShell";

const AVATAR_COLOR: Record<string, string> = {
	Event: "bg-blue-500",
	Deadline: "bg-rose-500",
	Result: "bg-emerald-500",
	Maintenance: "bg-zinc-500",
	General: "bg-violet-500",
};

export function AnnouncementDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [announcement, setAnnouncement] = useState<Announcement | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch(`/api/announcements/${id}`)
			.then((res) => {
				if (!res.ok) throw new Error("Not found");
				return res.json();
			})
			.then((data: Announcement) => setAnnouncement(data))
			.catch(() => setError("Announcement not found."))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<span className="text-zinc-400 text-sm">Loading...</span>
			</div>
		);
	}

	if (error || !announcement) {
		return (
			<div className="text-center py-24">
				<p className="text-zinc-400 text-sm mb-4">{error ?? "Something went wrong."}</p>
				<button
					onClick={() => navigate("/announcements/all")}
					className="text-sm text-wise-ink dark:text-zinc-300 underline"
				>
					Back to announcements
				</button>
			</div>
		);
	}

	const cfg = categoryConfig[announcement.category];
	const date = new Date(announcement.date);
	const formattedDate = date.toLocaleDateString("en-SG", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
	const initials = getInitials(announcement.author);
	const readTime = readingTime(announcement.body);
	const avatarColor = AVATAR_COLOR[announcement.category] ?? "bg-zinc-500";

	return (
		<PageShell>
			{/* Back nav */}
			<button
				onClick={() => navigate("/announcements/all")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 transition-colors"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				All Announcements
			</button>

			{/* Two-column layout */}
			<div className="grid grid-cols-5 gap-6 items-start">
				{/* Article — 3/5 */}
				<div className="col-span-3">
					<div
						className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-l-4 ${cfg.border} rounded-xl shadow-sm p-8`}
					>
						{/* Category badge */}
						<span
							className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border uppercase tracking-wide mb-5 ${cfg.badge}`}
						>
							{announcement.category}
						</span>

						{/* Title */}
						<h1 className="text-2xl font-bold text-wise-ink dark:text-zinc-100 leading-tight mb-6">
							{announcement.title}
						</h1>

						<hr className="border-zinc-100 dark:border-zinc-800 mb-6" />

						{/* Body */}
						<p className="text-sm text-wise-ink dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
							{announcement.body}
						</p>
					</div>
				</div>

				{/* Sidebar — 2/5 */}
				<div className="col-span-2 space-y-4 sticky top-6">
					{/* Author */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-5">
						<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
							Author
						</p>
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
							>
								{initials}
							</div>
							<div>
								<p className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
									{announcement.author}
								</p>
								<p className="text-xs text-zinc-400">{announcement.authorRole}</p>
							</div>
						</div>
					</div>

					{/* Details */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-5 space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
							Details
						</p>
						<div className="flex items-start gap-2.5">
							<svg
								className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0"
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
							<div>
								<p className="text-xs text-zinc-400">Published</p>
								<p className="text-xs font-medium text-wise-ink dark:text-zinc-200 mt-0.5">
									{formattedDate}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-2.5">
							<svg
								className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div>
								<p className="text-xs text-zinc-400">Reading time</p>
								<p className="text-xs font-medium text-wise-ink dark:text-zinc-200 mt-0.5">
									{readTime}
								</p>
							</div>
						</div>
					</div>

					{/* Tags */}
					{announcement.tags.length > 0 && (
						<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-5">
							<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
								Tags
							</p>
							<div className="flex flex-wrap gap-1.5">
								{announcement.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-md"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Edit action */}
					<button
						onClick={() => navigate(`/announcements/${id}/edit`)}
						className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Edit Announcement
					</button>
				</div>
			</div>
		</PageShell>
	);
}
