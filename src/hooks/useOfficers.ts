import { useState, useEffect } from "react";
import { apiFetch } from "../lib/apiFetch";
import { type HrOfficer } from "../types/HrOfficer";

export function useOfficers() {
	const [officers, setOfficers] = useState<HrOfficer[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	async function fetchOfficers() {
		try {
			setLoading(true);
			setError(null);
			const response = await apiFetch("/api/v1/users/");

			if (!response.ok) {
				throw new Error(`Error fetching officers: ${response.status}`);
			}

			const data = await response.json();
			const formattedOfficers: HrOfficer[] = data
				.filter((user: any) => user.role === "hr")
				.map((user: any) => ({
					id: user.user_id,
					name: user.full_name,
					email: user.email,
				}));

			setOfficers(formattedOfficers);
		} catch (err) {
			console.error("Failed to fetch officers: ", err);
			setError(err instanceof Error ? err : new Error("Failed to fetch officers"));
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchOfficers();
	}, []);

	return { officers, loading, error, refetch: fetchOfficers };
}