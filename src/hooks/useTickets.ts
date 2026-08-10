import { useEffect, useState, useCallback } from "react";
import { type TicketProps, type TicketStatus } from "../components/TicketCard";
import { apiFetch } from "../lib/apiFetch";

// Helper function to normalize ticket status from API response to TicketStatus type
const STATUS_ALIASES: Record<string, TicketStatus> = {
	"Waiting for Response": "Waiting",
};

function normalizeStatus(raw: string): TicketStatus {
	return (STATUS_ALIASES[raw] ?? raw) as TicketStatus;
}

// Custom hook to fetch and manage tickets from the API
export function useTickets(endpointUrl: string = "/api/v1/tickets") {
	const [tickets, setTickets] = useState<TicketProps[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [refresh, setRefresh] = useState(0);

	const fetchTickets = useCallback(async () => {
		try {
			setLoading(true);

			const response = await apiFetch(endpointUrl);
			if (!response.ok) {
				throw new Error(`Error retrieving tickets: ${response.status}`);
			}
			const data = await response.json();
			const formattedTickets: TicketProps[] = data.tickets.map((ticket: any) => {
				return {
					id: ticket.ticket_id,
					code: ticket.ticket_code,
					title: ticket.subject,
					category: ticket.category?.category_name ?? "General Query",
					description: ticket.description,
					priority: ticket.priority?.level ?? 1,
					status: normalizeStatus(ticket.status?.status_name ?? "Open"),
					deadline: ticket.due_at,
					lastUpdated: ticket.updated_at,
					createdAt: ticket.created_at,
					isEscalated: ticket.is_escalated,
					scholar: ticket.scholar
						? {
								...ticket.scholar,
								studentId: ticket.scholar.student_id,
								yearOfStudy: ticket.scholar.year_of_study,
								preferredContact: ticket.scholar.preferred_contact,
								scholarshipType: ticket.scholar.scholarship_type,
								tickets: [],
							}
						: undefined,
					officer: ticket.assigned_officer,
					attachments: ticket.attachments ?? [],
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

	// Function to trigger a refresh of the tickets by incrementing the refresh state
	const triggerRefresh = () => {
		setRefresh((prev) => prev + 1);
	};

	return { tickets, triggerRefresh, loading };
}
