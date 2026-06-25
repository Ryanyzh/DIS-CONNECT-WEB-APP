import { useState, useEffect } from "react";
import { apiFetch } from "../lib/apiFetch";

/**
 * Fetches ticket_statuses from the backend and returns a map of
 * status_name → status_id for use in PATCH /tickets/:id/status calls.
 */
export function useStatuses(): Record<string, string> {
	const [statusIdMap, setStatusIdMap] = useState<Record<string, string>>({});

	useEffect(() => {
		apiFetch("/api/v1/tickets/statuses")
			.then((res) => res.json())
			.then((data: { status_id: string; status_name: string }[]) => {
				const map: Record<string, string> = {};
				for (const s of data) {
					map[s.status_name] = s.status_id;
				}
				setStatusIdMap(map);
			})
			.catch((err) => console.error("Failed to load statuses:", err));
	}, []);

	return statusIdMap;
}
