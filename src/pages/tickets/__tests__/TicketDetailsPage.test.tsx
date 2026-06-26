import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TicketDetailsPage } from "../TicketDetails";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// mock useRole hook
const mockUseRole = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useRole", () => ({
	useRole: mockUseRole,
}));

// mock firebase
vi.mock("../../../lib/firebase", async (importOriginal) => {
	const actual = await importOriginal<typeof import("../../../lib/firebase")>();
	return {
		...actual,
		storage: {},
	};
});

vi.mock("firebase/storage", () => {
	return {
		getStorage: vi.fn(),
		ref: vi.fn(() => ({})),
		getDownloadURL: vi.fn(() =>
			Promise.resolve(
				"https://firebasestorage.googleapis.com/v0/b/orbital-dis-connect.firebasestorage.app/o/tickets%2F64e57d1e-e7ce-4aa9-a163-b4604559c218%2FTesting%20Attachment%20(JPG)-7472B1ED-8D97-4031-B552-888EF0B14783.JPG?alt=media&token=34580a9d-87f5-4b2b-a236-8049872514d0"
			)
		),
	};
});

describe("TicketDetailsPage Integration Test", () => {
	const statusIdMap = {
		Resolved: "15d186e3-c9eb-5c97-8765-1da3093041a9",
		"In Review": "22a6d9cf-7356-55e3-b1c7-223b34bd0225",
		Escalated: "52YiKzCj6wkXszMAt8xn",
		"Waiting for Response": "c8b8f6f5-d021-5086-94c0-8aad835a92fe",
		Open: "e252e869-ceff-5a1f-987f-c781100eda4c",
		Closed: "ece14a06-c6fd-55e6-8017-1cad1c82d0ce",
	};

	const mockTicketDetails = {
		escalated_at: null,
		created_at: "2026-06-06T14:05:01.385264+00:00",
		is_escalated: false,
		scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		description:
			"I would like to submit my reimbursement claim for my flight ticket to Toronto for the NOC programme. I have attached the invoice and payment receipt. Could HR advise if the claim amount and supporting documents are sufficient?",
		due_at: null,
		subject: "Reimbursement claim for overseas exchange flight ticket",
		source: "mobile",
		ticket_id: "64e57d1e-e7ce-4aa9-a163-b4604559c218",
		closed_at: null,
		ticket_code: "TKT-2026-B0E7C1",
		escalated_to: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		updated_at: "2026-06-26T07:09:35.782367+00:00",
		resolved_at: null,
		status: {
			status_id: "22a6d9cf-7356-55e3-b1c7-223b34bd0225",
			status_name: "In Review",
			status_type: "active",
			is_closed: false,
		},
		priority: {
			priority_id: "420abc47-82f8-5267-acc2-737d0ed0739b",
			priority_name: "Medium",
			color_code: "#F59E0B",
			level: 2,
		},
		category: {
			category_id: "503b3a9a-fc71-5c51-83b9-f24ddf9725dc",
			category_name: "Reimbursement",
		},
		scholar: {
			id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
			name: "Ryan Tan",
			email: "ryan.tan@u.nus.edu",
			phone: "+65 9123 4567",
			createdAt: "2026-05-24T17:29:40.259379+00:00",
		},
		assigned_to: {
			id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
			name: "Daniel Wong",
			email: "daniel.wong@scholarhr.edu.sg",
		},
		attachments: [
			{
				attachment_id: "bcf4cb78-3759-4056-aa9d-a4cc7606ae15",
				file_name: "Testing Attachment (JPG)-7472B1ED-8D97-4031-B552-888EF0B14783.JPG",
				file_path:
					"tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218/Testing Attachment (JPG)-7472B1ED-8D97-4031-B552-888EF0B14783.JPG",
				file_type: "image/jpeg",
				file_size: 169938,
				uploaded_at: "2026-06-06T14:05:05.690380+00:00",
			},
		],
	};

	beforeEach(() => {
		mockUseRole.mockReturnValue({
			role: "hr",
			roleLoading: false,
		});

		vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
			const urlString = url.toString();

			if (urlString.includes("/api/v1/tickets/statuses")) {
				const mockStatusesResponse = Object.entries(statusIdMap).map(([name, id]) => ({
                    status_id: id,
                    status_name: name,
                }));

                return Promise.resolve(Response.json(mockStatusesResponse, { status: 200 }));
			}
			
			if (urlString.includes("XDRno5f0JAbAsOfV8WzbvQYxn253")) {
				return Promise.resolve(
					Response.json(
						{
							created_at: "2026-05-24T17:29:40.259379+00:00",
							is_active: true,
							updated_at: "2026-06-16T15:59:40.321086+00:00",
							user_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
							last_login_at: "2026-06-16T15:59:40.321086+00:00",
							email: "ryan.tan@u.nus.edu",
							avatar_url: null,
							full_name: "Ryan Tan",
							phone: "+65 9123 4567",
							role: "scholar",
						},
						{ status: 200 }
					)
				);
			}

			return Promise.resolve(Response.json(mockTicketDetails, { status: 200 }));
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("extracts ticket ID from route params, fetches ticket details, and displays ticket details and attachments, and opens attachment preview", async () => {
		const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);

		render(
			<MemoryRouter initialEntries={["/tickets/6ff67865-dfdf-486b-85ea-6e969ef5d705"]}>
				<Routes>
					<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
				</Routes>
			</MemoryRouter>
		);

		const ticketCode = await screen.findAllByText("TKT-2026-B0E7C1");
		expect(ticketCode[0]).toBeInTheDocument();

		// Scholar name
		expect(screen.getByText("Ryan Tan")).toBeInTheDocument();

		// Ticket description
		expect(
			screen.getByText(
				"I would like to submit my reimbursement claim for my flight ticket to Toronto for the NOC programme. I have attached the invoice and payment receipt. Could HR advise if the claim amount and supporting documents are sufficient?"
			)
		).toBeInTheDocument();

		// status and priority
		const ticketStatusElements = screen.getAllByText("In Review");
		expect(ticketStatusElements[0]).toBeInTheDocument();
		expect(ticketStatusElements[1]).toBeInTheDocument();
		const ticketPriorityElements = screen.getAllByText("Low Priority 2");
		expect(ticketPriorityElements[0]).toBeInTheDocument();
		expect(ticketPriorityElements[1]).toBeInTheDocument();

		// attachments
		const attachmentsTabButton = screen.getByRole("button", { name: /Attachments/ });
		fireEvent.click(attachmentsTabButton);

		// test attachment preview
		const attachment = await screen.findByRole("button", {
			name: /Testing Attachment \(JPG\)-7472B1ED-8D97-4031-B552-888EF0B14783\.JPG/i,
		});
		expect(attachment).toBeInTheDocument();
		fireEvent.click(attachment);

		await waitFor(() => {
			expect(windowOpenSpy).toHaveBeenCalledOnce();
		});

		expect(windowOpenSpy).toHaveBeenCalledWith(
			expect.stringMatching(/Testing.*Attachment.*7472B1ED-8D97-4031-B552-888EF0B14783/i),
			"_blank",
			"noopener,noreferrer"
		);

		windowOpenSpy.mockRestore();
	});

	it("displays action panel with action buttons when user is a HR officer", async () => {
		render(
			<MemoryRouter initialEntries={["/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218"]}>
				<Routes>
					<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
				</Routes>
			</MemoryRouter>
		);

		await waitFor(() => {
			const requestBtn = screen.getByRole("button", { name: /request/i });
			const resolveBtn = screen.getByRole("button", { name: /resolve/i });
			const escalateBtn = screen.getByRole("button", { name: /escalate/i });
			const reassignBtn = screen.getByRole("button", { name: /reassign/i });

			expect(requestBtn).toBeInTheDocument();
			expect(resolveBtn).toBeInTheDocument();
			expect(escalateBtn).toBeInTheDocument();
			expect(reassignBtn).toBeInTheDocument();

			// verify colours are correct
			expect(requestBtn).toHaveClass("bg-purple-600");
			expect(resolveBtn).toHaveClass("bg-emerald-600");
			expect(escalateBtn).toHaveClass("bg-rose-600");
			expect(reassignBtn).toHaveClass("bg-blue-600");
		});
	});

	it("hides the action panel when user is a scholar", async () => {
		// 1. Swap the hook to return a basic scholar session context
		mockUseRole.mockReturnValue({
			role: "scholar",
			roleLoading: false,
		});

		render(
			<MemoryRouter initialEntries={["/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218"]}>
				<Routes>
					<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
				</Routes>
			</MemoryRouter>
		);

		// wait for the ticket header text to confirm data is fetched
		await screen.findAllByText("TKT-2026-B0E7C1");

		// action buttons should not be there
		const requestBtn = screen.queryByRole("button", { name: /request/i });
		const resolveBtn = screen.queryByRole("button", { name: /resolve/i });
		const escalateBtn = screen.queryByRole("button", { name: /escalate/i });
		const reassignBtn = screen.queryByRole("button", { name: /reassign/i });

		expect(requestBtn).not.toBeInTheDocument();
		expect(resolveBtn).not.toBeInTheDocument();
		expect(escalateBtn).not.toBeInTheDocument();
		expect(reassignBtn).not.toBeInTheDocument();
	});

	it("calls backend to update ticket status when escalate button is clicked", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch");

		render(
			<MemoryRouter initialEntries={["/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218"]}>
				<Routes>
					<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
				</Routes>
			</MemoryRouter>
		);

		const escalateBtn = await screen.findByRole("button", { name: /escalate/i });
		expect(escalateBtn).toBeInTheDocument();
		fireEvent.click(escalateBtn);

		// check that a PATCH request was sent
		await waitFor(() => {
			const statusUpdateRequest = fetchSpy.mock.calls.find((call) =>
				call[0].toString().includes("/status") && call[1]?.method == "PATCH"
			);

			expect(statusUpdateRequest).toBeDefined();

			expect(statusUpdateRequest![0]).toContain(
				"/api/v1/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218/status"
			);

			expect(statusUpdateRequest![1]).toEqual(
				expect.objectContaining({
					method: "PATCH",
					body: expect.stringContaining(`"status_id":"${statusIdMap["Escalated"]}"`),
				})
			);
		});
	});
});
