import { useMemo } from "react";
import PageShell from "../PageShell";
import { useTickets } from "../../hooks/useTickets";
import type { TicketProps } from "../../components/tickets/TicketCard";
import SlaKpiCards from "../../components/analytics/SlaKpiCards";

export function SlaAnalyticsPage() {
	const { tickets: liveTickets, loading } = useTickets();
	const tickets: TicketProps[] = liveTickets;

	const slaMetrics = useMemo(() => {
		const now = new Date();
		const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
		const total = tickets.length;

		let activeBreachCount = 0;
		let historicalBreachCount = 0;
		let atRiskCount = 0;
		let resolvedCount = 0;
		let cumulativeResolutionTimeMs = 0;

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
		}

		// Final Aggregations
		const breachRate = total > 0 ? Math.round((historicalBreachCount / total) * 100) : 0;

		let avgResolutionText = "N/A";
		if (resolvedCount > 0) {
			const avgMs = cumulativeResolutionTimeMs / resolvedCount;
			const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);
			avgResolutionText = `${avgDays} days`;
		}

		// Placeholder string matching target for now
		const avgFirstResponseText = "2.4 hrs";

		return {
			breachRate,
			atRiskCount,
			avgFirstResponseText,
			avgResolutionText,
			activeBreachCount,
		};
	}, [tickets]);

	return (
		<PageShell description="Review SLA metrics for service performance and compliance.">
			{loading && liveTickets.length === 0 ? (
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
