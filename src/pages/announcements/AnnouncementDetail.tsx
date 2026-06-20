import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type Announcement,
	categoryConfig,
	getInitials,
	readingTime,
} from "../../types/Announcement";

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

	return (
		<div className="max-w-2xl mx-auto">
			{/* Back button */}
			<button
				onClick={() => navigate("/announcements/all")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 mb-6 transition-colors"
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

			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 shadow-sm">
				{/* Category badge + edit button */}
				<div className="flex items-center justify-between mb-4">
					<span
						className={`text-xs font-semibold px-2.5 py-1 rounded border uppercase tracking-wide ${cfg.badge}`}
					>
						{announcement.category}
					</span>
					<button
						onClick={() => navigate(`/announcements/${id}/edit`)}
						className="text-xs text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
					>
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
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Edit
					</button>
				</div>

				{/* Title */}
				<h1 className="text-2xl font-bold text-wise-ink dark:text-zinc-100 leading-snug mb-5">
					{announcement.title}
				</h1>

				{/* Author row */}
				<div className="flex items-center gap-3 mb-5">
					<div
						className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${cfg.text} bg-current`}
						style={{ color: undefined }}
					>
						<div
							className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
							style={{
								background:
									announcement.category === "Event"
										? "#3b82f6"
										: announcement.category === "Deadline"
											? "#f43f5e"
											: announcement.category === "Result"
												? "#10b981"
												: announcement.category === "Maintenance"
													? "#71717a"
													: "#8b5cf6",
							}}
						>
							{initials}
						</div>
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-wise-ink dark:text-zinc-100 leading-none">
							{announcement.author}
						</p>
						<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
							{announcement.authorRole} · {formattedDate} · {readTime}
						</p>
					</div>
				</div>

				{/* Tags */}
				{announcement.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5 mb-5">
						{announcement.tags.map((tag) => (
							<span
								key={tag}
								className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-md border border-zinc-200 dark:border-zinc-700"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				<hr className="border-zinc-200 dark:border-zinc-700 mb-6" />

				{/* Body */}
				<p className="text-sm text-wise-ink dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
					{announcement.body}
				</p>
			</div>
		</div>
	);
}
