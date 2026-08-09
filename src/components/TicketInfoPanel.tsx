import type { HrOfficer } from "../types/HrOfficer";
import { formatDate } from "../types/Scholar";
import {
	categoryStyles,
	priorityLabels,
	priorityStyles,
	statusStyles,
	type TicketCategory,
	type TicketStatus,
} from "./TicketCard";

interface TicketInfo {
	code: string;
	status: TicketStatus;
	priority: number;
	category: TicketCategory;
	createdAt: string;
	deadline: string | null;
	lastUpdated: string;
	isEscalated: boolean;
}

interface TicketInfoPanelProps {
	ticket: TicketInfo;
	officer?: HrOfficer;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <>
            <dt className="text-xs font-medium text-dc-text-muted">{label}</dt>
            <dd className="text-sm text-dc-text dark:text-white">{children}</dd>
        </>
    );
}

export function TicketInfoPanel({ ticket, officer }: TicketInfoPanelProps) {
    const isOverdue =
        !!ticket.deadline &&
        new Date(ticket.deadline) < new Date() &&
        ticket.status !== "Resolved" &&
        ticket.status !== "Closed";

    return (
        <div className="flex flex-col p-5 gap-5">
            <span className="text-sm font-semibold text-dc-text dark:text-white">Ticket Information</span>

            <dl className="grid grid-cols-2 gap-y-4 gap-x-3">
                <InfoRow label="Code">
                    <span className="font-mono text-xs">{ticket.code}</span>
                </InfoRow>

                <InfoRow label="Status">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}>
                        {ticket.status}
                    </span>
                </InfoRow>

                <InfoRow label="Priority">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                        {priorityLabels[ticket.priority]}
                    </span>
                </InfoRow>

                <InfoRow label="Category">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${categoryStyles[ticket.category]}`}>
                        {ticket.category}
                    </span>
                </InfoRow>

                <InfoRow label="Created">
                    <span className="text-dc-text-muted text-xs">{formatDate(ticket.createdAt)}</span>
                </InfoRow>

                <InfoRow label="Due By">
                    <span className={`text-xs font-medium ${isOverdue ? "text-dc-error dark:text-dc-error-dark" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {formatDate(ticket.deadline) || "—"}
                    </span>
                </InfoRow>

                <InfoRow label="Last Updated">
                    <span className="text-dc-text-muted text-xs">{formatDate(ticket.lastUpdated)}</span>
                </InfoRow>

                <InfoRow label="Officer">
                    {officer ? (
                        <span className="font-medium">{officer.name}</span>
                    ) : (
                        <span className="text-dc-error dark:text-dc-error-dark font-medium">Unassigned</span>
                    )}
                </InfoRow>

                <InfoRow label="Escalated">
                    <span className={`text-xs font-semibold ${ticket.isEscalated ? "text-dc-error dark:text-dc-error-dark" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {ticket.isEscalated ? "Yes" : "No"}
                    </span>
                </InfoRow>
            </dl>
        </div>
    );
}
