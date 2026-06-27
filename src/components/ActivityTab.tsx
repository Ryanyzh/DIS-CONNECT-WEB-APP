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
	if (!ticketId) {
		return (
			<div className="bg-wise-canvas h-full w-full flex flex-col gap-4 p-6 text-3xl font-semibold">
				<span className="text-center">This ticket could not be found.</span>
			</div>
		);
	}

	const [history, setHistory] = useState<HistoryLog[]>([]);
	const [activityLoading, setActivityLoading] = useState<boolean>(true);

	async function fetchHistory() {
		try {
			setActivityLoading(true);

			const response = await apiFetch(`/api/v1/tickets/${ticketId}/history`)

			if (!response.ok) {
				throw new Error(`Error fetching ticket history: ${response.status}`);
			}

			const data = await response.json();
			const formattedData = data.history.map((log: HistoryLog) => {
				return {
					...log,
					created_at: new Date(log.created_at),
				};
			});

			setHistory(formattedData);
		} catch (error) {
			console.error("Error fetching ticket history: ", error);
		} finally {
			setActivityLoading(false);
		}
	}

	useEffect(() => {
		fetchHistory();
	}, [ticketId, refresh]);

	if (activityLoading) {
		return (
			<div className="bg-wise-canvas h-full w-full flex flex-col items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
				</div>
			</div>
		);
	}

	if (history.length == 0) {
		return (
			<div className="bg-wise-canvas h-full w-full flex flex-col gap-4 p-6 text-3xl font-semibold">
				<span className="text-center">No activity history found.</span>
			</div>
		);
	}

	return (
		<div className="bg-wise-canvas h-full w-full flex flex-col items-center justify-center">
			<div className="px-10 py-4 rounded-lg h-[22vw] w-full flex flex-col gap-4 overflow-y-auto">
				{history.map((log) => (
					<div key={log.action_id}>
						<div className={`flex flex-col border ${log.action_type == "Escalated" ? "border-rose-200 hover:border-rose-300 text-rose-500" : "border-slate-200 hover:border-slate-300 text-slate-800"} rounded-2xl rounded-tl-none p-3 shadow-sm transition-all self-start`}>
							<p className="text-sm">{log.message}</p>
						</div>

						<span className="text-xs text-slate-400 mt-1 ml-1 tracking-wide">
							By {log.officer_name} at {log.created_at.toLocaleString("en-SG")}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
