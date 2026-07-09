import { useEffect, useMemo, useState } from "react";
import PageShell from "../PageShell";
import { useTickets } from "../../hooks/useTickets";
import {
	priorityLabels,
	priorityStyles,
	type TicketCategory,
	type TicketStatus,
} from "../../components/tickets/TicketCard";
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

		// initialise category to stats mapping for SLA performance by category component
		const categoryMetricsMap: Record<
			TicketCategory,
			{ total: number; breached: number; resolved: number; totalResolutionTime: number }
		> = {};

		// initialise priority to stats mapping for SLA performance by priority component
		const priorityMetricsMap: Record<
			number,
			{ total: number; breached: number; resolved: number; totalResolutionTime: number }
		> = {};

		// Initialize officer metrics mapping for officer SLA compliance component
		const officerMetricsMap: Record<
			string,
			{ total: number; breached: number; resolved: number; totalResolutionTime: number }
		> = {};

		for (const ticket of tickets) {
			const isResolved: boolean =
				(ticket.status === "Resolved" || ticket.status === "Closed") &&
				ticket.resolvedAt != null;

			const isOverdue: boolean = ticket.deadline
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

			// SLA PERFORMANCE BY CATEGORY DATA
			if (!categoryMetricsMap[ticket.category]) {
				// If category doesn't exist in the category metrics map, then initialise it
				categoryMetricsMap[ticket.category] = {
					total: 0,
					breached: 0,
					resolved: 0,
					totalResolutionTime: 0,
				};
			}
			// Increment total count of tickets for this category
			categoryMetricsMap[ticket.category].total++;

			// SLA PERFORMANCE BY PRIORITY DATA
			if (!priorityMetricsMap[ticket.priority]) {
				// if the priority metrics map doesn't have this priority, initialise it
				priorityMetricsMap[ticket.priority] = {
					total: 0,
					breached: 0,
					resolved: 0,
					totalResolutionTime: 0,
				};
			}
			// Increment total count of tickets for this priority
			priorityMetricsMap[ticket.priority].total++;

			// OFFICER SLA COMPLIANCE DATA
			const officerName = ticket.officer?.name || "Unassigned";
			if (!officerMetricsMap[officerName]) {
				// if the officer metrics map doesn't have this officer, initialise it
				officerMetricsMap[officerName] = {
					total: 0,
					breached: 0,
					resolved: 0,
					totalResolutionTime: 0,
				};
			}
			officerMetricsMap[officerName].total++;

			if (hasBeenBreached) {
				historicalBreachCount++;
				categoryMetricsMap[ticket.category].breached++;
				priorityMetricsMap[ticket.priority].breached++;
				officerMetricsMap[officerName].breached++;
			}

			// Calculate At Risk tickets (Within 2 hrs of deadline, unresolved)
			if (ticket.deadline && !isResolved) {
				const timeUntilDeadline = new Date(ticket.deadline).getTime() - now.getTime();
				if (timeUntilDeadline > 0 && timeUntilDeadline <= TWO_HOURS_IN_MS) {
					atRiskCount++;
				}
			}

			// Compute Resolution Time Totals
			if (isResolved) {
				resolvedCount++;
				categoryMetricsMap[ticket.category].resolved++;
				priorityMetricsMap[ticket.priority].resolved++;
				officerMetricsMap[officerName].resolved++;

				const createdTime = new Date(ticket.createdAt).getTime();
				const resolvedTime = new Date(ticket.resolvedAt!).getTime();

				cumulativeResolutionTimeMs += resolvedTime - createdTime;
				categoryMetricsMap[ticket.category].totalResolutionTime +=
					resolvedTime - createdTime;
				priorityMetricsMap[ticket.priority].totalResolutionTime +=
					resolvedTime - createdTime;
				officerMetricsMap[officerName].totalResolutionTime += resolvedTime - createdTime;
			}

			// Compute time in status and first response time
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

		// SLA KPI CARDS CALCULATIONS
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

		// TIME IN STATUS COMPONENT CALCULATIONS
		const avgTimeInStatus: Record<string, string> = {};
		// Calculate the total time sum, excluding Closed status and guarding against NaN
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

		// CATEGORY METRICS COMPONENT CALCULATIONS
		const rankedCategories = Object.entries(categoryMetricsMap)
			.map(([category, data]) => {
				const breachRate =
					data.total > 0 ? Math.round((data.breached / data.total) * 100) : 0;

				let avgResolutionDays = 0;
				let avgResolutionText = "N/A";
				if (data.resolved > 0) {
					const avgMs = data.totalResolutionTime / data.resolved;
					avgResolutionDays = avgMs / (1000 * 60 * 60 * 24);
					avgResolutionText = `${avgResolutionDays.toFixed(1)} days`;
				}

				return {
					category,
					total: data.total,
					resolved: data.resolved,
					breached: data.breached,
					breachRate,
					avgResolutionDays,
					avgResolutionText,
				};
			})
			// Rank by highest breach rate first
			.sort((a, b) => b.breachRate - a.breachRate);

		// PRIORITY METRICS COMPONENT CALCULATIONS
		const rankedPriorities = Object.entries(priorityMetricsMap)
			.map(([priority, data]) => {
				const breachRate =
					data.total > 0 ? Math.round((data.breached / data.total) * 100) : 0;

				let avgResolutionDays = 0;
				let avgResolutionText = "N/A";
				if (data.resolved > 0) {
					const avgMs = data.totalResolutionTime / data.resolved;
					avgResolutionDays = avgMs / (1000 * 60 * 60 * 24);
					avgResolutionText = `${avgResolutionDays.toFixed(1)} days`;
				}

				return {
					priority, // is a string
					total: data.total,
					resolved: data.resolved,
					breached: data.breached,
					breachRate,
					avgResolutionDays,
					avgResolutionText,
				};
			})
			// Rank by highest breach rate first
			.sort((a, b) => b.breachRate - a.breachRate);

		// OFFICER SLA COMPLIANCE CALCULATIONS
		const rankedOfficers = Object.entries(officerMetricsMap)
			.map(([name, data]) => {
				// Calculate SLA compliance rate (100% minus breach rate)
				const breachRate =
					data.total > 0 ? Math.round((data.breached / data.total) * 100) : 0;
				const complianceRate = 100 - breachRate;

				let avgResolutionDays = 0;
				let avgResolutionText = "N/A";
				if (data.resolved > 0) {
					const avgMs = data.totalResolutionTime / data.resolved;
					avgResolutionDays = avgMs / (1000 * 60 * 60 * 24);
					avgResolutionText = `${avgResolutionDays.toFixed(1)}d`;
				}

				return {
					name,
					total: data.total,
					resolved: data.resolved,
					breached: data.breached,
					complianceRate,
					avgResolutionText,
				};
			})
			// Filter out any unassigned
			.filter((officer) => officer.name !== "Unassigned")
			// Rank by highest SLA compliance rate first
			.sort((a, b) => b.complianceRate - a.complianceRate);

		return {
			breachRate,
			atRiskCount,
			avgFirstResponseText,
			avgResolutionText,
			activeBreachCount,
			totalTimeInStatus,
			avgTimeInStatus,
			totalTimeAll,
			rankedCategories,
			rankedPriorities,
			rankedOfficers,
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
								<p className="font-semibold text-zinc-900 dark:text-zinc-100">
									Time-in-Status Overview
								</p>
								<p className="text-xs text-zinc-500 dark:text-zinc-400">
									Average proportion of time a ticket spends in each state across
									its lifespan.
								</p>
							</div>
							{loadingHistory && (
								<span className="text-xs text-indigo-500 dark:text-indigo-400 animate-pulse">
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

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
						{/* SLA Performance by Category component */}
						<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
							<div>
								<p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
									SLA Performance by Category
								</p>
								<p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
									Categories ranked by breach rate.
								</p>
							</div>

							<div className="space-y-5">
								{slaMetrics.rankedCategories.length === 0 ? (
									<p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">
										No categories detected.
									</p>
								) : (
									slaMetrics.rankedCategories.map((item) => {
										const categoryStyles: Record<string, string> = {
											Reimbursement: "text-blue-700 dark:text-blue-300",
											Exchange: "text-amber-700 dark:text-amber-300",
											Policy: "text-emerald-700 dark:text-emerald-300",
											Scholarship: "text-violet-700 dark:text-violet-300",
											Leave: "text-teal-700 dark:text-teal-300",
											Internship: "text-sky-700 dark:text-sky-300",
										};

										return (
											<div key={item.category} className="space-y-1.5">
												{/* Category Row Information */}
												<div className="flex items-center justify-between text-xs">
													<span
														className={`${categoryStyles[item.category]}`}
													>
														{item.category}
														<span className="ml-1.5 text-zinc-400 dark:text-zinc-500">
															({item.total} ticket{item.total > 1 ? "s" : ""}, {item.resolved} resolved)
														</span>
													</span>

													<div className="flex items-center gap-4 text-right flex-shrink-0">
														<span className="text-zinc-500 dark:text-zinc-400">
															Avg Resolution Time:{" "}
															<span className="text-zinc-700 dark:text-zinc-300">
																{item.avgResolutionText}
															</span>
														</span>
														<span
															className={
																item.breachRate > 0
																	? "text-rose-600 dark:text-rose-400 font-semibold"
																	: "text-emerald-600 dark:text-emerald-400 font-semibold"
															}
														>
															{item.breachRate}% Breach Rate
														</span>
													</div>
												</div>

												{/* Breach rate bar */}
												<div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
													<div
														className={`h-full rounded-full transition-all duration-500 ${
															item.breachRate > 40
																? "bg-rose-500"
																: item.breachRate > 15
																	? "bg-amber-500"
																	: "bg-emerald-500"
														}`}
														style={{
															width: `${item.breachRate}%`,
														}} // width of coloured bar represents breach rate %
													/>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* SLA Performance by Priority component */}
						<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
							<div>
								<p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
									SLA Performance by Priority
								</p>
								<p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
									Priority tiers ranked by breach rate.
								</p>

								<div className="space-y-5">
									{slaMetrics.rankedPriorities.length === 0 ? (
										<p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">
											No priorities detected.
										</p>
									) : (
										slaMetrics.rankedPriorities.map((item) => {
											const priorityStyles: Record<number, string> = {
												1: "text-green-700 dark:text-green-400",
												2: "text-amber-700 dark:text-amber-400",
												3: "text-red-700 dark:text-red-400",
												4: "text-violet-700 dark:text-violet-400",
											};

											return (
												<div key={item.priority} className="space-y-1.5">
													{/* Priority Row Information */}
													<div className="flex items-center justify-between text-xs">
														<span
															className={`${priorityStyles[Number(item.priority)]}`}
														>
															{priorityLabels[Number(item.priority)]}
															<span className="ml-1.5 text-zinc-400 dark:text-zinc-500 font-normal">
																({item.total} ticket{item.total > 1 ? "s" : ""}, {item.resolved} resolved)
															</span>
														</span>

														<div className="flex items-center gap-4 text-right flex-shrink-0">
															<span className="text-zinc-500 dark:text-zinc-400">
																Avg Resolution Time:{" "}
																<span className="text-zinc-700 dark:text-zinc-300 font-medium">
																	{item.avgResolutionText}
																</span>
															</span>
															<span
																className={
																	item.breachRate > 0
																		? "text-rose-600 dark:text-rose-400 font-semibold"
																		: "text-emerald-600 dark:text-emerald-400 font-semibold"
																}
															>
																{item.breachRate}% Breach Rate
															</span>
														</div>
													</div>

													{/* Breach rate bar */}
													<div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
														<div
															className={`h-full rounded-full transition-all duration-500 ${
																item.breachRate > 40
																	? "bg-rose-500"
																	: item.breachRate > 15
																		? "bg-amber-500"
																		: "bg-emerald-500"
															}`}
															style={{
																width: `${item.breachRate}%`,
															}} // width of coloured bar represents breach rate %
														/>
													</div>
												</div>
											);
										})
									)}
								</div>
							</div>
						</div>

						{/* Officer SLA Compliance Rates */}
						<div className="mt-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
							<div>
								<p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
									Officer SLA Compliance Rates
								</p>
								<p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
									Officers ranked by their individual SLA compliance rate.
								</p>
							</div>

							<div className="space-y-5">
								{slaMetrics.rankedOfficers.length === 0 ? (
									<p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">
										No officer workload records found.
									</p>
								) : (
									slaMetrics.rankedOfficers.map((officer, index) => {
										// For displaying officer rank number in terms of SLA compliance
										const rankNumber = index + 1;

										return (
											<div key={officer.name} className="space-y-1.5">
												{/* Officer Row Header Data */}
												<div className="flex items-center justify-between text-xs">
													<div className="flex items-center gap-2 min-w-0">
														<span className="font-mono text-zinc-400 dark:text-zinc-500 font-bold w-4">
															#{rankNumber}
														</span>
														<span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate">
															{officer.name}
															<span className="ml-1.5 text-zinc-400 dark:text-zinc-500 font-normal">
																({officer.total} ticket{officer.total > 1 ? "s" : ""}, {officer.resolved} resolved)
															</span>
														</span>
													</div>

													<div className="flex items-center gap-4 text-right flex-shrink-0">
														<span className="text-zinc-500 dark:text-zinc-400">
															Avg Resolution Time:{" "}
															<span className="text-zinc-700 dark:text-zinc-300">
																{officer.avgResolutionText}
															</span>
														</span>
														<span
															className={
																officer.complianceRate >= 80
																	? "text-emerald-600 dark:text-emerald-400 font-semibold"
																	: officer.complianceRate >= 50
																		? "text-amber-600 dark:text-amber-400 font-semibold"
																		: "text-rose-600 dark:text-rose-400 font-semibold"
															}
														>
															{officer.complianceRate}% SLA Met
														</span>
													</div>
												</div>

												{/* Compliance visual tracking bar */}
												<div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
													<div
														className={`h-full rounded-full transition-all duration-500 ${
															officer.complianceRate >= 80
																? "bg-emerald-500"
																: officer.complianceRate >= 50
																	? "bg-amber-500"
																	: "bg-rose-500"
														}`}
														style={{
															width: `${officer.complianceRate}%`,
														}} // width of bar represents officer SLA compliance rate %
													/>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</PageShell>
	);
}
