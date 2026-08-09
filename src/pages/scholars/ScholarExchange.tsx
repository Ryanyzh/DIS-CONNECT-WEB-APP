import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../PageShell";
import { apiFetch } from "../../lib/apiFetch";
import {
	type ExchangePlacement,
	type PlacementType,
	type PlacementStatus,
	placementStatusConfig,
	placementTypeConfig,
} from "../../types/ExchangePlacement";
import { getInitials, formatDate } from "../../types/Scholar";

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

function PlacementRow({
	placement,
	onEdit,
	onDelete,
	className,
}: {
	placement: ExchangePlacement;
	onEdit: () => void;
	onDelete: () => void;
	className?: string;
}) {
	const statusCfg = placementStatusConfig[placement.status];
	const typeCfg = placementTypeConfig[placement.type];

	const duration = (() => {
		const start = new Date(placement.startDate);
		const end = new Date(placement.endDate);
		const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
		return `${months} mo`;
	})();

	return (
		<tr className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors${className ? ` ${className}` : ""}`}>
			{/* Scholar */}
			<td className="px-5 py-3.5">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
						{getInitials(placement.scholarName)}
					</div>
					<div className="min-w-0">
						<p className="font-semibold text-wise-ink dark:text-zinc-100 text-sm truncate">
							{placement.scholarName}
						</p>
						<p className="text-xs text-zinc-400 truncate">{placement.studentId}</p>
					</div>
				</div>
			</td>
			{/* Type */}
			<td className="px-5 py-3.5">
				<span className={`text-xs font-medium px-2 py-0.5 rounded border ${typeCfg.badge}`}>
					{placement.type}
				</span>
			</td>
			{/* Host institution */}
			<td className="px-5 py-3.5">
				<p className="text-sm font-medium text-wise-ink dark:text-zinc-100 truncate max-w-[180px]">
					{placement.hostInstitution}
				</p>
				<p className="text-xs text-zinc-400">
					{placement.city}, {placement.country}
				</p>
			</td>
			{/* Dates */}
			<td className="px-5 py-3.5 whitespace-nowrap">
				<p className="text-sm text-wise-ink dark:text-zinc-200">
					{formatDate(placement.startDate)}
				</p>
				<p className="text-xs text-zinc-400">
					→ {formatDate(placement.endDate)} &middot; {duration}
				</p>
			</td>
			{/* Extra info */}
			<td className="px-5 py-3.5">
				{placement.type === "Exchange" && placement.academicCredits != null ? (
					<p className="text-xs text-zinc-500 dark:text-zinc-400">
						{placement.academicCredits} credits
					</p>
				) : placement.type === "Internship" && placement.supervisorName ? (
					<p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
						{placement.supervisorName}
					</p>
				) : (
					<span className="text-zinc-300 dark:text-zinc-600 text-xs">—</span>
				)}
				{placement.type === "Internship" && placement.department && (
					<p className="text-xs text-zinc-400 truncate max-w-[140px]">
						{placement.department}
					</p>
				)}
			</td>
			{/* Status */}
			<td className="px-5 py-3.5">
				<span
					className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded border ${statusCfg.badge}`}
				>
					<span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
					{placement.status}
				</span>
			</td>
			{/* Actions */}
			<td className="px-5 py-3.5">
				<div className="flex items-center gap-3">
					<button
						onClick={onEdit}
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
					<button
						onClick={onDelete}
						className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
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
			</td>
		</tr>
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
				setError("Failed to load placements.");
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
			alert("Failed to delete placement. Please try again.");
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
		<PageShell
			description="Track all scholar exchange placements and internship postings."
			actions={
				<button
					onClick={() => navigate("/scholars/exchange/create")}
					className="flex items-center gap-1.5 btn-gradient text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
				>
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Add Placement
				</button>
			}
		>

			{/* Stats */}
			<div className="grid grid-cols-5 gap-4">
				<StatCard
					label="Total"
					value={stats.total}
					color="text-wise-ink dark:text-zinc-100"
				/>
				<StatCard
					label="Ongoing"
					value={stats.ongoing}
					color="text-emerald-600 dark:text-emerald-400"
				/>
				<StatCard
					label="Upcoming"
					value={stats.upcoming}
					color="text-amber-600 dark:text-amber-400"
				/>
				<StatCard
					label="Exchanges"
					value={stats.exchange}
					color="text-violet-600 dark:text-violet-400"
				/>
				<StatCard
					label="Internships"
					value={stats.internship}
					color="text-cyan-600 dark:text-cyan-400"
				/>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-3 flex-wrap">
				{/* Search */}
				<div className="relative flex-1 min-w-[220px] max-w-sm">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search scholar, institution, country…"
						className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
					/>
				</div>

				{/* Type pills */}
				<div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
					{(["All", "Exchange", "Internship"] as TypeFilter[]).map((t) => (
						<button
							key={t}
							onClick={() => setTypeFilter(t)}
							className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
								typeFilter === t
									? "bg-white dark:bg-zinc-900 text-wise-ink dark:text-zinc-100 shadow-sm"
									: "text-zinc-500 dark:text-zinc-400 hover:text-wise-ink dark:hover:text-zinc-200"
							}`}
						>
							{t}
						</button>
					))}
				</div>

				{/* Status pills */}
				<div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
					{(
						["All", "Upcoming", "Ongoing", "Completed", "Cancelled"] as StatusFilter[]
					).map((s) => (
						<button
							key={s}
							onClick={() => setStatusFilter(s)}
							className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
								statusFilter === s
									? "bg-white dark:bg-zinc-900 text-wise-ink dark:text-zinc-100 shadow-sm"
									: "text-zinc-500 dark:text-zinc-400 hover:text-wise-ink dark:hover:text-zinc-200"
							}`}
						>
							{s}
						</button>
					))}
				</div>
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
								<PlacementRow
									key={p.id}
									placement={p}
									onEdit={() => navigate(`/scholars/exchange/${p.id}/edit`)}
									onDelete={() => handleDelete(p)}
									className={deletingId === p.id ? "opacity-40 pointer-events-none" : ""}
								/>
							))}
						</tbody>
					</table>
				)}
			</div>
		</PageShell>
	);
}
