import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";

export function AllTicketsPage() {
	const { tickets, triggerRefresh } = useTickets("/api/tickets");

	return (
		<PageShell
			title="All Tickets"
			description="View every ticket in the system and filter by status, category, or owner."
		>
			<div className="bg-wise-canvas h-full w-full flex flex-col text-zinc-200">
				{/* Ticket Board */}
				<div className="bg-wise-canvas border border-zinc-700/20 rounded-xl h-full min-h-0 p-xl">
					<div className="text-xl font-semibold mb-4">Ticket Board</div>
					<div className="grid grid-cols-4 gap-4 justify-between h-full max-h-[90vh] min-h-0 overflow-y-auto">
						{tickets.map((ticket) => (
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
