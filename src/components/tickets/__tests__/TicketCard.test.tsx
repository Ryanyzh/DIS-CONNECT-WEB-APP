import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TicketCard, { type TicketProps, type TicketStatus } from "../TicketCard";

import "@testing-library/jest-dom/vitest";
import { formatDate } from "../../../types/Scholar";

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
		deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
		lastUpdated: "2026-06-26T17:38:25.145519+00:00",
		createdAt: "2026-06-26T17:27:41.633798+00:00",
		isEscalated: false,
		escalatedAt: null,
		resolvedAt: null,
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
		render(<TicketCard ticket={baseTicket} view="list" />);

		expect(screen.getByText("TKT-2026-C6A06A")).toBeInTheDocument();
		expect(
			screen.getByText("Internship extension request — extra 4 weeks")
		).toBeInTheDocument();
		expect(screen.getByText("In Review")).toBeInTheDocument();
		expect(screen.getByText("Internship")).toBeInTheDocument();
		expect(screen.getByText("High")).toBeInTheDocument();
		expect(screen.getByText(formatDate(baseTicket.deadline))).toBeInTheDocument();
		expect(screen.getByText("Daniel Wong")).toBeInTheDocument();

		cleanup();

		render(<TicketCard ticket={baseTicket} view="card" />);

		expect(screen.getByText("TKT-2026-C6A06A")).toBeInTheDocument();
		expect(
			screen.getByText("Internship extension request — extra 4 weeks")
		).toBeInTheDocument();
		expect(screen.getByText("In Review")).toBeInTheDocument();
		expect(screen.getByText("Internship")).toBeInTheDocument();
		expect(screen.getByText("High")).toBeInTheDocument();
		expect(screen.getByText(`Due ${formatDate(baseTicket.deadline)}`)).toBeInTheDocument();
		expect(screen.getByText("Daniel Wong")).toBeInTheDocument();
	});

	it("navigates to the ticket details view route when the ticket card is clicked", () => {
		render(<TicketCard ticket={baseTicket} view="list" />);

		let cardContainer = screen.getByText(
			"Internship extension request — extra 4 weeks"
		).parentElement!;
		fireEvent.click(cardContainer);

		expect(mockNavigate).toHaveBeenCalledWith("/tickets/1943d175-dcb7-47cd-aa71-2b6b39654452");

		cleanup();

		render(<TicketCard ticket={baseTicket} view="card" />);

		cardContainer = screen.getByText(
			"Internship extension request — extra 4 weeks"
		).parentElement!;
		fireEvent.click(cardContainer);

		expect(mockNavigate).toHaveBeenCalledWith("/tickets/1943d175-dcb7-47cd-aa71-2b6b39654452");
	});

	it("displays coloured Unassigned text when no officer assignee is attached", () => {
		const unassignedTicket = { ...baseTicket, officer: undefined };
		render(<TicketCard ticket={unassignedTicket} />);

		const unassignedElement = screen.getByText("Unassigned");
		expect(unassignedElement).toBeInTheDocument();
		expect(unassignedElement).toHaveClass("text-dc-error dark:text-dc-error-dark");
	});

	it("applies text colouring to the assignee text if the ticket is escalated", () => {
		const escalatedTicket = { ...baseTicket, isEscalated: true };
		render(<TicketCard ticket={escalatedTicket} view="list" />);

		let assigneeElement = screen.getByText("Daniel Wong");
		expect(assigneeElement).toHaveClass("text-dc-error dark:text-dc-error-dark");

		cleanup();

		render(<TicketCard ticket={escalatedTicket} view="card" />);

		assigneeElement = screen.getByText("Daniel Wong");
		expect(assigneeElement).toHaveClass("text-dc-error dark:text-dc-error-dark");
	});

	it("applies text colouring to the deadline text if the ticket date is overdue", () => {
		const overdueTicket = {
			...baseTicket,
			deadline: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
		};
		render(<TicketCard ticket={overdueTicket} view="list" />);

		let deadlineElement = screen.getByText(`${formatDate(overdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-dc-error dark:text-dc-error-dark");

		cleanup();

		render(<TicketCard ticket={overdueTicket} view="card" />);

		deadlineElement = screen.getByText("Overdue");
		expect(deadlineElement).toHaveClass("text-orange-500 dark:text-orange-400");
	});

	it("keeps the standard text style for overdue deadlines if the status is Resolved or Closed", () => {
		const resolvedOverdueTicket = {
			...baseTicket,
			deadline: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
			status: "Resolved" as TicketStatus,
		};
		render(<TicketCard ticket={resolvedOverdueTicket} view="list" />);

		let deadlineElement = screen.getByText(`${formatDate(resolvedOverdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-dc-text-muted");
		expect(deadlineElement).not.toHaveClass("text-dc-error dark:text-dc-error-dark");

		cleanup();

		render(<TicketCard ticket={resolvedOverdueTicket} view="card" />);

		deadlineElement = screen.getByText(`Due ${formatDate(resolvedOverdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-dc-text-muted");
		expect(deadlineElement).not.toHaveClass("text-orange-500 dark:text-orange-400");

		cleanup(); // test for closed ticket next

		// previous ticket should not be on the screen now
		expect(
			screen.queryByText(`Due ${formatDate(resolvedOverdueTicket.deadline)}`)
		).not.toBeInTheDocument();

		const closedOverdueTicket = {
			...baseTicket,
			deadline: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
			status: "Closed" as TicketStatus,
		};
		render(<TicketCard ticket={closedOverdueTicket} view="list" />);

		deadlineElement = screen.getByText(`${formatDate(resolvedOverdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-dc-text-muted");
		expect(deadlineElement).not.toHaveClass("text-dc-error dark:text-dc-error-dark");

		cleanup();

		render(<TicketCard ticket={closedOverdueTicket} view="card" />);

		deadlineElement = screen.getByText(`Due ${formatDate(resolvedOverdueTicket.deadline)}`);
		expect(deadlineElement).toHaveClass("text-dc-text-muted");
		expect(deadlineElement).not.toHaveClass("text-orange-500 dark:text-orange-400");
	});

	it("handles a null deadline gracefully without crashing or rendering a due string", () => {
		const nullDeadlineTicket = { ...baseTicket, deadline: null };
		render(<TicketCard ticket={nullDeadlineTicket} view="list" />);

		// The component should display "-" in place of the due date for list view
		let deadlineSpan = screen.getByText("—");
		expect(deadlineSpan).toBeInTheDocument();

		cleanup();

		render(<TicketCard ticket={nullDeadlineTicket} view="card" />);

		deadlineSpan = screen.getByText("—");
		expect(deadlineSpan).toBeInTheDocument();
	});
});
