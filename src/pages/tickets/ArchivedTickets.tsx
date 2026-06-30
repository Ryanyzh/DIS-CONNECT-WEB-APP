import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";

export function ArchivedTicketsPage() {
	const { tickets, loading } = useTickets();
	const closedTickets: TicketProps[] = tickets.filter((t) => t.status === "Closed");

	if (loading) {
		return (
			<PageShell title="Archived / Closed Tickets" description="Browse tickets that have been resolved, archived, or closed.">
				<div className="flex items-center justify-center h-48">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-dc-border-dark border-t-dc-primary" />
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell title="Archived / Closed Tickets" description="Browse tickets that have been resolved, archived, or closed.">
			<div className="flex flex-col gap-2.5 max-h-[80vh] overflow-y-auto pr-1">
				{closedTickets.length === 0 ? (
					<p className="text-sm text-dc-text-muted py-8 text-center">No archived tickets found.</p>
				) : (
					closedTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
				)}
			</div>
		</PageShell>
	);
}
