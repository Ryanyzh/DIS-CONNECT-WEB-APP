import { useState } from "react";
import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";

export function AllTicketsPage() {
	const { tickets, triggerRefresh } = useTickets("/api/tickets");
	const [filteredTickets, setFilteredTickets] = useState<TicketProps[]>(tickets);
	const [statusFilter, setStatusFilter] = useState<string>("All");

	const changeStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value == "All") {
			setFilteredTickets(tickets);
			setStatusFilter(e.target.value);
			return;
		}
		setStatusFilter(e.target.value);
		setFilteredTickets(tickets.filter((ticket) => ticket.status == e.target.value));
	};

	return (
		<PageShell
			title="All Tickets"
			description="View every ticket in the system and filter by status, category, or owner."
		>
			<div className="bg-wise-canvas h-full w-full flex flex-col">
				{/* Ticket Board */}
				<div className="bg-wise-canvas border border-zinc-700/20 rounded-xl h-full min-h-0 p-xl">
					<div className="flex flex-row justify-between items-center">
						<div className="text-xl font-semibold mb-4">Ticket Board</div>

						{/* Ticket filters */}
						<div>
							<select
								name="statusFilter"
								value={statusFilter}
								onChange={changeStatusFilter}
								className="line-clamp-2 flex font-semibold text-right w-fit min-h-0 text-xs leading-snug tracking-tight"
							>
								<option value="All">All</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-4 gap-4 justify-between h-full max-h-[90vh] min-h-0 overflow-y-auto">
						{filteredTickets.map((ticket) => (
							<TicketCard
								key={ticket.id}
								ticket={ticket}
								onStatusChange={triggerRefresh}
							/>
						))}
					</div>
				</div>
			</div>
		</PageShell>
	);
}
