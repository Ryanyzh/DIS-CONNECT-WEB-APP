import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";

export function ArchivedTicketsPage() {
	const { tickets, triggerRefresh } = useTickets("/api/tickets");
	const closedTickets: TicketProps[] = tickets.filter(
		(ticket: TicketProps) => ticket.status == "Closed"
	);

	return (
		<PageShell
			title="Archived / Closed Tickets"
			description="Browse tickets that have been resolved, archived, or closed."
		>
			<div className="bg-wise-canvas h-full w-full flex flex-col text-zinc-200">
				<div className="bg-wise-canvas border border-zinc-700/20 rounded-xl h-full min-h-0 p-xl">
					<div className="text-xl font-semibold mb-4">Ticket Board</div>
					<div className="grid grid-cols-4 gap-4 justify-between h-full max-h-[90vh] min-h-0 overflow-y-auto">
						{closedTickets.map((closedTicket) => (
							<TicketCard
								key={closedTicket.id}
								ticket={closedTicket}
								onStatusChange={triggerRefresh}
							/>
						))}
					</div>
				</div>
			</div>
		</PageShell>
	);
}
