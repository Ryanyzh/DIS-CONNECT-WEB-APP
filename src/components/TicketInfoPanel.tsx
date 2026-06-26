import type { HrOfficer } from "../types/HrOfficer";
import { formatDate } from "../types/Scholar";
import { categoryStyles, priorityLabels, priorityStyles, statusStyles, type TicketCategory, type TicketStatus } from "./TicketCard";


interface TicketInfo {
    code: string;
    status: TicketStatus;
    priority: number;
    category: TicketCategory;
    createdAt: string;
    deadline: string;
    lastUpdated: string;
    isEscalated: boolean;
}

interface TicketInfoPanelProps {
    ticket: TicketInfo;
    officer?: HrOfficer;
}

export function TicketInfoPanel({ ticket, officer }: TicketInfoPanelProps) {
	const isOverdue =
		new Date(ticket.deadline) < new Date() && ticket.status !== "Resolved" && ticket.status !== "Closed";
    
    return (
		<div className="flex flex-col p-4 gap-4">
			<span className="font-semibold">Ticket Information</span>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <div>Ticket Code</div>
                <div>{ticket.code}</div>

                <div>Status</div>
                <div className={`w-fit px-1.5 py-1 rounded-md font-semibold ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}>{ticket.status}</div>

                <div>Priority</div>
                <div className={`w-fit px-1.5 py-1 rounded-md font-semibold ${priorityStyles[ticket.priority]}`}>{priorityLabels[ticket.priority]}</div>

                <div>Category</div>
                <div className={`w-fit px-1.5 py-1 rounded-md font-semibold ${categoryStyles[ticket.category]}`}>{ticket.category}</div>

                <div>Created At</div>
                <div>{formatDate(ticket.createdAt)}</div>
                
                <div>Due By</div>
                <div className={`${isOverdue ? "text-rose-500" : "text-green-500"}`}>{formatDate(ticket.deadline)}</div>

                <div>Last Updated</div>
                <div>{formatDate(ticket.lastUpdated)}</div>

                <div>Assigned Officer</div>
                <div className={`${officer ? "text-black" : "text-pink-400"}`}>{officer ? officer.name : "Unassigned"}</div>

                <div>Escalated</div>
                <div className={`${ticket.isEscalated ? "text-rose-500" : "text-green-500"}`}>{ticket.isEscalated ? "Yes" : "No"}</div>
            </div>
		</div>
	);
}
