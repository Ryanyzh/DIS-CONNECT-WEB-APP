import { useMemo } from "react";
import PageShell from "../PageShell";
import { useTickets } from "../../hooks/useTickets";
import type { TicketProps, TicketStatus } from "../../components/TicketCard";

// ── Colours ───────────────────────────────────────────────────────────────────

const STATUS_META: Record<TicketStatus, { label: string; bar: string; text: string }> = {
	Open: { label: "Open", bar: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
	"In Review": {
		label: "In Review",
		bar: "bg-indigo-500",
		text: "text-indigo-600 dark:text-indigo-400",
	},
	"Waiting for Response": {
		label: "Waiting",
		bar: "bg-amber-400",
		text: "text-amber-600 dark:text-amber-400",
	},
	Resolved: {
		label: "Resolved",
		bar: "bg-emerald-500",
		text: "text-emerald-600 dark:text-emerald-400",
	},
	Closed: { label: "Closed", bar: "bg-zinc-400", text: "text-zinc-500 dark:text-zinc-400" },
	Escalated: { label: "Escalated", bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
	label,
	value,
	sub,
	valueColor = "text-wise-ink dark:text-zinc-100",
	icon,
}: {
	label: string;
	value: number | string;
	sub?: string;
	valueColor?: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 shadow-sm flex items-start gap-4">
			<div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
					{label}
				</p>
				<p className={`mt-0.5 text-2xl font-bold leading-none ${valueColor}`}>{value}</p>
				{sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
			</div>
		</div>
	);
}

function SectionHeader({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
			{children}
		</h2>
	);
}

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
		<PageShell description="Explore ticket volume, resolution patterns, and team performance.">
			{loading && liveTickets.length === 0 ? (
				<div className="flex items-center justify-center py-24">
					<span className="text-zinc-400 text-sm">Loading analytics…</span>
				</div>
			) : (
				<div className="space-y-6">
					{/* ── Stat cards ─────────────────────────────────────────── */}
					<div className="grid grid-cols-5 gap-4">
						<StatCard
							label="Total Tickets"
							value={m.total}
							sub="all time"
							icon={
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							}
						/>
						<StatCard
							label="Active"
							value={m.active}
							sub="unresolved"
							valueColor="text-blue-600 dark:text-blue-400"
							icon={
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							}
						/>
						<StatCard
							label="Resolved"
							value={m.resolved}
							sub={`${m.resolutionRate}% resolution rate`}
							valueColor="text-emerald-600 dark:text-emerald-400"
							icon={
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							}
						/>
						<StatCard
							label="Escalated"
							value={m.escalated}
							sub="needs attention"
							valueColor={
								m.escalated > 0
									? "text-rose-600 dark:text-rose-400"
									: "text-wise-ink dark:text-zinc-100"
							}
							icon={
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							}
						/>
						<StatCard
							label="Unassigned"
							value={m.unassigned}
							sub="no officer"
							valueColor={
								m.unassigned > 0
									? "text-amber-600 dark:text-amber-400"
									: "text-wise-ink dark:text-zinc-100"
							}
							icon={
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							}
						/>
					</div>
					{/* ── Status overview stacked bar ──────────────────────── */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-5">
						<SectionHeader>Status Overview</SectionHeader>

						{/* Stacked bar */}
						<div className="flex h-3 rounded-full overflow-hidden gap-px mb-4">
							{STATUSES.map((s) => {
								const count = m.byStatus[s] ?? 0;
								const pct = m.total > 0 ? (count / m.total) * 100 : 0;
								if (pct === 0) return null;
								return (
									<div
										key={s}
										title={`${s}: ${count}`}
										className={`${STATUS_META[s].bar} transition-all`}
										style={{ width: `${pct}%` }}
									/>
								);
							})}
						</div>

						{/* Legend */}
						<div className="grid grid-cols-3 gap-x-8 gap-y-3">
							{STATUSES.map((s) => {
								const count = m.byStatus[s] ?? 0;
								const pct = m.total > 0 ? Math.round((count / m.total) * 100) : 0;
								return (
									<div
										key={s}
										className="flex items-center justify-between gap-2"
									>
										<div className="flex items-center gap-2 min-w-0">
											<span
												className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_META[s].bar}`}
											/>
											<span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
												{STATUS_META[s].label}
											</span>
										</div>
										<div className="flex items-center gap-1.5 flex-shrink-0">
											<span
												className={`text-xs font-semibold ${STATUS_META[s].text}`}
											>
												{count}
											</span>
											<span className="text-xs text-zinc-300 dark:text-zinc-700">
												{pct}%
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
