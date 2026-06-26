import { useEffect, useState, useCallback } from "react";
import { type TicketProps } from "../components/TicketCard";
import { apiFetch } from "../lib/apiFetch";

export function useTickets(endpointUrl: string = "/api/v1/tickets") {
	const [tickets, setTickets] = useState<TicketProps[]>([]);
	const [refresh, setRefresh] = useState(0); // state to trigger refresh when status changes
	const [loading, setLoading] = useState<boolean>(true);

	const fetchTickets = useCallback(async () => {
		try {
			setLoading(true);

			const response = await apiFetch(endpointUrl)
			if (!response.ok) {
				throw new Error(`Error retrieving tickets: ${response.status}`);
			}
			const data = await response.json();
			const formattedTickets: TicketProps[] = data.tickets.map((ticket: any) => {
				return {
					id: ticket.ticket_id,
					code: ticket.ticket_code,
					title: ticket.subject,
					category: ticket.category.category_name,
					description: ticket.description,
					priority: ticket.priority.level,
					status: ticket.status.status_name,
					deadline: new Date(ticket.due_at),
					lastUpdated: new Date(ticket.updated_at),
					createdAt: new Date(ticket.created_at),
					isEscalated: ticket.is_escalated,
					scholar: {
						...ticket.scholar,
						studentId: ticket.scholar.student_id,
						yearOfStudy: ticket.scholar.year_of_study,
						preferredContact: ticket.scholar.preferred_contact,
						scholarshipType: ticket.scholar.scholarship_type,
						tickets: [],
					},
					officer: ticket.assigned_officer,
					attachments: data.attachments
						? data.attachments.map((attachment: any) => {
								return {
									...attachment,
									uploaded_at: new Date(attachment.uploaded_at),
								};
							})
						: [],
				};
			});

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
