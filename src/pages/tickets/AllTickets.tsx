import { useState } from "react";
import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";

export function AllTicketsPage() {
	const { tickets, triggerRefresh } = useTickets();
	const [statusFilter, setStatusFilter] = useState<string>("All");
	const [categoryFilter, setCategoryFilter] = useState<string>("All");

	const changeStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.target.value);
	};

	const changeCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategoryFilter(e.target.value);
	};

	return (
		<PageShell
			title="All Tickets"
			description="View every ticket in the system and filter by status, category, or owner."
		>
			<div className="bg-wise-canvas h-full w-full flex flex-col">
				{/* Ticket Board */}
				<div className="bg-wise-canvas border border-zinc-700/20 rounded-xl h-full min-h-0">
					<div className="flex flex-row justify-between items-center">
						<div className="text-xl font-semibold m-4">Ticket Board</div>

						{/* Ticket filters */}
						<div className="flex flex-row gap-4 items-center m-4">
							<select
								name="statusFilter"
								value={statusFilter}
								onChange={changeStatusFilter}
								className="line-clamp-2 flex font-semibold text-right w-fit min-h-0 text-xs leading-snug tracking-tight focus:outline-none"
							>
								<option value="All">Status: All</option>
								<option value="Open">Status: Open</option>
								<option value="In Review">Status: In Review</option>
								<option value="Waiting for Response">Status: Waiting for Response</option>
								<option value="Resolved">Status: Resolved</option>
								<option value="Closed">Status: Closed</option>
							</select>
							<select
								name="categoryFilter"
								value={categoryFilter}
								onChange={changeCategoryFilter}
								className="line-clamp-2 flex font-semibold text-right w-fit min-h-0 text-xs leading-snug tracking-tight focus:outline-none"
							>
								<option value="All">Category: All</option>
								<option value="Reimbursement">Category: Reimbursement</option>
								<option value="Exchange">Category: Exchange</option>
								<option value="Policy">Category: Policy</option>
								<option value="Finance">Category: Finance</option>
								<option value="General Query">Category: General Query</option>
							</select>
						</div>
					</div>
					<div className="flex flex-col gap-2 justify-between h-[57vh] min-h-0 overflow-y-auto">
						{tickets.filter((ticket) => statusFilter == "All" || ticket.status == statusFilter)
							.filter((ticket) => categoryFilter == "All" || ticket.tag == categoryFilter)
							.map((ticket) => (
								<TicketCard key={ticket.id} ticket={ticket} onStatusChange={triggerRefresh} />
							))}
					</div>
				</div>
			</div>
		</PageShell>
	);
}
