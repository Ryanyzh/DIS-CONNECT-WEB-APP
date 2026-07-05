import { useEffect, useMemo, useState } from "react";
import PageShell from "../PageShell";
import { useTickets } from "../../hooks/useTickets";
import type { TicketProps } from "../../components/tickets/TicketCard";
import SlaKpiCards from "../../components/analytics/SlaKpiCards";
import { apiFetch } from "../../lib/apiFetch";
import type { TicketHistoryLog } from "../../types/TicketHistoryLog";

export function SlaAnalyticsPage() {
	const { tickets: liveTickets, loading } = useTickets();
	const tickets: TicketProps[] = liveTickets;

	const [ticketsHistory, setTicketsHistory] = useState<Record<string, TicketHistoryLog[]>>({});
	const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

	// Fetch history arrays from backend API endpoints
	useEffect(() => {
		async function fetchHistories() {
			if (liveTickets.length === 0) return;
			setLoadingHistory(true);

			const historyMap: Record<string, TicketHistoryLog[]> = {};

			try {
				await Promise.all(
					liveTickets.map(async (ticket) => {
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
	}, [liveTickets]);

	// Analytics calculation
	const slaMetrics = useMemo(() => {
		const now = new Date();
		const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
		const total = tickets.length;

		let activeBreachCount = 0;
		let historicalBreachCount = 0;
		let atRiskCount = 0;
		let resolvedCount = 0;
		let cumulativeResolutionTimeMs = 0;

		let respondedTicketsCount = 0;
		let cumulativeFirstResponseTimeMs = 0;

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
					}
				}
			}
		}

		// Final Aggregations
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

		return {
			breachRate,
			atRiskCount,
			avgFirstResponseText,
			avgResolutionText,
			activeBreachCount,
		};
	}, [tickets, ticketsHistory]);

	return (
		<PageShell description="Review SLA metrics for service performance and compliance.">
			{(loading || loadingHistory) && liveTickets.length === 0 ? (
				<div className="flex items-center justify-center py-24">
					<span className="text-zinc-400 text-sm">Loading analytics…</span>
				</div>
			) : (
				<div className="space-y-6">
					{/* SLA KPI Cards for summary */}
					<SlaKpiCards metrics={slaMetrics} />
				</div>
			)}
		</PageShell>
	);
}
