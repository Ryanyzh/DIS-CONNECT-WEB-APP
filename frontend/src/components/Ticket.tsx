// ticket lifecycle
export type TicketStatus =
  | "Open"
  | "In Review"
  | "Waiting for Response"
  | "Resolved"
  | "Closed";

// ticket tags
export type TicketTag =
  | "Reimbursement"
  | "Exchange"
  | "Policy"
  | "Finance"
  | "General Query";

// A HrOfficer object, represents a HR officer in the system, can contain info like name, email, etc.
export interface HrOfficer {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string; // optional field for profile picture
}

// fields that a ticket will have when created
export interface TicketProps {
  id: string; // ticket id in the form of {Tag}-{year of deadline}-{numerical id (number of tickets created in that year with that tag)}
  title: string;
  tag: TicketTag;
  description: string; // description of the issue
  priority: number; // priority of the ticket, higher number means higher priority (e.g. 1-5, 1 = very low priority, 5 = very high priority)
  status: TicketStatus;
  deadline: Date; // deadline for resolving the ticket, can be used to compute "days until deadline/days overdue", maybe can also be used to compute priority
  lastUpdated: Date;
  officer: HrOfficer; // the HR officer assigned to the ticket
}

function Ticket({ ticket }: {ticket: TicketProps} ) {
  return (
    <div>
      {/* Ticket ID */}
      <div>
        <span>
          {ticket.id}
        </span>
      </div>

      {/* Ticket title */}
      <h3>
        {ticket.title}
      </h3>

      {/* Ticket tag */}
      <div>
        <span>
          {ticket.tag}
        </span>
      </div>

      {/* Assigned Officer and last updated */}
      <div>
        <div>
          <span>
            {ticket.officer.name}
          </span>
        </div>
        <span>
          last updated: {ticket.lastUpdated.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default Ticket;
