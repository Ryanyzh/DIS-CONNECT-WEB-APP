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

	const changeStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.target.value);
	};

	const changeCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategoryFilter(e.target.value);
	};

	const stats = [
		{
			status: "Open" as TicketStatus,
			count: tickets.filter((ticket) => ticket.status == "Open").length,
		},
		{
			status: "In Review" as TicketStatus,
			count: tickets.filter((ticket) => ticket.status == "In Review").length,
		},
		{
			status: "Waiting for Response" as TicketStatus,
			count: tickets.filter((ticket) => ticket.status == "Waiting for Response").length,
		},
		{
			status: "Resolved" as TicketStatus,
			count: tickets.filter((ticket) => ticket.status == "Resolved").length,
		},
		{
			status: "Closed" as TicketStatus,
			count: tickets.filter((ticket) => ticket.status == "Closed").length,
		},
		{
			status: "Escalated" as TicketStatus,
			count: tickets.filter((ticket) => ticket.isEscalated).length,
		},
	];

	if (loading) {
		return (
			<PageShell
				title="All Tickets"
				description="View every ticket in the system and filter by status, category, or owner."
			>
				<div className="bg-wise-canvas h-full w-full flex flex-col items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
					</div>
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell
			title="All Tickets"
			description="View every ticket in the system and filter by status, category, or owner."
		>
			<div className="bg-wise-canvas h-full w-full flex flex-col">
				{/* Summary Banner */}
				<div className="bg-wise-canvas flex flex-row w-full border p-4 justify-between rounded-xl items-center divide-x">
					{stats.map(({ status, count }) => (
						<div key={status} className="flex flex-col px-4">
							<span className={`text-sm ${statusStyles[status].text}`}>{status}</span>
							<span className="text-lg font-semibold">{count}</span>
						</div>
					))}
				</div>

				{/* Ticket List */}
				<div className="bg-wise-canvas h-full min-h-0 w-full">
					<div className="flex flex-row justify-between items-center">
						{/* Ticket filters */}
						<div className="flex flex-row w-full gap-4 items-center py-4">
							<select
								name="statusFilter"
								value={statusFilter}
								onChange={changeStatusFilter}
								className="border p-2 rounded-xl line-clamp-2 flex font-semibold w-fit min-h-0 text-xs leading-snug tracking-tight focus:outline-none"
							>
								<option value="All" className="bg-zinc-900 text-zinc-100">
									Status: All
								</option>
								<option value="Open" className="bg-zinc-900 text-zinc-100">
									Status: Open
								</option>
								<option value="In Review" className="bg-zinc-900 text-zinc-100">
									Status: In Review
								</option>
								<option
									value="Waiting for Response"
									className="bg-zinc-900 text-zinc-100"
								>
									Status: Waiting for Response
								</option>
								<option value="Resolved" className="bg-zinc-900 text-zinc-100">
									Status: Resolved
								</option>
								<option value="Closed" className="bg-zinc-900 text-zinc-100">
									Status: Closed
								</option>
								<option value="Escalated" className="bg-zinc-900 text-zinc-100">
									Status: Escalated
								</option>
							</select>
							<select
								name="categoryFilter"
								value={categoryFilter}
								onChange={changeCategoryFilter}
								className="border p-2 rounded-xl line-clamp-2 flex font-semibold w-fit min-h-0 text-xs leading-snug tracking-tight focus:outline-none"
							>
								<option value="All" className="bg-zinc-900 text-zinc-100">
									Category: All
								</option>
								{categories.map((cat) => (
									<option
										key={cat.category_id}
										value={cat.category_name}
										className="bg-zinc-900 text-zinc-100"
									>
										Category: {cat.category_name}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="flex flex-col gap-3 justify-between h-full max-h-[100vh] min-h-0 overflow-y-auto">
						{tickets
							.filter(
								(ticket) =>
									statusFilter == "All" ||
									ticket.status == statusFilter ||
									(statusFilter == "Escalated" && ticket.isEscalated)
							)
							.filter(
								(ticket) =>
									categoryFilter == "All" || ticket.category == categoryFilter
							)
							.toSorted((a, b) => b.priority - a.priority)
							.map((ticket) => (
								<TicketCard key={ticket.id} ticket={ticket} />
							))}
					</div>
				</div>
			</div>
		</PageShell>
	);
}
