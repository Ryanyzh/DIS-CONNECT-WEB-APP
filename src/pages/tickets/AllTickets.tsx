import { useState } from "react";
import PageShell from "../PageShell";
import TicketCard, { type TicketStatus, statusStyles } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { useCategories } from "../../hooks/useCategories";

export function AllTicketsPage() {
	const { tickets, loading } = useTickets();
	const categories = useCategories();
	const [statusFilter, setStatusFilter] = useState<string>("All");
	const [categoryFilter, setCategoryFilter] = useState<string>("All");

	const stats = [
		{ status: "Open" as TicketStatus,                   count: tickets.filter((t) => t.status === "Open").length },
		{ status: "In Review" as TicketStatus,              count: tickets.filter((t) => t.status === "In Review").length },
		{ status: "Waiting for Response" as TicketStatus,   count: tickets.filter((t) => t.status === "Waiting for Response").length },
		{ status: "Resolved" as TicketStatus,               count: tickets.filter((t) => t.status === "Resolved").length },
		{ status: "Closed" as TicketStatus,                 count: tickets.filter((t) => t.status === "Closed").length },
		{ status: "Escalated" as TicketStatus,              count: tickets.filter((t) => t.isEscalated).length },
	];

	if (loading) {
		return (
			<PageShell title="All Tickets" description="View every ticket in the system and filter by status, category, or owner.">
				<div className="flex items-center justify-center h-48">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-dc-border-dark border-t-dc-primary" />
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell title="All Tickets" description="View every ticket in the system and filter by status, category, or owner.">
			<div className="flex flex-col gap-4">
				{/* Status summary banner */}
				<div className="bg-dc-surface dark:bg-dc-surface-dark border border-dc-border dark:border-dc-border-dark rounded-xl overflow-hidden shadow-dc-sm">
					<div className="grid grid-cols-6 divide-x divide-dc-border dark:divide-dc-border-dark">
						{stats.map(({ status, count }) => (
							<button
								key={status}
								onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
								className={`flex flex-col items-center py-3 px-2 transition-colors hover:bg-dc-elevated dark:hover:bg-dc-elevated-dark ${statusFilter === status ? "bg-dc-elevated dark:bg-dc-elevated-dark" : ""}`}
							>
								<span className={`text-xl font-bold ${statusStyles[status].text}`}>{count}</span>
								<span className="text-xs text-dc-text-muted mt-0.5 text-center leading-tight">{status}</span>
							</button>
						))}
					</div>
					<div className="border-t border-dc-border dark:border-dc-border-dark px-4 py-2 flex justify-end items-center gap-2 text-xs text-dc-text-muted">
						<span>Total</span>
						<span className="bg-dc-elevated dark:bg-dc-elevated-dark text-dc-text dark:text-white font-semibold px-2.5 py-0.5 rounded-full">
							{tickets.length}
						</span>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-row gap-3 items-center">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="text-xs font-medium border border-dc-border dark:border-dc-border-dark rounded-lg px-3 py-2 bg-dc-surface dark:bg-dc-surface-dark text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 focus:border-dc-primary transition-colors"
					>
						<option value="All">Status: All</option>
						<option value="Open">Status: Open</option>
						<option value="In Review">Status: In Review</option>
						<option value="Waiting for Response">Status: Waiting for Response</option>
						<option value="Resolved">Status: Resolved</option>
						<option value="Closed">Status: Closed</option>
						<option value="Escalated">Status: Escalated</option>
					</select>

					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="text-xs font-medium border border-dc-border dark:border-dc-border-dark rounded-lg px-3 py-2 bg-dc-surface dark:bg-dc-surface-dark text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 focus:border-dc-primary transition-colors"
					>
						<option value="All">Category: All</option>
						{categories.map((cat) => (
							<option key={cat.category_id} value={cat.category_name}>
								Category: {cat.category_name}
							</option>
						))}
					</select>
				</div>

				{/* Ticket list */}
				<div className="flex flex-col gap-2.5 max-h-[72vh] overflow-y-auto pr-1">
					{tickets
						.filter((t) => statusFilter === "All" || t.status === statusFilter || (statusFilter === "Escalated" && t.isEscalated))
						.filter((t) => categoryFilter === "All" || t.category === categoryFilter)
						.toSorted((a, b) => b.priority - a.priority)
						.map((ticket) => (
							<TicketCard key={ticket.id} ticket={ticket} />
						))}
				</div>
			</div>
		</PageShell>
	);
}
