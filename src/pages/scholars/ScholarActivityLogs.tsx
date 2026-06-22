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

// ── Main component ──────────────────────────────────────────────────────────

export function ScholarActivityLogsPage() {
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);

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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="border-b border-wise-ink/10 dark:border-zinc-700 pb-6">
				<h1 className="mt-2 text-2xl font-semibold text-wise-ink dark:text-zinc-100">
					Scholar Activity Logs
				</h1>
				<p className="mt-1 text-sm text-wise-body dark:text-zinc-400">
					Chronological audit trail of all scholar-related events across the system.
				</p>
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
																<div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
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
		</div>
	);
}
