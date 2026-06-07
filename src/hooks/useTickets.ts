import { useEffect, useState, useCallback } from "react";
import { type TicketProps } from "../components/TicketCard"
import { getIdToken } from "../lib/authRepository";

export function useTickets(endpointUrl: string = "/api/v1/tickets") {
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [refresh, setRefresh] = useState(0); // state to trigger refresh when status changes

    const fetchTickets = useCallback(async () => {
        try {
            const idToken = await getIdToken();

            const response = await fetch(endpointUrl, {
                method: "GET",
                headers: {
                    "Authorization": idToken ? `Bearer ${idToken}` : "",
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`Error retrieving tickets: ${response.status}`)
            }
            const data = await response.json();
            const formattedTickets: TicketProps[] = data.tickets.map((ticket: any) => {
                return {
                    ...ticket,
                    deadline: new Date(ticket.deadline),
                    lastUpdated: new Date(ticket.lastUpdated)
                }
            })
            setTickets(formattedTickets);
        } catch (err) {
            console.error("Error retrieving tickets: ", err);
        }
    }, [endpointUrl]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets, refresh]);

    const triggerRefresh = () => {
        // increment refresh state by 1 to trigger useEffect to refetch tickets when ticket status is changed
        setRefresh((prev) => prev + 1);
    }

    return { tickets, triggerRefresh };
}