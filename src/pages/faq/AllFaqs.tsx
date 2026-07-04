import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import { type Faq, type FaqCategory, FAQ_CATEGORIES, faqCategoryConfig } from "../../types/Faq";
import PageShell from "../PageShell";

function FaqItem({
	faq,
	onEdit,
	onDelete,
}: {
	faq: Faq;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [open, setOpen] = useState(false);
	const cfg = faqCategoryConfig[faq.category];

	return (
		<div
			className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-l-4 ${cfg.border} rounded-xl shadow-sm overflow-hidden`}
		>
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
			>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1.5">
						<span
							className={`text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${cfg.badge}`}
						>
							{faq.category}
						</span>
					</div>
					<span className="font-semibold text-wise-ink dark:text-zinc-100 text-sm leading-snug">
						{faq.question}
					</span>
				</div>
				<svg
					className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 mt-1 ${open ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{open && (
				<div className="border-t border-zinc-100 dark:border-zinc-800">
					<div className="px-5 py-4">
						<p className="text-sm text-wise-body dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
							{faq.answer}
						</p>
					</div>
					<div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
						<span className="text-xs text-zinc-400">Order #{faq.order}</span>
						<div className="flex items-center gap-4">
							<button
								onClick={onEdit}
								className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-wise-ink dark:hover:text-zinc-100 transition-colors"
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
							<button
								onClick={onDelete}
								className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function AllFaqsPage() {
	const navigate = useNavigate();
	const [faqs, setFaqs] = useState<Faq[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState<FaqCategory | "All">("All");

	const fetchFaqs = useCallback(() => {
		setLoading(true);
		apiFetch("/api/faqs")
			.then((res) => res.json())
			.then((data: Faq[]) => setFaqs(data))
			.catch(() => setError("Failed to load FAQs."))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchFaqs();
	}, [fetchFaqs]);

	const handleDelete = async (faq: Faq) => {
		if (!confirm(`Delete "${faq.question}"? This cannot be undone.`)) return;
		setDeletingId(faq.id);
		try {
			const res = await apiFetch(`/api/faqs/${faq.id}`, { method: "DELETE" });
			if (!res.ok) throw new Error();
			setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
		} catch {
			alert("Failed to delete FAQ. Please try again.");
		} finally {
			setDeletingId(null);
		}
	};

	const displayed =
		activeCategory === "All" ? faqs : faqs.filter((f) => f.category === activeCategory);

	const grouped = FAQ_CATEGORIES.reduce<Record<FaqCategory, Faq[]>>(
		(acc, cat) => {
			acc[cat] = displayed
				.filter((f) => f.category === cat)
				.sort((a, b) => a.order - b.order);
			return acc;
		},
		{} as Record<FaqCategory, Faq[]>
	);

	return (
		<PageShell
			description="Manage frequently asked questions visible to scholars."
			actions={
				<button
					onClick={() => navigate("/knowledge-base/faqs/create")}
					className="flex items-center gap-1.5 btn-gradient text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
				>
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					New FAQ
				</button>
			}
		>
			{/* Category filter */}
			<div className="flex flex-wrap gap-2">
				{(["All", ...FAQ_CATEGORIES] as const).map((cat) => {
					const active = activeCategory === cat;
					const count = cat === "All" ? faqs.length : faqs.filter((f) => f.category === cat).length;
					return (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
								active
									? "bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 border-wise-ink dark:border-zinc-100"
									: "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
							}`}
						>
							{cat !== "All" && (
								<span
									className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
										active
											? "bg-wise-canvas dark:bg-zinc-900"
											: faqCategoryConfig[cat as FaqCategory].dot
									}`}
								/>
							)}
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

			{!loading && !error && displayed.length === 0 && (
				<div className="text-zinc-400 text-sm text-center py-16">No FAQs yet.</div>
			)}

			{!loading && !error && displayed.length > 0 && (
				<div className="space-y-8">
					{FAQ_CATEGORIES.filter((cat) => grouped[cat].length > 0).map((cat) => {
						if (activeCategory !== "All" && activeCategory !== cat) return null;
						const cfg = faqCategoryConfig[cat];
						return (
							<div key={cat}>
								<div className="flex items-center gap-2 mb-3">
									<span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
									<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
										{cat}
									</h2>
									<span className="text-xs text-zinc-400 dark:text-zinc-500">
										({grouped[cat].length})
									</span>
								</div>
								<div className="flex flex-col gap-2">
									{grouped[cat].map((faq) => (
										<div
											key={faq.id}
											className={
												deletingId === faq.id ? "opacity-50 pointer-events-none" : ""
											}
										>
											<FaqItem
												faq={faq}
												onEdit={() =>
													navigate(`/knowledge-base/faqs/${faq.id}/edit`)
												}
												onDelete={() => handleDelete(faq)}
											/>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</PageShell>
	);
}
