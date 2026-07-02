import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type AnnouncementCategory,
	type AnnouncementFormData,
	categoryConfig,
} from "../../types/Announcement";
import PageShell from "../PageShell";

const CATEGORIES: AnnouncementCategory[] = [
	"Event",
	"Deadline",
	"Result",
	"Maintenance",
	"General",
];

const EMPTY_FORM: AnnouncementFormData = {
	title: "",
	author: "",
	authorRole: "",
	category: "General",
	tags: "",
	body: "",
};

export function CreateAnnouncementPage() {
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const [form, setForm] = useState<AnnouncementFormData>(EMPTY_FORM);
	const [loading, setLoading] = useState(isEditing);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isEditing) return;
		apiFetch(`/api/announcements/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setForm({
					title: data.title,
					author: data.author,
					authorRole: data.authorRole,
					category: data.category,
					tags: (data.tags as string[]).join(", "),
					body: data.body,
				});
			})
			.catch(() => setError("Failed to load announcement."))
			.finally(() => setLoading(false));
	}, [id, isEditing]);

	const set =
		(field: keyof AnnouncementFormData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
			setForm((prev) => ({ ...prev, [field]: e.target.value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		const payload = {
			...form,
			tags: form.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
		};

		try {
			const res = await apiFetch(
				isEditing ? `/api/announcements/${id}` : "/api/announcements",
				{
					method: isEditing ? "PATCH" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);

			if (!res.ok) throw new Error("Request failed");
			const saved = await res.json();
			navigate(`/announcements/${saved.id}`);
		} catch {
			setError("Failed to save announcement. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const inputClass =
		"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
	const labelClass =
		"block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide";

	const cfg = categoryConfig[form.category];
	const previewTags = form.tags
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<span className="text-zinc-400 text-sm">Loading...</span>
			</div>
		);
	}

	return (
		<PageShell
			description={
				isEditing
					? "Update the details below and republish the announcement."
					: "Fill in the details below to create a new announcement for all scholars."
			}
		>
			{/* Back nav */}
			<button
				onClick={() => navigate("/announcements/all")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 transition-colors -mt-1"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
				</svg>
				All Announcements
			</button>

			{/* Two-column layout */}
			<div className="grid grid-cols-5 gap-6 items-start">
				{/* Form — 3/5 */}
				<div className="col-span-3">
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
						<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
								{isEditing ? "Edit Announcement" : "Announcement Details"}
							</h2>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-5">
							{/* Title */}
							<div>
								<label className={labelClass}>Title</label>
								<input
									type="text"
									value={form.title}
									onChange={set("title")}
									required
									placeholder="e.g. Exchange Programme Application Now Open"
									className={inputClass}
								/>
							</div>

							{/* Category */}
							<div>
								<label className={labelClass}>Category</label>
								<div className="flex flex-wrap gap-2">
									{CATEGORIES.map((c) => {
										const ccfg = categoryConfig[c];
										const active = form.category === c;
										return (
											<button
												key={c}
												type="button"
												onClick={() => setForm((prev) => ({ ...prev, category: c }))}
												className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
													active
														? `${ccfg.badge} border-current`
														: "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
												}`}
											>
												{c}
											</button>
										);
									})}
								</div>
							</div>

							{/* Author + Role */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className={labelClass}>Author</label>
									<input
										type="text"
										value={form.author}
										onChange={set("author")}
										required
										placeholder="e.g. Ms. Rachel Tan"
										className={inputClass}
									/>
								</div>
								<div>
									<label className={labelClass}>Author Role</label>
									<input
										type="text"
										value={form.authorRole}
										onChange={set("authorRole")}
										required
										placeholder="e.g. Exchange Programme Coordinator"
										className={inputClass}
									/>
								</div>
							</div>

							{/* Tags */}
							<div>
								<label className={labelClass}>Tags</label>
								<input
									type="text"
									value={form.tags}
									onChange={set("tags")}
									placeholder="e.g. Exchange, Mandatory, May 2025 (comma-separated)"
									className={inputClass}
								/>
								{previewTags.length > 0 && (
									<div className="flex flex-wrap gap-1.5 mt-2">
										{previewTags.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-md"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>

							{/* Body */}
							<div>
								<label className={labelClass}>Body</label>
								<textarea
									value={form.body}
									onChange={set("body")}
									required
									rows={16}
									placeholder="Write the full announcement content here..."
									className={`${inputClass} resize-none leading-relaxed`}
								/>
							</div>

							{error && (
								<div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2.5">
									<svg
										className="w-4 h-4 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
											clipRule="evenodd"
										/>
									</svg>
									{error}
								</div>
							)}

							<div className="flex gap-3 pt-1">
								<button
									type="submit"
									disabled={submitting}
									className="flex-1 bg-dc-primary hover:bg-dc-primary-hover text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submitting
										? "Saving..."
										: isEditing
											? "Save Changes"
											: "Publish Announcement"}
								</button>
								<button
									type="button"
									onClick={() => navigate("/announcements/all")}
									className="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Preview + guidelines — 2/5 */}
				<div className="col-span-2 space-y-4 sticky top-6">
					{/* Live preview */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
						<div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
							<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
								Preview
							</p>
						</div>
						<div className={`border-l-4 ${cfg.border} m-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4`}>
							<div className="flex items-center gap-2 mb-2.5">
								<span
									className={`text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${cfg.badge}`}
								>
									{form.category}
								</span>
								<span className="text-xs text-zinc-400">Today</span>
							</div>
							<p className="font-bold text-wise-ink dark:text-zinc-100 text-sm leading-snug mb-2 line-clamp-3 min-h-[1.25rem]">
								{form.title ? (
									form.title
								) : (
									<span className="text-zinc-300 dark:text-zinc-600 font-normal italic">
										Announcement title...
									</span>
								)}
							</p>
							{form.body && (
								<p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-3">
									{form.body}
								</p>
							)}
							{(form.author || form.authorRole) && (
								<p className="text-xs text-zinc-400">
									{form.author}
									{form.author && form.authorRole && " · "}
									{form.authorRole}
								</p>
							)}
							{previewTags.length > 0 && (
								<div className="flex flex-wrap gap-1 mt-2">
									{previewTags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Guidelines */}
					<div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
						<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
							Guidelines
						</p>
						<ul className="space-y-2.5">
							{[
								"Keep the title concise and action-oriented.",
								"State deadlines or dates clearly in the body.",
								"Use tags to help scholars filter relevant announcements.",
								"Proofread before publishing — edits are possible but visible.",
							].map((tip) => (
								<li
									key={tip}
									className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400"
								>
									<span className="w-1 h-1 rounded-full bg-zinc-400 flex-shrink-0 mt-1.5" />
									{tip}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</PageShell>
	);
}
