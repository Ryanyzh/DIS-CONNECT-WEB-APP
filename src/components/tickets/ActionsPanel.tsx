import { useState } from "react";
import { getCurrentUser } from "../../lib/authRepository";
import type { TicketProps, TicketStatus } from "./TicketCard";
import { AssignOfficerModal } from "./AssignOfficerModal";

export type TicketActions = TicketStatus | "Assignment" | "De-escalate";

interface ActionsPanelProps {
	ticket: TicketProps;
	currentStatus: TicketStatus;
	onAction: (nextStatus: TicketStatus, metadata?: Record<string, any>) => Promise<void>;
}

interface ActionButtonProps {
	onClick: () => void;
	variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
	children: React.ReactNode;
}

const variantClasses: Record<ActionButtonProps["variant"], string> = {
	primary:   "btn-gradient text-white",
	secondary: "bg-dc-secondary hover:bg-dc-secondary-hover text-white",
	success:   "bg-emerald-600 hover:bg-emerald-700 text-white",
	warning:   "bg-amber-600 hover:bg-amber-700 text-white",
	danger:    "bg-dc-error hover:bg-red-700 text-white",
	info:      "bg-sky-600 hover:bg-sky-700 text-white",
	neutral:   "bg-dc-text hover:bg-dc-text/80 dark:bg-dc-border-dark dark:hover:bg-dc-border-dark/80 text-white",
};

function ActionButton({ onClick, variant, children }: ActionButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all ${variantClasses[variant]}`}
		>
			{children}
		</button>
	);
}

export function ActionsPanel({ ticket, currentStatus, onAction }: ActionsPanelProps) {
	const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

	return (
		<div className="w-full border-t border-dc-border dark:border-dc-border-dark p-4 flex flex-col gap-3">
			<span className="text-sm font-semibold text-dc-text dark:text-white">Actions</span>

			{currentStatus === "Open" && (
				<div className="flex flex-col gap-2.5">
					<ActionButton
						variant="neutral"
						onClick={() => onAction("In Review", { action: "Assignment", assigned_to: getCurrentUser()?.uid })}
					>
						Claim Ticket
					</ActionButton>
					<ActionButton variant="secondary" onClick={() => setIsAssignModalOpen(true)}>
						Assign Ticket
					</ActionButton>
					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						ticket={ticket}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}

			{currentStatus === "In Review" && (
				<div className="flex flex-col gap-2.5">
					<ActionButton variant="primary" onClick={() => onAction("Waiting", { action: "Waiting for Response" })}>
						Request Info
					</ActionButton>
					<ActionButton variant="success" onClick={() => onAction("Resolved", { action: "Resolved" })}>
						Resolve Ticket
					</ActionButton>
					{!ticket.isEscalated && (
						<ActionButton variant="danger" onClick={() => onAction("Escalated", { action: "Escalated" })}>
							Escalate Ticket
						</ActionButton>
					)}
					{ticket.isEscalated && (
						<ActionButton variant="info" onClick={() => onAction("In Review", { action: "De-escalate" })}>
							De-escalate
						</ActionButton>
					)}
					<ActionButton variant="secondary" onClick={() => setIsAssignModalOpen(true)}>
						Reassign Ticket
					</ActionButton>
					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						ticket={ticket}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}

			{currentStatus === "Waiting" && (
				<div className="flex flex-col gap-2.5">
					<ActionButton variant="warning" onClick={() => onAction("In Review", { action: "In Review" })}>
						Resume Review
					</ActionButton>
					<ActionButton variant="secondary" onClick={() => setIsAssignModalOpen(true)}>
						Reassign Ticket
					</ActionButton>
					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						ticket={ticket}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}

			{currentStatus === "Resolved" && (
				<div className="flex flex-col gap-2.5">
					<ActionButton variant="neutral" onClick={() => onAction("Closed", { action: "Closed" })}>
						Close Ticket
					</ActionButton>
					<ActionButton variant="warning" onClick={() => onAction("In Review", { action: "In Review" })}>
						Resume Review
					</ActionButton>
				</div>
			)}

			{currentStatus === "Closed" && (
				<p className="text-xs text-dc-text-muted italic text-center py-3 border border-dashed border-dc-border dark:border-dc-border-dark rounded-lg">
					This ticket has been closed. No actions available.
				</p>
			)}

			{currentStatus === "Escalated" && (
				<div className="flex flex-col gap-2.5">
					<ActionButton variant="danger" onClick={() => setIsAssignModalOpen(true)}>
						Reassign Ticket
					</ActionButton>
					<ActionButton variant="info" onClick={() => onAction("In Review", { action: "De-escalate" })}>
						De-escalate
					</ActionButton>
					<AssignOfficerModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
						ticket={ticket}
						nextStatus="In Review"
						onAction={onAction}
					/>
				</div>
			)}
		</div>
	);
}
