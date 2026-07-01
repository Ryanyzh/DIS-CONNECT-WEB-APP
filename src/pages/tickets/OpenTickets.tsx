import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { getCurrentUser } from "../../lib/authRepository";

const columns: {
	title: string;
	dot: string;
	emptyMsg: string;
	filterFunc: (ticket: TicketProps) => boolean;
}[] = [
	{
		title: "Unassigned",
		dot: "bg-red-500",
		emptyMsg: "No unassigned tickets",
		filterFunc: (t) => t.officer == undefined && t.status !== "Closed",
	},
	{
		title: "In Review",
		dot: "bg-indigo-500",
		emptyMsg: "No tickets in review",
		filterFunc: (t) => t.status === "In Review",
	},
	{
		title: "Waiting",
		dot: "bg-amber-400",
		emptyMsg: "No tickets waiting",
		filterFunc: (t) => t.status === "Waiting for Response",
	},
	{
		title: "Resolved",
		dot: "bg-emerald-500",
		emptyMsg: "No resolved tickets",
		filterFunc: (t) => t.status === "Resolved",
	},
	{
		title: "Overdue",
		dot: "bg-orange-500",
		emptyMsg: "No overdue tickets",
		filterFunc: (t) =>
			new Date(t.deadline) < new Date() && t.status !== "Resolved" && t.status !== "Closed",
	},
	{
		title: "Escalated",
		dot: "bg-red-600",
		emptyMsg: "No escalated tickets",
		filterFunc: (t) => t.isEscalated && t.status !== "Resolved" && t.status !== "Closed",
	},
];

export function OpenTicketsPage() {
	const { tickets, loading } = useTickets();

	if (loading) {
		return (
			<PageShell description="View and manage open tickets assigned to you, unassigned, or escalated.">
				<div className="flex items-center justify-center h-48">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-zinc-800 border-t-dc-primary" />
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell description="View and manage open tickets assigned to you, unassigned, or escalated.">
			<div className="h-[72vh] min-h-0 w-full">
				<div className="flex gap-3 h-full min-h-0 overflow-x-auto pb-2">
					{columns.map(({ title, dot, emptyMsg, filterFunc }) => {
						const filtered = tickets
							.filter(
								(t) =>
									t.officer?.id === getCurrentUser()?.uid ||
									!t.officer ||
									t.isEscalated
							)
							.filter(filterFunc)
							.toSorted((a, b) => b.priority - a.priority);

						return (
							<div
								key={title}
								className="flex flex-col flex-shrink-0 w-[272px] rounded-xl border border-dc-border dark:border-zinc-800 bg-dc-elevated/40 dark:bg-white/[0.03] h-full min-h-0 overflow-hidden"
							>
								{/* Colored accent stripe */}
								<div className={`h-0.5 flex-shrink-0 ${dot}`} />

								{/* Column header */}
								<div className="flex items-center justify-between px-3.5 py-2.5 border-b border-dc-border dark:border-zinc-800 flex-shrink-0">
									<div className="flex items-center gap-2">
										<div
											className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`}
										/>
										<span className="text-sm font-semibold text-dc-text dark:text-white">
											{title}
										</span>
									</div>
									<span className="text-[11px] font-semibold bg-dc-border/60 dark:bg-zinc-800 text-dc-text-muted dark:text-zinc-400 px-2 py-0.5 rounded-full">
										{filtered.length}
									</span>
								</div>

								{/* Cards — use view="card" for vertical kanban layout */}
								<div className="flex flex-col gap-2 overflow-y-auto px-2.5 pt-2.5 pb-8 flex-1 min-h-0">
									{filtered.length === 0 ? (
										<div className="flex items-center justify-center h-16 mt-1 rounded-lg border border-dashed border-dc-border dark:border-zinc-700 text-xs text-dc-text-muted">
											{emptyMsg}
										</div>
									) : (
										filtered.map((ticket) => (
											<TicketCard
												key={ticket.id}
												ticket={ticket}
												view="card"
											/>
										))
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</PageShell>
	);
}
