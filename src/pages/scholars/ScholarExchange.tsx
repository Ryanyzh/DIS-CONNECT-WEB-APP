import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type ExchangePlacement,
	type PlacementType,
	type PlacementStatus,
	MOCK_PLACEMENTS,
} from "../../types/ExchangePlacement";

type TypeFilter = PlacementType | "All";
type StatusFilter = PlacementStatus | "All";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
	return (
		<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 shadow-sm">
			<p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
				{label}
			</p>
			<p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
		</div>
	);
}

export function ScholarExchangePage() {
	const navigate = useNavigate();
	const [placements, setPlacements] = useState<ExchangePlacement[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

	const fetchPlacements = useCallback(() => {
		setLoading(true);
		setError(null);
		apiFetch("/api/v1/scholars/exchange")
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((data: ExchangePlacement[]) => setPlacements(data))
			.catch(() => {
				// Backend not ready — fall back to mock data
				setPlacements(MOCK_PLACEMENTS);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchPlacements();
	}, [fetchPlacements]);

	const handleDelete = async (placement: ExchangePlacement) => {
		if (
			!confirm(
				`Remove ${placement.type.toLowerCase()} placement for ${placement.scholarName} at ${placement.hostInstitution}?`
			)
		)
			return;
		setDeletingId(placement.id);
		try {
			const res = await apiFetch(`/api/v1/scholars/exchange/${placement.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error();
			setPlacements((prev) => prev.filter((p) => p.id !== placement.id));
		} catch {
			// Optimistic remove for mock data
			setPlacements((prev) => prev.filter((p) => p.id !== placement.id));
		} finally {
			setDeletingId(null);
		}
	};

	const filtered = placements.filter((p) => {
		const matchSearch =
			p.scholarName.toLowerCase().includes(search.toLowerCase()) ||
			p.studentId.toLowerCase().includes(search.toLowerCase()) ||
			p.hostInstitution.toLowerCase().includes(search.toLowerCase()) ||
			p.country.toLowerCase().includes(search.toLowerCase());
		const matchType = typeFilter === "All" || p.type === typeFilter;
		const matchStatus = statusFilter === "All" || p.status === statusFilter;
		return matchSearch && matchType && matchStatus;
	});

	const stats = {
		total: placements.length,
		ongoing: placements.filter((p) => p.status === "Ongoing").length,
		upcoming: placements.filter((p) => p.status === "Upcoming").length,
		completed: placements.filter((p) => p.status === "Completed").length,
		exchange: placements.filter((p) => p.type === "Exchange").length,
		internship: placements.filter((p) => p.type === "Internship").length,
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-wise-ink/10 dark:border-zinc-700 pb-6">
				<div>
					<h1 className="mt-2 text-2xl font-semibold text-wise-ink dark:text-zinc-100">
						Exchange & Internship Tracking
					</h1>
					<p className="mt-1 text-sm text-wise-body dark:text-zinc-400">
						Track all scholar exchange placements and internship postings.
					</p>
				</div>
				<button
					onClick={() => navigate("/scholars/exchange/create")}
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
					Add Placement
				</button>
			</div>

			{/* Table */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<span className="text-zinc-400 text-sm">Loading…</span>
					</div>
				) : error ? (
					<div className="text-rose-500 text-sm text-center py-10">{error}</div>
				) : filtered.length === 0 ? (
					<div className="text-zinc-400 text-sm text-center py-16">
						No placements match your filters.
					</div>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
								{[
									"Scholar",
									"Type",
									"Host Institution",
									"Duration",
									"Credits / Supervisor",
									"Status",
									"",
								].map((h) => (
									<th
										key={h}
										className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide whitespace-nowrap"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map((p) => (
								<tr
									key={p.id}
									className={
										deletingId === p.id ? "opacity-40 pointer-events-none" : ""
									}
								>
									<PlacementRow
										placement={p}
										onEdit={() => navigate(`/scholars/exchange/${p.id}/edit`)}
										onDelete={() => handleDelete(p)}
									/>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
