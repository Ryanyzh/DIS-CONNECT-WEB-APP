import { type ReactNode } from "react";

interface SlaMetrics {
	breachRate: number;
	atRiskCount: number;
	avgFirstResponseText: string;
	avgResolutionText: string;
	activeBreachCount: number;
}

interface SlaKpiCardsProps {
	metrics: SlaMetrics;
}

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
	icon: ReactNode;
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

export default function SlaKpiCards({ metrics }: SlaKpiCardsProps) {
	return (
		<div className="grid grid-cols-5 gap-4">
			<StatCard
				label="SLA Breach Rate"
				value={`${metrics.breachRate}%`}
				sub="of all tickets breached"
				valueColor={
					metrics.breachRate > 0
						? "text-rose-600 dark:text-rose-400"
						: "text-wise-ink dark:text-zinc-100"
				}
				icon={
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				}
			/>
			<StatCard
				label="At Risk Now"
				value={metrics.atRiskCount}
				sub="within 2 hours of breach"
				valueColor={
					metrics.atRiskCount > 0
						? "text-amber-600 dark:text-amber-400"
						: "text-wise-ink dark:text-zinc-100"
				}
				icon={
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				label="Avg First Response"
				value={metrics.avgFirstResponseText}
				sub="target limit: < 4 hrs"
				valueColor="text-blue-600 dark:text-blue-400"
				icon={
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
				}
			/>
			<StatCard
				label="Avg Resolution Time"
				value={metrics.avgResolutionText}
				sub="target limit: < 3 days"
				valueColor="text-emerald-600 dark:text-emerald-400"
				icon={
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				label="Active Breaches"
				value={metrics.activeBreachCount}
				sub="needs intervention"
				valueColor={
					metrics.activeBreachCount > 0
						? "text-rose-600 dark:text-rose-400"
						: "text-wise-ink dark:text-zinc-100"
				}
				icon={
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				}
			/>
		</div>
	);
}
