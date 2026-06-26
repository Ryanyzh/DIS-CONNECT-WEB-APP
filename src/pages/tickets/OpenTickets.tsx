import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { getCurrentUser } from "../../lib/authRepository";

// each column of tickets will have a filter to get the relevant tickets
const columns: {
	title: string;
	titleColor: string;
	filterFunc: (ticket: TicketProps) => boolean;
	bgColor: string;
}[] = [
	{
		title: "Unassigned",
		titleColor: "text-pink-400",
		filterFunc: (ticket: TicketProps) =>
			ticket.officer == undefined && ticket.status != "Closed",
		bgColor: "bg-pink-400/1",
	},
	{
		title: "In Review",
		titleColor: "text-blue-400",
		filterFunc: (ticket: TicketProps) => ticket.status == "In Review",
		bgColor: "bg-blue-400/1",
	},
	{
		title: "Waiting",
		titleColor: "text-amber-400",
		filterFunc: (ticket: TicketProps) => ticket.status == "Waiting for Response",
		bgColor: "bg-amber-400/1",
	},
	{
		title: "Resolved",
		titleColor: "text-emerald-400",
		filterFunc: (ticket: TicketProps) => ticket.status == "Resolved",
		bgColor: "bg-emerald-400/1",
	},
	{
		title: "Overdue",
		titleColor: "text-rose-500",
		filterFunc: (ticket: TicketProps) =>
			new Date(ticket.deadline) < new Date() &&
			ticket.status != "Resolved" &&
			ticket.status != "Closed",
		bgColor: "bg-rose-500/1",
	},
	{
		title: "Escalated",
		titleColor: "text-rose-500",
		filterFunc: (ticket: TicketProps) => ticket.isEscalated && ticket.status != "Resolved" && ticket.status != "Closed",
		bgColor: "bg-rose-500/1",
	},
];

export function OpenTicketsPage() {
	const { tickets, triggerRefresh, loading } = useTickets();

	if (loading) {
		return (
			<PageShell title="Open Tickets" description="View and manage open tickets.">
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
			title="Open Tickets"
			description="View and manage open tickets that are assigned to you, unassigned, or escalated."
		>
			<div className="bg-wise-canvas h-full max-h-[85vh] min-h-0 w-full flex flex-col">
				<div className="grid grid-flow-col gap-2 justify-between h-full min-h-0 overflow-x-auto">
					{columns.map(({ title, titleColor, filterFunc, bgColor }) => {
						const filteredTickets: TicketProps[] = tickets
							.filter(
								(ticket) =>
									ticket.officer?.id == getCurrentUser()?.uid ||
									!ticket.officer ||
									ticket.isEscalated
							)
							.filter(filterFunc)
							.toSorted((a, b) => b.priority - a.priority);

						return (
							<div
								key={title}
								className={`${bgColor} flex flex-1 flex-col border border-zinc-700/20 rounded-xl h-full min-h-0 w-full min-w-[15rem]`}
							>
								{/* Column Header */}
								<div className={`${titleColor} p-3 font-semibold text-lg w-full`}>
									{title} ({filteredTickets.length})
								</div>

								{/* Ticket cards */}
								<div className="flex flex-1 flex-col gap-y-3 overflow-y-auto">
									{filteredTickets.map((filteredTicket) => (
										<TicketCard
											key={filteredTicket.id}
											ticket={filteredTicket}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</PageShell>
	);
}
