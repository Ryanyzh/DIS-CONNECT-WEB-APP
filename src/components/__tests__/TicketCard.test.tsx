import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TicketCard, { type TicketProps, type TicketStatus } from "../TicketCard";

import "@testing-library/jest-dom/vitest";
import { formatDate } from "../../types/Scholar";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// Mock react-router-dom's useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
	useNavigate: () => mockNavigate,
}));

// Mock the formatDate utility from Scholar types so it returns predictable strings
vi.mock("../types/Scholar", () => ({
	formatDate: (dateStr: string | null) => (dateStr ? `FORMATTED-${dateStr}` : ""),
}));

describe("TicketCard Unit Tests", () => {
	// mock ticket
	const baseTicket: TicketProps = {
		id: "1943d175-dcb7-47cd-aa71-2b6b39654452",
		code: "TKT-2026-C6A06A",
		title: "Internship extension request — extra 4 weeks",
		category: "Internship",
		description:
			"Company has requested I extend my internship by 4 weeks to complete a project handover. Need approval before informing HR.",
		priority: 3,
		status: "In Review",
		deadline: "2026-07-31T00:00:00+00:00",
		lastUpdated: "2026-06-26T17:38:25.145519+00:00",
		createdAt: "2026-06-26T17:27:41.633798+00:00",
		isEscalated: false,
		attachments: [],
		officer: {
			id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
			name: "Daniel Wong",
			email: "daniel.wong@scholarhr.edu.sg",
			role: "hr",
			initials: "DW",
		},
		scholar: {
			id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
			name: "Ryan Tan",
			email: "ryan.tan@u.nus.edu",
			phone: "+65 9123 4567",
			faculty: "College of Design & Engineering",
			program: "Chemical Engineering",
			status: "Active",
			studentId: "A1234567N",
			yearOfStudy: "2",
			preferredContact: "Phone",
			scholarshipType: "",
			tickets: [],
			createdAt: "2026-06-26T17:27:41.633798+00:00",
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders ticket information, correctly mapping props to text elements", () => {
		render(<TicketCard ticket={baseTicket} />);

		expect(screen.getByText("TKT-2026-C6A06A")).toBeInTheDocument();
		expect(screen.getByText("Internship extension request — extra 4 weeks")).toBeInTheDocument();
		expect(screen.getByText("In Review")).toBeInTheDocument();
		expect(screen.getByText("Internship")).toBeInTheDocument();
		expect(screen.getByText("Low Priority 3")).toBeInTheDocument();
		expect(screen.getByText("Last updated: 27 Jun 2026")).toBeInTheDocument();
		expect(screen.getByText("Due by: 31 Jul 2026")).toBeInTheDocument();
        expect(screen.getByText("Assigned to: Daniel Wong")).toBeInTheDocument();
	});

	it("navigates to the ticket details view route when the ticket card is clicked", () => {
		render(<TicketCard ticket={baseTicket} />);

		const cardContainer = screen.getByText("Internship extension request — extra 4 weeks").parentElement!;
		fireEvent.click(cardContainer);

		expect(mockNavigate).toHaveBeenCalledWith("/tickets/1943d175-dcb7-47cd-aa71-2b6b39654452");
	});

	it("displays pink Unassigned text when no officer assignee is attached", () => {
		const unassignedTicket = { ...baseTicket, officer: undefined };
		render(<TicketCard ticket={unassignedTicket} />);

		const unassignedElement = screen.getByText("Unassigned");
		expect(unassignedElement).toBeInTheDocument();
		expect(unassignedElement).toHaveClass("text-pink-400");
	});

	it("applies the text-rose-500 style to the assignee text if the ticket is escalated", () => {
		const escalatedTicket = { ...baseTicket, isEscalated: true };
		render(<TicketCard ticket={escalatedTicket} />);

		const assigneeElement = screen.getByText("Assigned to: Daniel Wong");
		expect(assigneeElement).toHaveClass("text-rose-500");
	});

	it("applies the text-rose-500 style to the deadline text if the ticket date is overdue", () => {
		const overdueTicket = {
			...baseTicket,
			deadline: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
		};
		render(<TicketCard ticket={overdueTicket} />);

		const deadlineElement = screen.getByText(`Due by: ${formatDate(overdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-rose-500");
	});

	it("keeps the standard text-zinc-400 style for overdue deadlines if the status is Resolved or Closed", () => {
		const resolvedOverdueTicket = {
			...baseTicket,
			deadline: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
			status: "Resolved" as TicketStatus,
		};
		render(<TicketCard ticket={resolvedOverdueTicket} />);

		let deadlineElement = screen.getByText(`Due by: ${formatDate(resolvedOverdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-zinc-400");
		expect(deadlineElement).not.toHaveClass("text-rose-500");

        cleanup(); // cleanup previous render to test for closed ticket next

        // previous ticket should not be on the screen now
        expect(screen.queryByText(`Due by: ${formatDate(resolvedOverdueTicket.deadline)}`)).not.toBeInTheDocument();

        const closedOverdueTicket = {
			...baseTicket,
			deadline: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
			status: "Closed" as TicketStatus,
		};
		render(<TicketCard ticket={closedOverdueTicket} />);

		deadlineElement = screen.getByText(`Due by: ${formatDate(closedOverdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-zinc-400");
		expect(deadlineElement).not.toHaveClass("text-rose-500");
	});

	it("handles a null deadline gracefully without crashing or rendering a due string", () => {
		const nullDeadlineTicket = { ...baseTicket, deadline: null };
		render(<TicketCard ticket={nullDeadlineTicket} />);

		// The component shouldn't display any "Due by:" text if formatDate returns empty string
		const deadlineSpan = screen.queryByText(/Due by:/);
		expect(deadlineSpan).not.toBeInTheDocument();
	});
});
