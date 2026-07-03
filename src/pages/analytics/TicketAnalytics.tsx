import { useMemo } from "react";
import PageShell from "../PageShell";
import { useTickets } from "../../hooks/useTickets";
import type { TicketProps, TicketStatus } from "../../components/TicketCard";

// ── Main page ─────────────────────────────────────────────────────────────────

export function TicketAnalyticsPage() {
	const m = useMemo(() => {
		const total = tickets.length;
		const byStatus: Partial<Record<TicketStatus, number>> = {};
		const byCategory: Record<string, number> = {};
		const byOfficer: Record<string, { name: string; total: number; resolved: number }> = {};

		let escalated = 0,
			unassigned = 0,
			resolved = 0,
			active = 0;

		// Last 14 days bucketed by date string
		const today = new Date();
		const dayBuckets: { label: string; date: string; count: number }[] = Array.from(
			{ length: 14 },
			(_, i) => {
				const d = new Date(today);
				d.setDate(d.getDate() - (13 - i));
				return {
					label: d.toLocaleDateString("en-SG", { day: "numeric", month: "short" }),
					date: d.toISOString().substring(0, 10),
					count: 0,
				};
			}
		);

		for (const t of tickets) {
			byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
			byCategory[t.category] = (byCategory[t.category] ?? 0) + 1;

			if (t.isEscalated) escalated++;
			if (!t.officer) unassigned++;
			if (t.status === "Resolved" || t.status === "Closed") resolved++;
			else active++;

			if (t.officer) {
				const key = t.officer.id;
				if (!byOfficer[key])
					byOfficer[key] = { name: t.officer.name, total: 0, resolved: 0 };
				byOfficer[key].total++;
				if (t.status === "Resolved" || t.status === "Closed") byOfficer[key].resolved++;
			}

			const ticketDay = t.createdAt.substring(0, 10);
			const bucket = dayBuckets.find((b) => b.date === ticketDay);
			if (bucket) bucket.count++;
		}

		const officers = Object.values(byOfficer).sort((a, b) => b.total - a.total);
		const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
		const maxDayCount = Math.max(...dayBuckets.map((b) => b.count), 1);

		// Priority grouping
		const priorityGroups = { Low: 0, Medium: 0, High: 0 };
		for (const t of tickets) {
			if (t.priority >= 8) priorityGroups.High++;
			else if (t.priority >= 4) priorityGroups.Medium++;
			else priorityGroups.Low++;
		}

		return {
			total,
			active,
			resolved,
			escalated,
			unassigned,
			byStatus,
			byCategory,
			officers,
			resolutionRate,
			dayBuckets,
			maxDayCount,
			priorityGroups,
		};
	}, [tickets]);

	const STATUSES: TicketStatus[] = [
		"Open",
		"In Review",
		"Waiting for Response",
		"Resolved",
		"Closed",
		"Escalated",
	];

	return (
		<PageShell description="Explore ticket volume, resolution patterns, and team performance."></PageShell>
	);
}
