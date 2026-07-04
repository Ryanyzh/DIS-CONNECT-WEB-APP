import { useState, useEffect } from "react";
import { apiFetch } from "../lib/apiFetch";
import { type HrOfficer } from "../types/HrOfficer";
import type { TicketProps, TicketStatus } from "./TicketCard";

interface AssignModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticket: TicketProps;
	nextStatus: TicketStatus;
	onAction: (nextStatus: TicketStatus, metadata?: Record<string, any>) => Promise<void>;
}

export function AssignOfficerModal({
	isOpen,
	onClose,
	ticket,
	nextStatus,
	onAction,
}: AssignModalProps) {
	const [officers, setOfficers] = useState<HrOfficer[]>([]);
	const [officersLoading, setLoading] = useState<boolean>(true);
	const [assigning, setAssigning] = useState<boolean>(false);

	async function fetchOfficers() {
		try {
			setLoading(true);
			const response = await apiFetch("/api/v1/users/");

			if (!response.ok) {
				throw new Error(`Error fetching officers: ${response.status}`);
			}

			const data = await response.json();
			const formattedOfficers: HrOfficer[] = data
				.filter((user: any) => user.role == "hr")
				.map((user: any) => ({
					id: user.user_id,
					name: user.full_name,
					email: user.email,
				}));

			setOfficers(formattedOfficers);
		} catch (error) {
			console.error("Failed to fetch officers: ", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!isOpen) return;

		fetchOfficers();
	}, [isOpen]);

	async function selectOfficer(officerId: string) {
		try {
			setAssigning(true);

			if (!ticket.isEscalated) {
				await onAction(nextStatus, { action: "Assignment", assigned_to: officerId });
			} else {
                await onAction(nextStatus, { action: "Assignment", escalated_to: officerId });
            }


			onClose();
		} catch (error) {
			console.error("Failed to assign officer: ", error);
		} finally {
			setAssigning(false);
		}
	}

	if (!isOpen) return null;

	return (
		<div className="flex flex-col fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
			<div className="bg-wise-canvas flex flex-col w-full max-w-md border rounded-xl shadow-xl">
				<div className="p-4 flex flex-row justify-between items-center">
					<span className="font-semibold">Select Officer for Assignment</span>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-slate-600 text-lg leading-none"
					>
						&times;
					</button>
				</div>

				<div className="px-3 py-1 max-h-[50vh] overflow-y-auto flex flex-col gap-2">
					{officersLoading ? (
						<div className="flex flex-col items-center gap-3 p-4">
							<div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200 overflow-hidden" />
						</div>
					) : (
						officers.map((officer) => (
							<button
								key={officer.id}
								disabled={assigning}
								onClick={() => selectOfficer(officer.id)}
								className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all group disabled:opacity-50"
							>
								<div>
									<p className="text-sm">{officer.name}</p>
									<p className="text-xs text-zinc-400">{officer.email}</p>
								</div>

								<span className="text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
									Assign &rarr;
								</span>
							</button>
						))
					)}
				</div>
			</div>
		</div>
	);
}
