import { useEffect, useState } from "react";
import PageShell from "../PageShell";
import TicketCard, { type TicketProps } from "../../components/TicketCard";

// const testTickets: TicketProps[] = [
// 	// In Review
// 	{
// 		id: "REB-2024-0012",
// 		title: "Hostel Reimbursement Year 1 Semester 1",
// 		tag: "Reimbursement",
// 		description: "Requesting reimbursement for hostel fees for Year 1 Semester 1",
// 		priority: 3,
// 		status: "In Review",
// 		deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
// 		lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
// 		officer: {
// 			id: "0",
// 			name: "Eileen T.",
// 			email: "eileen.t@example.com",
// 			department: "HR",
// 		},
// 	},
// 	{
// 		id: "REB-2024-0013",
// 		title: "Hostel Reimbursement Year 1 Semester 2",
// 		tag: "Reimbursement",
// 		description: "Requesting reimbursement for hostel fees for Year 1 Semester 2",
// 		priority: 3,
// 		status: "In Review",
// 		deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
// 		lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
// 		officer: {
// 			id: "0",
// 			name: "Eileen T.",
// 			email: "eileen.t@example.com",
// 			department: "HR",
// 		},
// 	},
// 	{
// 		id: "REB-2024-0014",
// 		title: "Hostel Reimbursement Year 2 Semester 1",
// 		tag: "Reimbursement",
// 		description: "Requesting reimbursement for hostel fees for Year 2 Semester 1",
// 		priority: 3,
// 		status: "In Review",
// 		deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
// 		lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
// 		officer: {
// 			id: "0",
// 			name: "Eileen T.",
// 			email: "eileen.t@example.com",
// 			department: "HR",
// 		},
// 	},
// 	{
// 		id: "REB-2024-0015",
// 		title: "Hostel Reimbursement Year 2 Semester 2",
// 		tag: "Reimbursement",
// 		description: "Requesting reimbursement for hostel fees for Year 2 Semester 2",
// 		priority: 3,
// 		status: "In Review",
// 		deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
// 		lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
// 		officer: {
// 			id: "0",
// 			name: "Eileen T.",
// 			email: "eileen.t@example.com",
// 			department: "HR",
// 		},
// 	},
// 	// Waiting for Response
// 	{
// 		id: "EXCH-2024-0051",
// 		title: "NOC overseas extension",
// 		tag: "Exchange",
// 		description: "Requesting extension for overseas exchange",
// 		priority: 4,
// 		status: "Waiting for Response",
// 		deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
// 		lastUpdated: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
// 		officer: {
// 			id: "1",
// 			name: "Marcus W.",
// 			email: "marcus.w@example.com",
// 			department: "HR",
// 		},
// 	},
// 	// Resolved
// 	{
// 		id: "POL-2024-0030",
// 		title: "Bond deferral - postgrad",
// 		tag: "Policy",
// 		description: "Requesting bond deferral for further studies",
// 		priority: 1,
// 		status: "Resolved",
// 		deadline: new Date(new Date().getTime() + 10 * 60000), // 10 minutes later
// 		lastUpdated: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
// 		officer: {
// 			id: "1",
// 			name: "Marcus W.",
// 			email: "marcus.w@example.com",
// 			department: "HR",
// 		},
// 	},
// 	// Overdue
// 	{
// 		id: "EXCH-2024-0040",
// 		title: "NOC request - urgent",
// 		tag: "Exchange",
// 		description: "Requesting permission for overseas exchange",
// 		priority: 5,
// 		status: "Waiting for Response",
// 		deadline: new Date(new Date().getTime() - 10 * 60000), // 10 minutes ago
// 		lastUpdated: new Date(new Date().getTime() - 20 * 60000), // 20 minutes ago
// 		officer: {
// 			id: "0",
// 			name: "Eileen T.",
// 			email: "eileen.t@example.com",
// 			department: "HR",
// 		},
// 	},
// ];

// each column of tickets will have a filter to get the relevant tickets
const columns: {
	title: string;
	titleColor: string;
	filterFunc: (ticket: TicketProps) => boolean;
	bgColor: string;
}[] = [
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
			ticket.deadline < new Date() &&
			ticket.status != "Resolved" &&
			ticket.status != "Closed",
		bgColor: "bg-rose-500/1",
	},
];

export function OpenTicketsPage() {
	// state holding array of tickets, initially empty array
	const [tickets, setTickets] = useState<TicketProps[]>([]);
	const [refresh, setRefresh] = useState(0); // state to trigger refresh when status changes

	// fetch the tickets from the backend
	useEffect(() => {
		fetch("/api/tickets")
			.then((res) => res.json())
			.then((data) => {
				const formattedTickets: TicketProps[] = data.map((ticket: any) => {
					return {
						...ticket,
						deadline: new Date(ticket.deadline),
						lastUpdated: new Date(ticket.lastUpdated),
					};
				});

				setTickets(formattedTickets);
			})
			.catch((err) => {
				console.error("Error retrieving tickets: ", err);
			});
	}, [refresh]);

	const triggerRefresh = () => {
		// increment refresh state by 1 to trigger useEffect to refetch tickets when ticket status is changed
		setRefresh((prev) => prev + 1);
	};

	return (
		<PageShell title="Open Tickets" description="View and manage open tickets.">
			<div className="bg-wise-canvas h-dvh w-dvw flex flex-col text-zinc-200">
				{/* Ticket Board */}
				<div className="bg-wise-canvas border border-zinc-700/20 rounded-xl h-full min-h-0 p-xl">
					<div className="text-xl font-semibold mb-4">Ticket Board</div>
					<div className="grid grid-cols-4 gap-4 justify-between h-full max-h-[90vh] min-h-0">
						{columns.map(({ title, titleColor, filterFunc, bgColor }) => {
							const filteredTickets: TicketProps[] = tickets.filter(filterFunc);

							return (
								<div
									key={title}
									className={`${bgColor} flex flex-1 flex-col border border-zinc-700/40 rounded-xl h-full min-h-0 pl-lg pr-lg`}
								>
									{/* Column Header */}
									<div
										className={`${titleColor} p-3 font-semibold text-lg w-full`}
									>
										{title} ({filteredTickets.length})
									</div>

									{/* Ticket cards */}
									<div className="flex flex-1 flex-col gap-y-4 overflow-y-auto">
										{filteredTickets.map((filteredTicket) => (
											<TicketCard
												key={filteredTicket.id}
												ticket={filteredTicket}
												onStatusChange={triggerRefresh}
											/>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</PageShell>
	);
}
