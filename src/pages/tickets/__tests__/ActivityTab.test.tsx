import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../lib/apiFetch";
import { render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom/vitest";
import { ActivityTab } from "../../../components/tickets/ActivityTab";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// mock apiFetch so it doesn't actually send real network requests
vi.mock("../../../lib/apiFetch", () => ({
	apiFetch: vi.fn(),
}));

const mockHistory = {
	history: [
		{
			created_at: "2026-06-23T03:15:56.553904+00:00",
			action_type: "assignment",
			message: "Ticket assigned to Daniel Wong",
			action_id: "d70eebce-9479-475a-a389-a61048b8907c",
			officer_name: "Daniel Wong",
			officer_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		},
		{
			created_at: "2026-06-23T03:16:01.902352+00:00",
			action_type: "Escalated",
			message: "Ticket status updated from 'In Review' to 'Escalated'",
			action_id: "6d75c21a-682e-4be0-aa77-ea49c8955bbd",
			officer_name: "Daniel Wong",
			officer_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		},
	],
};

describe("Activity Tab Integration Test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("displays the activity history of the ticket correctly", async () => {
		(apiFetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockHistory,
		});

		render(<ActivityTab ticketId="ticket1" refresh={0} />);

		// wait for activity logs
		await waitFor(() => {
			expect(screen.getByText("Ticket assigned to Daniel Wong")).toBeInTheDocument();
			expect(
				screen.getByText("Ticket status updated from 'In Review' to 'Escalated'")
			).toBeInTheDocument();
			expect(
				screen.getByText("By Daniel Wong · 23/06/2026, 11:15:56 am")
			).toBeInTheDocument();
			expect(
				screen.getByText("By Daniel Wong · 23/06/2026, 11:16:01 am")
			).toBeInTheDocument();
		});
	});

	it("applies distinct border styling to escalated action vs normal actions", async () => {
		(apiFetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockHistory,
		});

		render(<ActivityTab ticketId="ticket2" refresh={0} />);

		await waitFor(() => {
			const escalatedAction = screen.getByText(
				"Ticket status updated from 'In Review' to 'Escalated'"
			);
			const normalAction = screen.getByText("Ticket assigned to Daniel Wong");

			const escalatedBubble = escalatedAction.closest("div");
			const normalBubble = normalAction.closest("div");

			expect(escalatedBubble).toHaveClass("border-dc-error/30 dark:border-dc-error-dark/30 bg-rose-50 dark:bg-rose-500/10 text-dc-error dark:text-dc-error-dark");
			expect(normalBubble).toHaveClass("border-dc-border dark:border-dc-border-dark bg-dc-surface dark:bg-dc-surface-dark text-dc-text dark:text-white");
		});
	});

	it("displays empty activity history correctly as 'No activity history found.'", async () => {
		(apiFetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ history: [] }),
		});

		render(<ActivityTab ticketId="ticket3" refresh={0} />);

		await waitFor(() => {
			expect(screen.getByText("No activity history found.")).toBeInTheDocument();
		});
	});
});
