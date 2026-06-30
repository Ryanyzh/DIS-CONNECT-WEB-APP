import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";

interface HistoryLog {
	action_id: string;
	action_type: string;
	message: string;
	officer_id: string;
	officer_name: string;
	created_at: Date;
}

export function ActivityTab({
	ticketId,
	refresh,
}: {
	ticketId: string | undefined;
	refresh: number;
}) {
	const [history, setHistory] = useState<HistoryLog[]>([]);
	const [activityLoading, setActivityLoading] = useState<boolean>(true);

	async function fetchHistory() {
		if (!ticketId) return;
		try {
			setActivityLoading(true);
			const response = await apiFetch(`/api/v1/tickets/${ticketId}/history`);
			if (!response.ok) throw new Error(`Error fetching ticket history: ${response.status}`);
			const data = await response.json();
			setHistory(
				data.history.map((log: HistoryLog) => ({
					...log,
					created_at: new Date(log.created_at),
				}))
			);
		} catch (error) {
			console.error("Error fetching ticket history: ", error);
		} finally {
			setActivityLoading(false);
		}
	}

	useEffect(() => {
		fetchHistory();
	}, [ticketId, refresh]);

	if (!ticketId) {
		return (
			<p className="text-sm text-dc-text-muted py-6 text-center">This ticket could not be found.</p>
		);
	}

	if (activityLoading) {
		return (
			<div className="flex items-center justify-center py-10">
				<div className="h-7 w-7 animate-spin rounded-full border-2 border-dc-border dark:border-dc-border-dark border-t-dc-primary" />
			</div>
		);
	}

	if (history.length === 0) {
		return (
			<p className="text-sm text-dc-text-muted py-6 text-center">No activity history found.</p>
		);
	}

	return (
		<div className="flex flex-col gap-3 py-2">
			{history.map((log) => {
				const isEscalated = log.action_type === "Escalated";
				return (
					<div key={log.action_id}>
						<div
							className={`flex flex-col rounded-xl rounded-tl-none p-3 border transition-colors ${
								isEscalated
									? "border-dc-error/30 dark:border-dc-error-dark/30 bg-rose-50 dark:bg-rose-500/10 text-dc-error dark:text-dc-error-dark"
									: "border-dc-border dark:border-dc-border-dark bg-dc-surface dark:bg-dc-surface-dark text-dc-text dark:text-white"
							}`}
						>
							<p className="text-sm leading-relaxed">{log.message}</p>
						</div>
						<span className="text-xs text-dc-text-muted mt-1 ml-1 block tracking-wide">
							By {log.officer_name} · {log.created_at.toLocaleString("en-SG")}
						</span>
					</div>
				);
			})}
		</div>
	);
}
