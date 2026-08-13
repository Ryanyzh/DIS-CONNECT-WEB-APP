import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiFetch";
import {
	type ActivityLog,
	type ActivityEventType,
	EVENT_TYPES,
	eventConfig,
	MOCK_ACTIVITY_LOGS,
} from "../../types/ActivityLog";
import { getInitials } from "../../types/Scholar";
import { MOCK_SCHOLARS } from "../../data/mockScholars";
import PageShell from "../PageShell";

// Icons

function EventIcon({ type }: { type: ActivityEventType }) {
	const cfg = eventConfig[type];
	const icon = cfg.icon;

	const path = (() => {
		switch (icon) {
			case "user-plus":
				return "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z";
			case "pencil":
				return "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
			case "ticket":
				return "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z";
			case "arrow":
				return "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4";
			case "check":
				return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
			case "globe":
				return "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
			case "document":
				return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
			case "note":
				return "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
			default:
				return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
		}
	})();

	return (
		<span
			className={`inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${cfg.color}`}
		>
			<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
			</svg>
		</span>
	);
}

// Helpers

function formatTimestamp(iso: string): { date: string; time: string; relative: string } {
	const d = new Date(iso);
	const now = new Date();
	const diff = now.getTime() - d.getTime();
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	const relative =
		mins < 1
			? "Just now"
			: mins < 60
				? `${mins}m ago`
				: hours < 24
					? `${hours}h ago`
					: days < 7
						? `${days}d ago`
						: d.toLocaleDateString("en-SG", { day: "numeric", month: "short" });

	return {
		date: d.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" }),
		time: d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" }),
		relative,
	};
}

function groupByDate(logs: ActivityLog[]): [string, ActivityLog[]][] {
	const map = new Map<string, ActivityLog[]>();
	for (const log of logs) {
		const key = new Date(log.timestamp).toLocaleDateString("en-SG", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		if (!map.has(key)) map.set(key, []);
		map.get(key)!.push(log);
	}
	return Array.from(map.entries());
}

// Main component

export function ScholarActivityLogsPage() {
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);

	const [search, setSearch] = useState("");
	const [scholarFilter, setScholarFilter] = useState("All");
	const [typeFilter, setTypeFilter] = useState<ActivityEventType | "All">("All");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const fetchLogs = useCallback(() => {
		setLoading(true);
		apiFetch("/api/v1/scholars/activity")
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((data: ActivityLog[]) => setLogs(data))
			.catch(() => setLogs(MOCK_ACTIVITY_LOGS))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchLogs();
	}, [fetchLogs]);

	const toggleExpand = (id: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});

	const sorted = [...logs].sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);

	const filtered = sorted.filter((l) => {
		const matchSearch =
			l.scholarName.toLowerCase().includes(search.toLowerCase()) ||
			l.description.toLowerCase().includes(search.toLowerCase()) ||
			l.studentId.toLowerCase().includes(search.toLowerCase()) ||
			l.performedBy.toLowerCase().includes(search.toLowerCase());
		const matchScholar = scholarFilter === "All" || l.scholarId === scholarFilter;
		const matchType = typeFilter === "All" || l.eventType === typeFilter;
		const ts = new Date(l.timestamp);
		const matchFrom = !dateFrom || ts >= new Date(dateFrom);
		const matchTo = !dateTo || ts <= new Date(dateTo + "T23:59:59Z");
		return matchSearch && matchScholar && matchType && matchFrom && matchTo;
	});

	const grouped = groupByDate(filtered);

	const stats = {
		total: logs.length,
		today: logs.filter(
			(l) => new Date(l.timestamp).toDateString() === new Date().toDateString()
		).length,
		thisWeek: logs.filter(
			(l) => new Date().getTime() - new Date(l.timestamp).getTime() < 7 * 86400000
		).length,
		scholars: new Set(logs.map((l) => l.scholarId)).size,
	};

	const clearFilters = () => {
		setSearch("");
		setScholarFilter("All");
		setTypeFilter("All");
		setDateFrom("");
		setDateTo("");
	};
	const isFiltered =
		search || scholarFilter !== "All" || typeFilter !== "All" || dateFrom || dateTo;

	return (
		<PageShell description="Chronological audit trail of all scholar-related events across the system.">

			{/* Stats */}
			<div className="grid grid-cols-4 gap-4">
				{[
					{
						label: "Total Events",
						value: stats.total,
						color: "text-wise-ink dark:text-zinc-100",
					},
					{
						label: "Today",
						value: stats.today,
						color: "text-violet-600 dark:text-violet-400",
					},
					{
						label: "This Week",
						value: stats.thisWeek,
						color: "text-blue-600 dark:text-blue-400",
					},
					{
						label: "Scholars Tracked",
						value: stats.scholars,
						color: "text-emerald-600 dark:text-emerald-400",
					},
				].map(({ label, value, color }) => (
					<div
						key={label}
						className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 shadow-sm"
					>
						<p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
							{label}
						</p>
						<p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm space-y-3">
				<div className="flex items-center gap-4 flex-wrap">
					{/* Search */}
					<div className="relative flex-1 min-w-[180px] max-w-xs">
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
							placeholder="Search…"
							className="w-full h-9 pl-9 pr-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
						/>
					</div>

					{/* Scholar dropdown */}
					<select
						value={scholarFilter}
						onChange={(e) => setScholarFilter(e.target.value)}
						className="h-9 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
					>
						<option value="All">All Scholars</option>
						{MOCK_SCHOLARS.map((s) => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</select>

					{/* Date range — grouped tightly */}
					<div className="flex items-center gap-2">
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							className="h-9 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
						/>
						<span className="text-xs text-zinc-400">to</span>
						<input
							type="date"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							className="h-9 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
						/>
					</div>

					{isFiltered && (
						<button
							onClick={clearFilters}
							className="ml-auto text-xs text-zinc-400 hover:text-rose-500 transition-colors whitespace-nowrap"
						>
							Clear filters
						</button>
					)}
				</div>

				{/* Event type pills */}
				<div className="flex flex-wrap gap-1.5">
					<button
						onClick={() => setTypeFilter("All")}
						className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
							typeFilter === "All"
								? "bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 border-wise-ink dark:border-zinc-100"
								: "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
						}`}
					>
						All Events
					</button>
					{EVENT_TYPES.map((t) => {
						const cfg = eventConfig[t];
						const active = typeFilter === t;
						return (
							<button
								key={t}
								onClick={() => setTypeFilter(t)}
								className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
									active
										? "bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 border-wise-ink dark:border-zinc-100"
										: `${cfg.badge} hover:opacity-80`
								}`}
							>
								{cfg.label}
							</button>
						);
					})}
				</div>
			</div>

			{/* Feed */}
			{loading ? (
				<div className="flex items-center justify-center py-16">
					<span className="text-zinc-400 text-sm">Loading…</span>
				</div>
			) : filtered.length === 0 ? (
				<div className="text-center py-16 text-zinc-400 text-sm">
					No activity logs match your filters.
				</div>
			) : (
				<div className="space-y-8">
					{grouped.map(([date, dateLogs]) => (
						<div key={date}>
							{/* Date divider */}
							<div className="flex items-center gap-3 mb-4">
								<span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
									{date}
								</span>
								<div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
								<span className="text-xs text-zinc-400">
									{dateLogs.length} event{dateLogs.length !== 1 ? "s" : ""}
								</span>
							</div>

							{/* Log entries */}
							<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
								{dateLogs.map((log) => {
									const { time, relative } = formatTimestamp(log.timestamp);
									const isExpanded = expanded.has(log.id);
									const hasMetadata =
										log.metadata && Object.keys(log.metadata).length > 0;

									return (
										<div key={log.id} className="px-5 py-3.5">
											<div className="flex items-start gap-3">
												<EventIcon type={log.eventType} />

												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-3">
														<div className="flex-1 min-w-0">
															{/* Scholar */}
															<div className="flex items-center gap-2 mb-0.5">
																<div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">
																	{getInitials(log.scholarName)}
																</div>
																<span className="text-xs font-semibold text-wise-ink dark:text-zinc-200">
																	{log.scholarName}
																</span>
																<span className="text-xs text-zinc-400 font-mono">
																	{log.studentId}
																</span>
																<span
																	className={`text-xs font-medium px-1.5 py-0.5 rounded border ${eventConfig[log.eventType].badge}`}
																>
																	{
																		eventConfig[log.eventType]
																			.label
																	}
																</span>
															</div>
															{/* Description */}
															<p className="text-sm text-wise-body dark:text-zinc-300 leading-relaxed">
																{log.description}
															</p>
															{/* Performed by */}
															<p className="text-xs text-zinc-400 mt-1">
																by{" "}
																<span className="font-medium text-zinc-500 dark:text-zinc-400">
																	{log.performedBy}
																</span>
																{" · "}
																{time}
															</p>
														</div>

														<div className="flex items-center gap-2 flex-shrink-0">
															<span className="text-xs text-zinc-400 whitespace-nowrap">
																{relative}
															</span>
															{hasMetadata && (
																<button
																	onClick={() =>
																		toggleExpand(log.id)
																	}
																	className="text-zinc-400 hover:text-wise-ink dark:hover:text-zinc-200 transition-colors"
																	title={
																		isExpanded
																			? "Collapse"
																			: "Show details"
																	}
																>
																	<svg
																		className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
																</button>
															)}
														</div>
													</div>

													{/* Expanded metadata */}
													{isExpanded && hasMetadata && (
														<div className="mt-3 ml-0 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2.5 flex flex-wrap gap-x-6 gap-y-1.5">
															{Object.entries(log.metadata!).map(
																([k, v]) => (
																	<div
																		key={k}
																		className="flex items-center gap-1.5"
																	>
																		<span className="text-xs text-zinc-400 capitalize">
																			{k.replace(/_/g, " ")}:
																		</span>
																		<span className="text-xs font-medium text-wise-ink dark:text-zinc-200">
																			{v}
																		</span>
																	</div>
																)
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</PageShell>
	);
}
