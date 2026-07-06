import { useEffect, useMemo, useState } from "react";
import PageShell from "../PageShell";
import { useTickets } from "../../hooks/useTickets";
import { type TicketStatus } from "../../components/tickets/TicketCard";
import SlaKpiCards from "../../components/analytics/SlaKpiCards";
import { apiFetch } from "../../lib/apiFetch";
import type { TicketHistoryLog } from "../../types/TicketHistoryLog";
import { STATUS_META } from "./TicketAnalytics";

// Map action type to status change
const ACTION_TO_STATUS_MAP: Record<string, string> = {
	Assignment: "In Review",
	"In Review": "In Review",
	"De-escalate": "In Review",
	Waiting: "Waiting",
	"Waiting for Response": "Waiting", // for older tickets that had "Waiting for Response" as action type instead of "Waiting"
	Escalated: "Escalated",
	Resolved: "Resolved",
	Closed: "Closed",
};

// Define the visual order on the chart (don't need to display closed)
const SLA_DISPLAY_STATUSES: TicketStatus[] = [
	"Open",
	"In Review",
	"Waiting",
	"Resolved",
	"Escalated",
];

export function SlaAnalyticsPage() {
	const { tickets, loading } = useTickets();

	const [ticketsHistory, setTicketsHistory] = useState<Record<string, TicketHistoryLog[]>>({});
	const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

	// Fetch history arrays from backend API endpoints
	useEffect(() => {
		async function fetchHistories() {
			if (tickets.length === 0) return;
			setLoadingHistory(true);

			const historyMap: Record<string, TicketHistoryLog[]> = {};

			try {
				await Promise.all(
					tickets.map(async (ticket) => {
						// Open tickets have no history
						if (ticket.status === "Open") return;

						// Get ticket history from backend
						const response = await apiFetch(`/api/v1/tickets/${ticket.id}/history`);
						if (response.ok) {
							const data = await response.json();
							historyMap[ticket.id] = data.history;
						}
					})
				);
				setTicketsHistory(historyMap);
			} catch (err) {
				console.error("Backend API history fetch failure:", err);
			} finally {
				setLoadingHistory(false);
			}
		}

		fetchHistories();
	}, [tickets]);

	// Analytics calculation
	const slaMetrics = useMemo(() => {
		const now = new Date();
		const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
		const total = tickets.length;

		// initialise counts for SLA KPI cards
		let activeBreachCount = 0;
		let historicalBreachCount = 0;
		let atRiskCount = 0;
		let resolvedCount = 0;
		let cumulativeResolutionTimeMs = 0;

		let respondedTicketsCount = 0;
		let cumulativeFirstResponseTimeMs = 0;

		// initialise times for time in status stat
		const totalTimeInStatus: Record<string, number> = {
			Open: 0,
			"In Review": 0,
			Waiting: 0,
			Resolved: 0,
			Escalated: 0,
			Closed: 0,
		};

		for (const ticket of tickets) {
			const isResolved =
				(ticket.status === "Resolved" || ticket.status === "Closed") && ticket.resolvedAt;

			const isOverdue = ticket.deadline
				? new Date(ticket.deadline) < now && !isResolved
				: false;

			// Calculate active breaches (needs intervention)
			// unresolved AND (escalated OR overdue)
			if (!isResolved) {
				if (ticket.isEscalated || isOverdue) {
					activeBreachCount++;
				}
			}

			// Calculate historical breaches (breach rate %)
			let hasBeenBreached = false;
			if (ticket.isEscalated) {
				hasBeenBreached = true;
			} else if (ticket.deadline) {
				if (isResolved) {
					// if the ticket had a deadline, was it resolved after the deadline
					if (new Date(ticket.resolvedAt!) > new Date(ticket.deadline)) {
						hasBeenBreached = true;
					}
				} else {
					// ticket is not resolved, is it overdue right now
					if (isOverdue) {
						hasBeenBreached = true;
					}
				}
			}

			if (hasBeenBreached) {
				historicalBreachCount++;
			}

			// Calculate At Risk tickets (Within 2 hrs of deadline, unresolved)
			if (ticket.deadline && ticket.status !== "Resolved" && ticket.status !== "Closed") {
				const timeUntilDeadline = new Date(ticket.deadline).getTime() - now.getTime();
				if (timeUntilDeadline > 0 && timeUntilDeadline <= TWO_HOURS_IN_MS) {
					atRiskCount++;
				}
			}

			// Compute Resolution Time Totals
			if ((ticket.status === "Resolved" || ticket.status === "Closed") && ticket.resolvedAt) {
				resolvedCount++;
				const createdTime = new Date(ticket.createdAt).getTime();
				const resolvedTime = new Date(ticket.resolvedAt).getTime();
				cumulativeResolutionTimeMs += resolvedTime - createdTime;
			}

			const historyList = ticketsHistory[ticket.id];
			if (!historyList || historyList.length === 0) {
				// If ticket has no history that means it's been open the whole time
				totalTimeInStatus["Open"] += now.getTime() - new Date(ticket.createdAt).getTime();
				continue;
			}

			if (historyList && historyList.length > 0) {
				// Backend returns history list in sorted order (ascending created time)
				// Find the first log in the history list
				const firstResponseDoc = historyList[0];

				if (firstResponseDoc) {
					const createdTime = new Date(ticket.createdAt).getTime();
					const respondedTime = new Date(firstResponseDoc.created_at).getTime();
					const diffMs = respondedTime - createdTime;

					if (diffMs > 0) {
						respondedTicketsCount++;
						cumulativeFirstResponseTimeMs += diffMs;
						// Time that the ticket was open (before first response)
						totalTimeInStatus["Open"] += diffMs;
					}
				}

				// Calculate time in between status changes
				for (let i = 0; i < historyList.length - 1; i++) {
					const currentAction = historyList[i];
					const nextAction = historyList[i + 1];

					const actionType = currentAction.action_type;
					const statusName = ACTION_TO_STATUS_MAP[actionType] || "In Review";

					const durationInStatus =
						new Date(nextAction.created_at).getTime() -
						new Date(currentAction.created_at).getTime();
					totalTimeInStatus[statusName] += durationInStatus;
				}

				// Calculate the final status time, last action until now
				const lastAction = historyList[historyList.length - 1];
				if (!isResolved) {
					const lastActionType = lastAction.action_type;
					const statusName = ACTION_TO_STATUS_MAP[lastActionType] || "In Review";

					const finalStatusDuration =
						now.getTime() - new Date(lastAction.created_at).getTime();
					totalTimeInStatus[statusName] += finalStatusDuration;
				}
			}
		}

		// Final Aggregations

		// SLA KPI Cards
		const breachRate = total > 0 ? Math.round((historicalBreachCount / total) * 100) : 0;

		let avgResolutionText = "N/A";
		if (resolvedCount > 0) {
			const avgMs = cumulativeResolutionTimeMs / resolvedCount;
			const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);
			avgResolutionText = `${avgDays} days`;
		}

		let avgFirstResponseText = "N/A";
		if (respondedTicketsCount > 0) {
			const avgResponseMs = cumulativeFirstResponseTimeMs / respondedTicketsCount;
			const avgHours = (avgResponseMs / (1000 * 60 * 60)).toFixed(1);
			avgFirstResponseText = `${avgHours} hrs`;
		}

		// Time in status calculations
		const avgTimeInStatus: Record<string, string> = {};
		// Calculate the  total time sum, excluding Closed status and guarding against NaN
		const totalTimeAll = Object.entries(totalTimeInStatus).reduce(
			(accumulator, [statusName, duration]) => {
				// Skip calculating time for Closed completely
				if (statusName === "Closed") return accumulator;

				// If a duration value accidentally became NaN, treat it as 0 so it doesn't break the bar display
				const safeDuration = isNaN(duration) ? 0 : duration;

				return accumulator + safeDuration;
			},
			0
		);

		SLA_DISPLAY_STATUSES.forEach((statusName) => {
			const totalMs = totalTimeInStatus[statusName] || 0;

			const avgMs = tickets.length > 0 ? totalMs / tickets.length : 0;
			const hours = avgMs / (1000 * 60 * 60);

			if (avgMs <= 0) {
				avgTimeInStatus[statusName] = "0m";
			} else if (hours < 1) {
				avgTimeInStatus[statusName] = `${Math.round(hours * 60)}m`;
			} else if (hours < 24) {
				avgTimeInStatus[statusName] = `${hours.toFixed(1)}h`;
			} else {
				avgTimeInStatus[statusName] = `${(hours / 24).toFixed(1)}d`;
			}
		});

		return {
			breachRate,
			atRiskCount,
			avgFirstResponseText,
			avgResolutionText,
			activeBreachCount,
			totalTimeInStatus,
			avgTimeInStatus,
			totalTimeAll,
		};
	}, [tickets, ticketsHistory]);

	return (
		<PageShell description="Review SLA metrics for service performance and compliance.">
			{(loading || loadingHistory) && tickets.length === 0 ? (
				<div className="flex items-center justify-center py-24">
					<span className="text-zinc-400 text-sm">Loading analytics…</span>
				</div>
			) : (
				<div className="space-y-6">
					{/* SLA KPI Cards for summary */}
					<SlaKpiCards metrics={slaMetrics} />

					{/* Time-in-Status Breakdown component */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<div>
								<p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
									Time-in-Status Overview
								</p>
								<p className="text-xs text-zinc-500 dark:text-zinc-400">
									Average proportion of time a ticket spends in each state across
									its lifespan.
								</p>
							</div>
							{loadingHistory && (
								<span className="text-xs text-indigo-500 dark:text-indigo-400 animate-pulse font-medium">
									Calculating status durations...
								</span>
							)}
						</div>

						{/* Multi-colored Segments Bar */}
						<div className="flex h-4 w-full rounded-full overflow-hidden gap-px bg-zinc-100 dark:bg-zinc-800 mb-6">
							{SLA_DISPLAY_STATUSES.map((statusName) => {
								const duration = slaMetrics.totalTimeInStatus[statusName] || 0;
								const percentage =
									slaMetrics.totalTimeAll > 0
										? (duration / slaMetrics.totalTimeAll) * 100
										: 0;
								if (percentage === 0) return null;
								return (
									<div
										key={statusName}
										title={`${statusName}: ${percentage.toFixed(1)}% (${slaMetrics.avgTimeInStatus[statusName]})`}
										className={`${STATUS_META[statusName].bar} transition-all`}
										style={{ width: `${percentage}%` }}
									/>
								);
							})}
						</div>

						{/* Legend */}
						<div className="grid grid-cols-5 gap-x-8">
							{SLA_DISPLAY_STATUSES.map((statusName) => {
								const durationText = slaMetrics.avgTimeInStatus[statusName] || "0m";
								const duration = slaMetrics.totalTimeInStatus[statusName] || 0;
								const percentage =
									slaMetrics.totalTimeAll > 0
										? (duration / slaMetrics.totalTimeAll) * 100
										: 0;

								return (
									<div
										key={statusName}
										className="flex items-center justify-between gap-2"
									>
										{/* Left Side: Status Colored Dot + Label */}
										<div className="flex items-center gap-2 min-w-0">
											<span
												className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_META[statusName].bar}`}
											/>
											<span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
												{STATUS_META[statusName].label}
											</span>
										</div>

										{/* Right Side: % as primary stat, duration as secondary stat */}
										<div className="flex items-center gap-1.5 flex-shrink-0">
											<span
												className={`text-xs font-semibold ${STATUS_META[statusName].text}`}
											>
												{percentage.toFixed(1)}%
											</span>
											<span className="text-xs text-zinc-300 dark:text-zinc-700">
												({durationText})
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</PageShell>
	);
}
