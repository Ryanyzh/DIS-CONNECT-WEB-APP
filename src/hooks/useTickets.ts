import { useEffect, useState, useCallback } from "react";
import { type TicketProps } from "../components/TicketCard";
import { getIdToken } from "../lib/authRepository";
import type { HrOfficer } from "../types/HrOfficer";

export function useTickets(endpointUrl: string = "/api/v1/tickets") {
	const [tickets, setTickets] = useState<TicketProps[]>([]);
	const [refresh, setRefresh] = useState(0); // state to trigger refresh when status changes
	const [loading, setLoading] = useState<boolean>(true);

	const fetchTickets = useCallback(async () => {
		try {
			setLoading(true);
			const idToken = await getIdToken();

			const response = await fetch(endpointUrl, {
				method: "GET",
				headers: {
					authorization: idToken ? `Bearer ${idToken}` : "",
				},
			});
			if (!response.ok) {
				throw new Error(`Error retrieving tickets: ${response.status}`);
			}
			const data = await response.json();
			const formattedTicketPromises: TicketProps[] = data.tickets.map(async (ticket: any) => {
				let formattedOfficer: HrOfficer | undefined = undefined;

				if (ticket.assigned_to != null) {
					const officerResponse = await fetch(`/api/v1/users/${ticket.assigned_to}`);

					if (!officerResponse.ok) {
						throw new Error(`Error retrieving officer: ${officerResponse.status}`);
					}

					const officerData = await officerResponse.json();
					formattedOfficer = {
						id: officerData.user_id,
						name: officerData.full_name,
						email: officerData.email,
					};
				}

				return {
					id: ticket.ticket_id,
					code: ticket.ticket_code,
					title: ticket.subject,
					tag: ticket.category.category_name,
					description: ticket.description,
					priority: ticket.priority.level,
					status: ticket.status.status_name,
					deadline: new Date(ticket.due_at),
					lastUpdated: new Date(ticket.updated_at),
					createdAt: new Date(ticket.created_at),
					officer: formattedOfficer,
				};
			});
			const formattedTickets: TicketProps[] = await Promise.all(formattedTicketPromises);
            setTickets(formattedTickets);
		} catch (err) {
			console.error("Error retrieving tickets: ", err);
		} finally {
			setLoading(false);
		}
	}, [endpointUrl]);

	useEffect(() => {
		fetchTickets();
	}, [fetchTickets, refresh]);

	const triggerRefresh = () => {
		// increment refresh state by 1 to trigger useEffect to refetch tickets when ticket status is changed
		setRefresh((prev) => prev + 1);
	};

	return { tickets, triggerRefresh, loading };
}
