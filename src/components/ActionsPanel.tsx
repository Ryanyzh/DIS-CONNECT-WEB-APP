import { useState } from "react";
import { getCurrentUser } from "../lib/authRepository";
import type { TicketProps, TicketStatus } from "./TicketCard";
import { AssignOfficerModal } from "./AssignOfficerModal";

interface ActionsPanelProps {
	ticket: TicketProps;
	currentStatus: TicketStatus;
	onAction: (nextStatus: TicketStatus, metadata?: Record<string, any>) => Promise<void>;
}

export function ActionsPanel({ ticket, currentStatus, onAction }: ActionsPanelProps) {
	const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

	return (
		<div className="w-full border-t rounded-lg rounded-t-none p-4 bg-wise-canvas flex flex-col gap-4 shadow-sm">
			<span className="font-semibold">Actions</span>

			{currentStatus == "Open" && (
				<div className="flex flex-col gap-4">
					<button
						onClick={() =>
							onAction("In Review", { assigned_to: getCurrentUser()?.uid })
						}
						className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-all"
					>
						Claim Ticket
					</button>

					<button
						onClick={() => setIsAssignModalOpen(true)}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
					>
						Assign Ticket
					</button>

					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}

			{currentStatus == "In Review" && (
				<div className="flex flex-col gap-4">
					<button
						onClick={() => onAction("Waiting for Response")}
						className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all"
					>
						Request Info
					</button>
					<button
						onClick={() => onAction("Resolved")}
						className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all"
					>
						Resolve Ticket
					</button>
					<button
						onClick={() => onAction("Escalated")}
						className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-all"
					>
						Escalate Ticket
					</button>

					<button
						onClick={() => setIsAssignModalOpen(true)}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
					>
						Reassign Ticket
					</button>

					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}

			{currentStatus == "Waiting for Response" && (
				<div className="flex flex-col gap-4">
					<button
						onClick={() => onAction("In Review")}
						className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-all"
					>
						Resume Review
					</button>

					<button
						onClick={() => setIsAssignModalOpen(true)}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
					>
						Reassign Ticket
					</button>

					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}

			{currentStatus == "Resolved" && (
				<div className="flex flex-col gap-4">
					<button
						onClick={() => onAction("Closed")}
						className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-all"
					>
						Close Ticket
					</button>
					<button
						onClick={() => onAction("In Review")}
						className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-all"
					>
						Resume Review
					</button>
				</div>
			)}

			{currentStatus == "Closed" && (
				<p className="text-sm text-gray-400 italic text-center py-2 border border-dashed rounded-lg">
					This ticket has been closed. No actions available.
				</p>
			)}

			{currentStatus == "Escalated" && (
				<div className="flex flex-col gap-4">
					<button
						onClick={() => setIsAssignModalOpen(true)}
						className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-all"
					>
						Reassign Ticket
					</button>

					<button
						onClick={() => onAction("In Review", { action: "De-escalate" })}
						className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-all"
					>
						De-escalate
					</button>

					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}
		</div>
	);
}
