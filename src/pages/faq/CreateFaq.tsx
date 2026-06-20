import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import { type FaqFormData, FAQ_CATEGORIES } from "../../types/Faq";

const EMPTY_FORM: FaqFormData = {
	question: "",
	answer: "",
	category: "General",
	order: 0,
};

export function CreateFaqPage() {
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const [form, setForm] = useState<FaqFormData>(EMPTY_FORM);
	const [loading, setLoading] = useState(isEditing);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isEditing) return;
		apiFetch(`/api/faqs/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setForm({
					question: data.question,
					answer: data.answer,
					category: data.category,
					order: data.order,
				});
			})
			.catch(() => setError("Failed to load FAQ."))
			.finally(() => setLoading(false));
	}, [id, isEditing]);

	const set =
		(field: keyof FaqFormData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
			setForm((prev) => ({
				...prev,
				[field]: field === "order" ? Number(e.target.value) : e.target.value,
			}));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			const res = await apiFetch(isEditing ? `/api/faqs/${id}` : "/api/faqs", {
				method: isEditing ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) throw new Error("Request failed");
			navigate("/knowledge-base/faqs");
		} catch {
			setError("Failed to save FAQ. Please try again.");
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
			<button
				onClick={() => navigate("/knowledge-base/faqs")}
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
				FAQ Articles
			</button>

			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 shadow-sm">
				<h1 className="text-xl font-bold text-wise-ink dark:text-zinc-100 mb-6">
					{isEditing ? "Edit FAQ" : "New FAQ"}
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div>
						<label className={labelClass}>Question</label>
						<input
							type="text"
							value={form.question}
							onChange={set("question")}
							required
							placeholder="e.g. How do I submit a new ticket?"
							className={inputClass}
						/>
					</div>

					<div>
						<label className={labelClass}>Answer</label>
						<textarea
							value={form.answer}
							onChange={set("answer")}
							required
							rows={8}
							placeholder="Write a clear, concise answer..."
							className={`${inputClass} resize-none leading-relaxed`}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Category</label>
							<select
								value={form.category}
								onChange={set("category")}
								className={inputClass}
							>
								{FAQ_CATEGORIES.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className={labelClass}>Display Order</label>
							<input
								type="number"
								min={0}
								value={form.order}
								onChange={set("order")}
								className={inputClass}
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Lower number appears first.
							</p>
						</div>
					</div>

					{error && <p className="text-rose-500 text-xs">{error}</p>}

					<div className="flex gap-3 pt-1">
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 font-semibold rounded-lg py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Saving..." : isEditing ? "Save Changes" : "Publish FAQ"}
						</button>
						<button
							type="button"
							onClick={() => navigate("/knowledge-base/faqs")}
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
