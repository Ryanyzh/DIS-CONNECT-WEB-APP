import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	type Scholar,
	type ScholarStatus,
	scholarStatusConfig,
	getInitials,
	formatDate,
	MOCK_SCHOLARS,
} from "../../types/Scholar";

const STATUSES: (ScholarStatus | "All")[] = ["All", "Active", "On Leave", "Graduated", "Inactive"];

export function ScholarProfilesPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<ScholarStatus | "All">("All");

	const filtered = MOCK_SCHOLARS.filter((s) => {
		const matchesSearch =
			s.fullName.toLowerCase().includes(search.toLowerCase()) ||
			s.email.toLowerCase().includes(search.toLowerCase()) ||
			s.studentId.toLowerCase().includes(search.toLowerCase()) ||
			s.program.toLowerCase().includes(search.toLowerCase());
		const matchesStatus = statusFilter === "All" || s.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const counts = MOCK_SCHOLARS.reduce<Record<string, number>>((acc, s) => {
		acc[s.status] = (acc[s.status] ?? 0) + 1;
		return acc;
	}, {});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-wise-ink/10 dark:border-zinc-700 pb-6">
				<div>
					<h1 className="mt-2 text-2xl font-semibold text-wise-ink dark:text-zinc-100">
						Scholar Profiles
					</h1>
					<p className="mt-1 text-sm text-wise-body dark:text-zinc-400">
						View and manage all scholarship recipients and their ticket history.
					</p>
				</div>
				<div className="flex items-center gap-2 text-xs text-zinc-400">
					<span className="font-semibold text-wise-ink dark:text-zinc-200 text-sm">
						{MOCK_SCHOLARS.length}
					</span>
					scholars total
				</div>
			</div>

			{/* Status filter pills */}
			<div className="flex flex-wrap gap-2">
				{STATUSES.map((s) => {
					const active = statusFilter === s;
					const count = s === "All" ? MOCK_SCHOLARS.length : (counts[s] ?? 0);
					return (
						<button
							key={s}
							onClick={() => setStatusFilter(s)}
							className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
								active
									? "bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 border-wise-ink dark:border-zinc-100"
									: "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
							}`}
						>
							{s !== "All" && (
								<span
									className={`w-1.5 h-1.5 rounded-full ${
										active
											? "bg-wise-canvas dark:bg-zinc-900"
											: scholarStatusConfig[s as ScholarStatus].dot
									}`}
								/>
							)}
							{s}
							<span className={active ? "opacity-60" : "text-zinc-400"}>{count}</span>
						</button>
					);
				})}
			</div>

			{/* Search */}
			<div className="relative max-w-sm">
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
					placeholder="Search by name, ID, email, or programme…"
					className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
				/>
			</div>

			{/* Table */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
				{filtered.length === 0 ? (
					<div className="text-center py-16 text-zinc-400 text-sm">
						No scholars match your search.
					</div>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
								{[
									"Scholar",
									"Student ID",
									"Programme",
									"Year",
									"Status",
									"Tickets",
									"Enrolled",
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
							{filtered.map((scholar) => (
								<ScholarRow
									key={scholar.id}
									scholar={scholar}
									onClick={() => navigate(`/scholars/profiles/${scholar.id}`)}
								/>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
