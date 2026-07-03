import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import { type FaqFormData, FAQ_CATEGORIES, faqCategoryConfig } from "../../types/Faq";
import PageShell from "../PageShell";

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
		"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
	const labelClass =
		"block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide";

	const cfg = faqCategoryConfig[form.category];

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
					? "Update the question and answer below, then save your changes."
					: "Add a new frequently asked question to the knowledge base for scholars."
			}
		>
			{/* Back nav */}
			<button
				onClick={() => navigate("/knowledge-base/faqs")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 transition-colors -mt-1"
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

			{/* Two-column layout */}
			<div className="grid grid-cols-5 gap-6 items-start">
				{/* Form — 3/5 */}
				<div className="col-span-3">
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
						<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
								{isEditing ? "Edit FAQ" : "FAQ Details"}
							</h2>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-5">
							{/* Category */}
							<div>
								<label className={labelClass}>Category</label>
								<div className="flex flex-wrap gap-2">
									{FAQ_CATEGORIES.map((c) => {
										const ccfg = faqCategoryConfig[c];
										const active = form.category === c;
										return (
											<button
												key={c}
												type="button"
												onClick={() =>
													setForm((prev) => ({ ...prev, category: c }))
												}
												className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
													active
														? `${ccfg.badge} border-current`
														: "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
												}`}
											>
												<span
													className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? ccfg.dot : "bg-zinc-300 dark:bg-zinc-600"}`}
												/>
												{c}
											</button>
										);
									})}
								</div>
							</div>

							{/* Question */}
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

							{/* Answer */}
							<div>
								<label className={labelClass}>Answer</label>
								<textarea
									value={form.answer}
									onChange={set("answer")}
									required
									rows={10}
									placeholder="Write a clear, concise answer..."
									className={`${inputClass} resize-none leading-relaxed`}
								/>
							</div>

							{/* Display Order */}
							<div>
								<label className={labelClass}>Display Order</label>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() =>
											setForm((prev) => ({
												...prev,
												order: Math.max(0, prev.order - 1),
											}))
										}
										className="w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M20 12H4"
											/>
										</svg>
									</button>
									<input
										type="number"
										min={0}
										value={form.order}
										onChange={set("order")}
										className="w-20 text-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
									/>
									<button
										type="button"
										onClick={() =>
											setForm((prev) => ({ ...prev, order: prev.order + 1 }))
										}
										className="w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</button>
									<p className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">
										Lower number appears first in the list.
									</p>
								</div>
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
									{submitting ? "Saving..." : isEditing ? "Save Changes" : "Publish FAQ"}
								</button>
								<button
									type="button"
									onClick={() => navigate("/knowledge-base/faqs")}
									className="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Preview + tips — 2/5 */}
				<div className="col-span-2 space-y-4 sticky top-6">
					{/* Live preview */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
						<div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
							<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
								Preview
							</p>
						</div>
						<div className={`border-l-4 ${cfg.border} m-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden`}>
							<div className="px-4 py-3.5">
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 min-w-0">
										<span
											className={`text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wide mb-2 inline-block ${cfg.badge}`}
										>
											{form.category}
										</span>
										<p className="text-sm font-semibold text-wise-ink dark:text-zinc-100 leading-snug">
											{form.question ? (
												form.question
											) : (
												<span className="text-zinc-300 dark:text-zinc-600 font-normal italic">
													Question will appear here...
												</span>
											)}
										</p>
									</div>
									<svg
										className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
							{form.answer && (
								<div className="px-4 pb-3.5 border-t border-zinc-200 dark:border-zinc-700 pt-3">
									<p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4">
										{form.answer}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Tips */}
					<div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
						<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
							Guidelines
						</p>
						<ul className="space-y-2.5">
							{[
								"Phrase questions exactly as a scholar would ask them.",
								"Keep answers concise — link to docs for long explanations.",
								"Use Display Order to control which FAQs appear first.",
								"Group related questions under the same category.",
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
