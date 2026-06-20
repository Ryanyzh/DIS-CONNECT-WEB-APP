import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import { type AnnouncementCategory, type AnnouncementFormData } from "../../types/Announcement";

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
		"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
	const labelClass = "block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1";

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<span className="text-zinc-400 text-sm">Loading...</span>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			{/* Header */}
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
				<h1 className="text-xl font-bold text-wise-ink dark:text-zinc-100 mb-6">
					{isEditing ? "Edit Announcement" : "New Announcement"}
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{/* Title */}
					<div>
						<label className={labelClass}>Title</label>
						<input
							type="text"
							value={form.title}
							onChange={set("title")}
							required
							placeholder="Announcement title"
							className={inputClass}
						/>
					</div>

					{/* Category */}
					<div>
						<label className={labelClass}>Category</label>
						<select
							value={form.category}
							onChange={set("category")}
							className={inputClass}
						>
							{CATEGORIES.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
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
						<label className={labelClass}>Tags (comma-separated)</label>
						<input
							type="text"
							value={form.tags}
							onChange={set("tags")}
							placeholder="e.g. Exchange, Mandatory, May 2024"
							className={inputClass}
						/>
					</div>

					{/* Body */}
					<div>
						<label className={labelClass}>Body</label>
						<textarea
							value={form.body}
							onChange={set("body")}
							required
							rows={14}
							placeholder="Write the full announcement here..."
							className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
						/>
					</div>

					{error && <p className="text-rose-500 text-xs">{error}</p>}

					<div className="flex gap-3 pt-1">
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 font-semibold rounded-lg py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
							className="px-4 py-2 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
