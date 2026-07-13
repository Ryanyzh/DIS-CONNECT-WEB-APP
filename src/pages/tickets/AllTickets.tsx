import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../PageShell";
import TicketCard, {
	type TicketStatus,
	type TicketProps,
	statusStyles,
	statusStripeStyles,
	categoryStyles,
	priorityLabels,
	priorityStyles,
	LIST_GRID_COLS,
} from "../../components/tickets/TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { useCategories } from "../../hooks/useCategories";
import { formatDate } from "../../types/Scholar";
import { useOfficers } from "../../hooks/useOfficers";

type ViewMode = "list" | "card" | "table";

// ─── Table row ────────────────────────────────────────────────────────────────

function TableRow({ ticket, striped }: { ticket: TicketProps; striped: boolean }) {
	const navigate = useNavigate();

	const isOverdue =
		!!ticket.deadline &&
		new Date(ticket.deadline) < new Date() &&
		ticket.status !== "Resolved" &&
		ticket.status !== "Closed";

	return (
		<tr
			onClick={() => navigate(`/tickets/${ticket.id}`)}
			className={`cursor-pointer transition-colors hover:bg-dc-elevated dark:hover:bg-zinc-800/60 ${striped ? "bg-dc-elevated/30 dark:bg-white/[0.015]" : ""}`}
		>
			{/* Status stripe cell */}
			<td className="p-0 w-1">
				<div
					className={`w-1 min-h-[44px] h-full ${ticket.isEscalated ? "bg-red-500" : statusStripeStyles[ticket.status]}`}
				/>
			</td>

			{/* Ticket code + title */}
			<td className="px-4 py-3 max-w-[280px]">
				<div className="text-[10px] font-mono tracking-widest text-dc-text-muted leading-tight">
					{ticket.code}
				</div>
				<div className="text-sm font-semibold text-dc-text dark:text-white truncate mt-0.5">
					{ticket.title}
				</div>
			</td>

			{/* Category */}
			<td className="px-4 py-3 whitespace-nowrap">
				<span
					className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryStyles[ticket.category]}`}
				>
					{ticket.category}
				</span>
			</td>

			{/* Assignee */}
			<td className="px-4 py-3 whitespace-nowrap">
				{ticket.officer ? (
					<span
						className={`text-xs ${ticket.isEscalated ? "text-dc-error dark:text-dc-error-dark font-medium" : "text-dc-text-muted"}`}
					>
						{ticket.officer.name}
					</span>
				) : (
					<span className="text-xs text-dc-error dark:text-dc-error-dark font-medium">
						Unassigned
					</span>
				)}
			</td>

			{/* Deadline */}
			<td className="px-4 py-3 whitespace-nowrap">
				{formatDate(ticket.deadline) ? (
					<span
						className={`text-xs ${isOverdue ? "text-dc-error dark:text-dc-error-dark font-medium" : "text-dc-text-muted"}`}
					>
						{formatDate(ticket.deadline)}
					</span>
				) : (
					<span className="text-xs text-dc-text-muted opacity-30">—</span>
				)}
			</td>

			{/* Priority */}
			<td className="px-4 py-3 whitespace-nowrap">
				<span
					className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${priorityStyles[ticket.priority]}`}
				>
					{priorityLabels[ticket.priority]}
				</span>
			</td>

			{/* Status */}
			<td className="px-4 py-3 whitespace-nowrap">
				<span
					className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}
				>
					{ticket.status}
				</span>
			</td>
		</tr>
	);
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconList({ active }: { active: boolean }) {
	return (
		<svg
			className={`w-4 h-4 transition-colors ${active ? "text-dc-primary" : "text-dc-text-muted"}`}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			viewBox="0 0 24 24"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M4 6h16M4 10h16M4 14h16M4 18h16"
			/>
		</svg>
	);
}

function IconCard({ active }: { active: boolean }) {
	return (
		<svg
			className={`w-4 h-4 transition-colors ${active ? "text-dc-primary" : "text-dc-text-muted"}`}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			viewBox="0 0 24 24"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
			/>
		</svg>
	);
}

function IconTable({ active }: { active: boolean }) {
	return (
		<svg
			className={`w-4 h-4 transition-colors ${active ? "text-dc-primary" : "text-dc-text-muted"}`}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			viewBox="0 0 24 24"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3 5h18M3 9h18M3 13h18M3 17h18M9 5v14M15 5v14"
			/>
		</svg>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AllTicketsPage() {
	const { tickets, loading } = useTickets();
	const categories = useCategories();
	const { officers } = useOfficers();
	const [statusFilter, setStatusFilter] = useState<string>("All");
	const [categoryFilter, setCategoryFilter] = useState<string>("All");
	const [officerFilter, setOfficerFilter] = useState<string>("All");
	const [includeClosed, setIncludeClosed] = useState<boolean>(false);

	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const stats = [
		{
			status: "Open" as TicketStatus,
			count: tickets.filter((t) => t.status === "Open").length,
		},
		{
			status: "In Review" as TicketStatus,
			count: tickets.filter((t) => t.status === "In Review").length,
		},
		{
			status: "Waiting" as TicketStatus,
			count: tickets.filter((t) => t.status === "Waiting").length,
		},
		{
			status: "Resolved" as TicketStatus,
			count: tickets.filter((t) => t.status === "Resolved").length,
		},
		{
			status: "Closed" as TicketStatus,
			count: tickets.filter((t) => t.status === "Closed").length,
		},
	];

	const filteredTickets = tickets
		.filter((t) => includeClosed || t.status !== "Closed")
		.filter(
			(t) =>
				statusFilter === "All" ||
				t.status === statusFilter ||
				(statusFilter === "Escalated" && t.isEscalated)
		)
		.filter((t) => categoryFilter === "All" || t.category === categoryFilter)
		.filter((t) => {
			if (officerFilter === "All") return true;
			if (officerFilter === "Unassigned") return !t.officer;
			return t.officer?.name === officerFilter;
		})
		.toSorted((a, b) => b.priority - a.priority);

	// Reset to page 1 whenever filters, view, or per-page count changes
	useEffect(() => {
		setCurrentPage(1);
	}, [statusFilter, categoryFilter, viewMode, perPage]);

	const totalPages = Math.max(1, Math.ceil(filteredTickets.length / perPage));
	const pageStart = (currentPage - 1) * perPage;
	const paginatedTickets = filteredTickets.slice(pageStart, pageStart + perPage);

	if (loading) {
		return (
			<PageShell description="View every ticket in the system and filter by status, category, or officer.">
				<div className="flex items-center justify-center h-48">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-zinc-800 border-t-dc-primary" />
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell description="View every ticket in the system and filter by status, category, or officer.">
			<div className="flex flex-col gap-4">
				{/* ── Status summary banner ─────────────────────────────────── */}
				<div className="bg-dc-surface dark:bg-zinc-900 border border-dc-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-dc-sm">
					<div className="grid grid-cols-6 divide-x divide-dc-border dark:divide-zinc-800">
						{stats.map(({ status, count }) => (
							<button
								key={status}
								onClick={() =>
									setStatusFilter(statusFilter === status ? "All" : status)
								}
								className={`flex flex-col items-center py-3.5 px-2 transition-colors hover:bg-dc-elevated dark:hover:bg-zinc-800 ${statusFilter === status ? "bg-dc-elevated dark:bg-zinc-800" : ""}`}
							>
								<span className={`text-xl font-bold ${statusStyles[status].text}`}>
									{count}
								</span>
								<span className="text-[11px] text-dc-text-muted mt-0.5 text-center leading-tight">
									{status}
								</span>
							</button>
						))}
					</div>
					<div className="border-t border-dc-border dark:border-zinc-800 px-4 py-2 flex justify-end items-center gap-2 text-xs text-dc-text-muted">
						<span>Total</span>
						<span className="bg-dc-elevated dark:bg-zinc-800 text-dc-text dark:text-white font-semibold px-2.5 py-0.5 rounded-full">
							{tickets.length}
						</span>
					</div>
				</div>

				{/* ── Filter bar ────────────────────────────────────────────── */}
				<div className="bg-dc-surface dark:bg-zinc-900 border border-dc-border dark:border-zinc-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
					{/* Filter label */}
					<div className="flex items-center gap-1.5 text-dc-text-muted flex-shrink-0">
						<svg
							className="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
							/>
						</svg>
						<span className="text-xs font-medium">Filter</span>
					</div>

					<div className="h-4 w-px bg-dc-border dark:bg-zinc-700 flex-shrink-0" />

					<div className="relative">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="appearance-none text-xs font-medium border border-dc-border dark:border-zinc-700 rounded-lg pl-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 focus:border-dc-primary transition-colors"
						>
							<option value="All">Status: All</option>
							<option value="Open">Status: Open</option>
							<option value="In Review">Status: In Review</option>
							<option value="Waiting">Status: Waiting</option>
							<option value="Resolved">Status: Resolved</option>
							<option value="Closed">Status: Closed</option>
							<option value="Escalated">Status: Escalated</option>
						</select>
						<svg
							className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dc-text-muted"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>

					<div className="relative">
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="appearance-none text-xs font-medium border border-dc-border dark:border-zinc-700 rounded-lg pl-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 focus:border-dc-primary transition-colors"
						>
							<option value="All">Category: All</option>
							{categories.map((cat) => (
								<option key={cat.category_id} value={cat.category_name}>
									Category: {cat.category_name}
								</option>
							))}
						</select>
						<svg
							className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dc-text-muted"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>

					<div className="relative">
						<select
							value={officerFilter}
							onChange={(e) => setOfficerFilter(e.target.value)}
							className="appearance-none text-xs font-medium border border-dc-border dark:border-zinc-700 rounded-lg pl-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 focus:border-dc-primary transition-colors"
						>
							<option value="All">Officer: All</option>
							<option value="Unassigned">Officer: Unassigned</option>
							{officers.map((off) => (
								<option key={off.id} value={off.name}>
									Officer: {off.name}
								</option>
							))}
						</select>
						<svg
							className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dc-text-muted"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>

					<label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dc-text dark:text-zinc-300 select-none">
						<input
							type="checkbox"
							checked={includeClosed}
							onChange={(e) => setIncludeClosed(e.target.checked)}
							className="h-3.5 w-3.5 rounded border-dc-border dark:border-zinc-700 text-dc-primary focus:ring-dc-primary/30 dark:bg-zinc-800 transition-all cursor-pointer"
						/>
						<span>Include Closed Tickets</span>
					</label>

					{/* Right side: count + view toggles */}
					<div className="ml-auto flex items-center gap-3">
						<span className="text-xs text-dc-text-muted hidden sm:block">
							<span className="font-semibold text-dc-text dark:text-white">
								{filteredTickets.length}
							</span>{" "}
							of {tickets.length} tickets
						</span>

						<div className="h-4 w-px bg-dc-border dark:bg-zinc-700 hidden sm:block" />

						{/* View mode toggle */}
						<div className="flex items-center border border-dc-border dark:border-zinc-800 rounded-lg overflow-hidden">
							{(["list", "card", "table"] as ViewMode[]).map((mode, i) => (
								<button
									key={mode}
									onClick={() => setViewMode(mode)}
									title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
									className={`p-1.5 transition-colors ${i > 0 ? "border-l border-dc-border dark:border-zinc-800" : ""} ${viewMode === mode ? "bg-dc-elevated dark:bg-zinc-800" : "hover:bg-dc-elevated/50 dark:hover:bg-zinc-800/50"}`}
								>
									{mode === "list" && <IconList active={viewMode === "list"} />}
									{mode === "card" && <IconCard active={viewMode === "card"} />}
									{mode === "table" && (
										<IconTable active={viewMode === "table"} />
									)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* ── Ticket content ────────────────────────────────────────── */}
				{filteredTickets.length === 0 ? (
					<p className="text-sm text-dc-text-muted py-10 text-center">
						No tickets match the current filters.
					</p>
				) : (
					<>
						{/* LIST VIEW */}
						{viewMode === "list" && (
							<div className="flex flex-col">
								{/* Column header — pl-5 aligns with card content (1px border + 4px stripe + 16px px-4) */}
								<div
									className="grid items-center gap-x-3 pl-5 pr-4 pb-1.5 text-[10px] font-semibold tracking-widest uppercase text-dc-text-muted"
									style={{ gridTemplateColumns: LIST_GRID_COLS }}
								>
									<span>Ticket</span>
									<span>Category</span>
									<span>Assignee</span>
									<span>Due Date</span>
									<span>Priority</span>
									<span>Status</span>
									<span />
								</div>
								<div className="flex flex-col gap-2.5">
									{paginatedTickets.map((ticket) => (
										<TicketCard key={ticket.id} ticket={ticket} view="list" />
									))}
								</div>
							</div>
						)}

						{/* CARD VIEW */}
						{viewMode === "card" && (
							<div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
								{paginatedTickets.map((ticket) => (
									<TicketCard key={ticket.id} ticket={ticket} view="card" />
								))}
							</div>
						)}

						{/* TABLE VIEW */}
						{viewMode === "table" && (
							<div className="rounded-xl border border-dc-border dark:border-zinc-800 overflow-hidden shadow-dc-sm">
								<table className="w-full border-collapse text-xs">
									<thead>
										<tr className="bg-dc-elevated dark:bg-zinc-800 border-b border-dc-border dark:border-zinc-800">
											<th className="p-0 w-1" />
											<th className="text-left px-4 py-2.5 text-[10px] font-semibold text-dc-text-muted uppercase tracking-widest whitespace-nowrap">
												Ticket
											</th>
											<th className="text-left px-4 py-2.5 text-[10px] font-semibold text-dc-text-muted uppercase tracking-widest whitespace-nowrap">
												Category
											</th>
											<th className="text-left px-4 py-2.5 text-[10px] font-semibold text-dc-text-muted uppercase tracking-widest whitespace-nowrap">
												Assignee
											</th>
											<th className="text-left px-4 py-2.5 text-[10px] font-semibold text-dc-text-muted uppercase tracking-widest whitespace-nowrap">
												Due Date
											</th>
											<th className="text-left px-4 py-2.5 text-[10px] font-semibold text-dc-text-muted uppercase tracking-widest whitespace-nowrap">
												Priority
											</th>
											<th className="text-left px-4 py-2.5 text-[10px] font-semibold text-dc-text-muted uppercase tracking-widest whitespace-nowrap">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-dc-border dark:divide-zinc-800 bg-dc-surface dark:bg-zinc-900">
										{paginatedTickets.map((ticket, i) => (
											<TableRow
												key={ticket.id}
												ticket={ticket}
												striped={i % 2 !== 0}
											/>
										))}
									</tbody>
								</table>
							</div>
						)}

						{/* ── Pagination bar ─────────────────────────────────────── */}
						{totalPages > 1 || filteredTickets.length > 10 ? (
							<div className="flex items-center justify-between pt-1">
								{/* Showing info */}
								<span className="text-xs text-dc-text-muted">
									Showing{" "}
									<span className="font-semibold text-dc-text dark:text-white">
										{pageStart + 1}–
										{Math.min(pageStart + perPage, filteredTickets.length)}
									</span>{" "}
									of{" "}
									<span className="font-semibold text-dc-text dark:text-white">
										{filteredTickets.length}
									</span>{" "}
									tickets
								</span>

								<div className="flex items-center gap-3">
									{/* Per-page selector */}
									<div className="flex items-center gap-1.5 text-xs text-dc-text-muted">
										<span>Show</span>
										<select
											value={perPage}
											onChange={(e) => setPerPage(Number(e.target.value))}
											className="text-xs font-medium border border-dc-border dark:border-zinc-700 rounded-lg px-2 py-1 bg-dc-elevated dark:bg-zinc-800 text-dc-text dark:text-white focus:outline-none focus:ring-2 focus:ring-dc-primary/30 transition-colors"
										>
											{[10, 15, 20, 25, 50].map((n) => (
												<option key={n} value={n}>
													{n}
												</option>
											))}
										</select>
										<span>per page</span>
									</div>

									<div className="h-4 w-px bg-dc-border dark:bg-zinc-700" />

									{/* Page navigation */}
									<div className="flex items-center gap-1">
										<button
											onClick={() =>
												setCurrentPage((p) => Math.max(1, p - 1))
											}
											disabled={currentPage === 1}
											className="w-7 h-7 flex items-center justify-center rounded-lg border border-dc-border dark:border-zinc-700 text-dc-text-muted hover:bg-dc-elevated dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
										>
											<svg
												className="w-3.5 h-3.5"
												fill="none"
												stroke="currentColor"
												strokeWidth={2.5}
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15 19l-7-7 7-7"
												/>
											</svg>
										</button>
										<span className="text-xs text-dc-text dark:text-white font-medium px-2">
											{currentPage} / {totalPages}
										</span>
										<button
											onClick={() =>
												setCurrentPage((p) => Math.min(totalPages, p + 1))
											}
											disabled={currentPage === totalPages}
											className="w-7 h-7 flex items-center justify-center rounded-lg border border-dc-border dark:border-zinc-700 text-dc-text-muted hover:bg-dc-elevated dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
										>
											<svg
												className="w-3.5 h-3.5"
												fill="none"
												stroke="currentColor"
												strokeWidth={2.5}
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						) : null}
					</>
				)}
			</div>
		</PageShell>
	);
}
