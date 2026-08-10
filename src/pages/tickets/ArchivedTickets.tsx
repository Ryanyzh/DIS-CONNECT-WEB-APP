import { useState, useEffect } from "react";
import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";
import { useTickets } from "../../hooks/useTickets";

export function ArchivedTicketsPage() {
	const { tickets, loading } = useTickets();
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const closedTickets: TicketProps[] = tickets.filter((t) => t.status === "Closed");

	useEffect(() => { setCurrentPage(1); }, [perPage]);

	const totalPages = Math.max(1, Math.ceil(closedTickets.length / perPage));
	const pageStart = (currentPage - 1) * perPage;
	const paginatedTickets = closedTickets.slice(pageStart, pageStart + perPage);

	if (loading) {
		return (
			<PageShell description="Browse tickets that have been resolved, archived, or closed.">
				<div className="flex items-center justify-center h-48">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-zinc-800 border-t-dc-primary" />
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell description="Browse tickets that have been resolved, archived, or closed.">
			<div className="flex flex-col gap-4">
				{closedTickets.length === 0 ? (
					<p className="text-sm text-dc-text-muted py-8 text-center">No archived tickets found.</p>
				) : (
					<>
						<div className="flex flex-col gap-2.5">
							{paginatedTickets.map((ticket) => (
								<TicketCard key={ticket.id} ticket={ticket} />
							))}
						</div>

						{/* pagination bar */}
						{(totalPages > 1 || closedTickets.length > 10) && (
							<div className="flex items-center justify-between pt-1">
								<span className="text-xs text-dc-text-muted">
									Showing{" "}
									<span className="font-semibold text-dc-text dark:text-white">
										{pageStart + 1}–{Math.min(pageStart + perPage, closedTickets.length)}
									</span>{" "}
									of{" "}
									<span className="font-semibold text-dc-text dark:text-white">
										{closedTickets.length}
									</span>{" "}
									tickets
								</span>

								<div className="flex items-center gap-3">
									<div className="flex items-center gap-1.5 text-xs text-dc-text-muted">
										<span>Show</span>
										<select
											value={perPage}
											onChange={(e) => setPerPage(Number(e.target.value))}
											className="text-xs font-medium border border-dc-border dark:border-zinc-700 rounded-lg px-2 py-1 bg-dc-elevated dark:bg-zinc-800 text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 transition-colors"
										>
											{[10, 15, 20, 25, 50].map((n) => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
										<span>per page</span>
									</div>

									<div className="h-4 w-px bg-dc-border dark:bg-zinc-700" />

									<div className="flex items-center gap-1">
										<button
											onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
											disabled={currentPage === 1}
											className="w-7 h-7 flex items-center justify-center rounded-lg border border-dc-border dark:border-zinc-700 text-dc-text-muted hover:bg-dc-elevated dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
										>
											<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
											</svg>
										</button>
										<span className="text-xs text-dc-text dark:text-white font-medium px-2">
											{currentPage} / {totalPages}
										</span>
										<button
											onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
											disabled={currentPage === totalPages}
											className="w-7 h-7 flex items-center justify-center rounded-lg border border-dc-border dark:border-zinc-700 text-dc-text-muted hover:bg-dc-elevated dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
										>
											<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</PageShell>
	);
}
