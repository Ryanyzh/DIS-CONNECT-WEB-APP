import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { getCurrentUser } from "../../lib/authRepository";

const columns: {
	title: string;
	accent: string;
	filterFunc: (ticket: TicketProps) => boolean;
}[] = [
	{
		title: "Unassigned",
		accent: "text-dc-error dark:text-dc-error-dark",
		filterFunc: (t) => t.officer == undefined && t.status !== "Closed",
	},
	{
		title: "In Review",
		accent: "text-blue-600 dark:text-blue-400",
		filterFunc: (t) => t.status === "In Review",
	},
	{
		title: "Waiting",
		accent: "text-amber-600 dark:text-amber-400",
		filterFunc: (t) => t.status === "Waiting for Response",
	},
	{
		title: "Resolved",
		accent: "text-emerald-600 dark:text-emerald-400",
		filterFunc: (t) => t.status === "Resolved",
	},
	{
		title: "Overdue",
		accent: "text-dc-error dark:text-dc-error-dark",
		filterFunc: (t) =>
			new Date(t.deadline) < new Date() && t.status !== "Resolved" && t.status !== "Closed",
	},
	{
		title: "Escalated",
		accent: "text-dc-error dark:text-dc-error-dark",
		filterFunc: (t) => t.isEscalated && t.status !== "Resolved" && t.status !== "Closed",
	},
];

export function OpenTicketsPage() {
	const { tickets, loading } = useTickets();

	if (loading) {
		return (
			<PageShell title="Open Tickets" description="View and manage open tickets assigned to you, unassigned, or escalated.">
				<div className="flex items-center justify-center h-48">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-dc-border-dark border-t-dc-primary" />
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell title="Open Tickets" description="View and manage open tickets assigned to you, unassigned, or escalated.">
			<div className="h-full max-h-[85vh] min-h-0 w-full">
				<div className="grid grid-flow-col gap-3 h-full min-h-0 overflow-x-auto">
					{columns.map(({ title, accent, filterFunc }) => {
						const filtered = tickets
							.filter((t) => t.officer?.id === getCurrentUser()?.uid || !t.officer || t.isEscalated)
							.filter(filterFunc)
							.toSorted((a, b) => b.priority - a.priority);

						return (
							<div
								key={title}
								className="flex flex-1 flex-col border border-dc-border dark:border-dc-border-dark rounded-xl bg-dc-elevated dark:bg-dc-elevated-dark h-full min-h-0 w-full min-w-[15rem] overflow-hidden"
							>
								{/* Column header */}
								<div className={`flex items-center justify-between px-3 py-2.5 border-b border-dc-border dark:border-dc-border-dark bg-dc-surface dark:bg-dc-surface-dark`}>
									<span className={`font-semibold text-sm ${accent}`}>{title}</span>
									<span className="text-xs bg-dc-elevated dark:bg-dc-elevated-dark text-dc-text-muted font-medium px-2 py-0.5 rounded-full">
										{filtered.length}
									</span>
								</div>

								{/* Cards */}
								<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
									{filtered.map((ticket) => (
										<TicketCard key={ticket.id} ticket={ticket} />
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
