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

describe("TicketDetailsPage System Test", () => {
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
		escalated_to: null,
		updated_at: "2026-06-26T16:03:07.032347+00:00",
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
		scholar: {
			id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
			name: "Ryan Tan",
			email: "ryan.tan@u.nus.edu",
			phone: "+65 9123 4567",
			student_id: "A1234567N",
			faculty: "College of Design & Engineering",
			program: "Chemical Engineering",
			year_of_study: 2,
			preferred_contact: "phone",
			scholarship_type: "",
			status: "Active",
		},
		assigned_officer: {
			id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
			name: "Daniel Wong",
			email: "daniel.wong@scholarhr.edu.sg",
			role: "hr",
			initials: "DW",
		},
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
			const statusUpdateRequest = fetchSpy.mock.calls.find(
				(call) => call[0].toString().includes("/status") && call[1]?.method == "PATCH"
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

	it("displays an error popup when status update returns a 403 error", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options) => {
			const urlString = url.toString();

			// Intercept the PATCH status route and throw 403
			if (
				urlString.includes("/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218/status") &&
				options?.method === "PATCH"
			) {
				return new Response(null, { status: 403 });
			}

			// Return the correct status maps so "Escalated" status name can be resolved to a status id
			if (urlString.includes("/tickets/statuses")) {
				const mockStatusesResponse = Object.entries(statusIdMap).map(([name, id]) => ({
					status_id: id,
					status_name: name,
				}));
				return new Response(JSON.stringify(mockStatusesResponse), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}

			// Return mock ticket details
			return new Response(JSON.stringify(mockTicketDetails), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		});

		render(
			<MemoryRouter initialEntries={["/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218"]}>
				<Routes>
					<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
				</Routes>
			</MemoryRouter>
		);

		// Find and click the Escalate button
		const escalateBtn = await screen.findByRole("button", { name: /Escalate Ticket/i });
		fireEvent.click(escalateBtn);

		// Verify the error popup shows up
		const errorPopup = await screen.findByText(
			/Action denied: You are not the assigned officer/i
		);
		expect(errorPopup).toBeInTheDocument();

		// Find and click the close button
		const closeButton = screen.queryByRole("button", { name: /×/ }) || screen.getByText("×");
		fireEvent.click(closeButton);

		// Verify that the error popup is gone after clicking close button
		await waitFor(() => {
			expect(
				screen.queryByText(/Action denied: You are not the assigned officer/i)
			).not.toBeInTheDocument();
		});

		// Clean up global spy
		fetchSpy.mockRestore();
	});

	it("opens the assign officer modal, fetches HR officers, and assigns a new officer, verifying that a PATCH request with the new officer ID was sent", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options) => {
			const urlString = url.toString();

			// Mock the user endpoint to list users
			if (urlString.includes("/api/v1/users/")) {
				const mockUsers = [
					{
						created_at: "2026-06-27T19:22:01.200828+00:00",
						is_active: true,
						updated_at: "2026-06-27T19:22:01.200829+00:00",
						user_id: "Gmf6ccPwS2NOw1q0J7TmR9GEGZp2",
						last_login_at: "2026-06-27T19:32:34.510607+00:00",
						email: "chloe.lee@u.nus.edu",
						avatar_url: null,
						full_name: "Chloe Lee",
						phone: "+65 9456 7890",
						role: "scholar",
						preferred_contact: "email",
						scholarship_type: "PSC",
						scholar_id: "Gmf6ccPwS2NOw1q0J7TmR9GEGZp2",
						year_of_study: 2,
						faculty: "NUS Business School",
						program: "Accountancy",
						student_id: "A4567890B",
					},
					{
						created_at: "2026-06-20T08:55:00.583687+00:00",
						is_active: true,
						updated_at: "2026-06-20T08:55:00.583687+00:00",
						user_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
						last_login_at: "2026-07-01T19:38:26.460079+00:00",
						email: "daniel.wong@scholarhr.edu.sg",
						full_name: "Daniel Wong",
						avatar_url: null,
						phone: "+65 9234 5678",
						role: "hr",
						hr_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
						designation: "HR Officer",
						employee_id: "HR-2049",
						department_id: "DPT-01",
					},
					{
						created_at: "2026-06-20T09:00:56.738680+00:00",
						updated_at: "2026-06-20T09:00:56.738681+00:00",
						is_active: true,
						last_login_at: null,
						user_id: "RBQvtvCGm2PIbuMO2oL87hognGk2",
						email: "jason.lee@scholarhr.edu.sg",
						avatar_url: null,
						full_name: "Jason Lee",
						phone: "+65 9456 7890",
						role: "hr",
						hr_id: "RBQvtvCGm2PIbuMO2oL87hognGk2",
						designation: "Assistant HR Manager",
						employee_id: "HR-2051",
						department_id: "DPT-02",
					},
					{
						created_at: "2026-05-24T17:29:40.259383+00:00",
						is_active: true,
						updated_at: "2026-05-24T17:29:40.259384+00:00",
						user_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
						last_login_at: "2026-06-28T19:07:33.038939+00:00",
						email: "ryan.tan@u.nus.edu",
						avatar_url: null,
						full_name: "Ryan Tan",
						phone: "+65 9123 4567",
						role: "scholar",
						preferred_contact: "phone",
						scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
						year_of_study: 2,
						faculty: "College of Design & Engineering",
						student_id: "A1234567N",
						program: "Chemical Engineering",
					},
					{
						created_at: "2026-06-20T09:02:18.381959+00:00",
						is_active: true,
						updated_at: "2026-06-20T09:02:18.381959+00:00",
						user_id: "yUyM8PdgOzcPTvIfSPuEt8HOmm83",
						last_login_at: "2026-07-02T13:39:08.613782+00:00",
						email: "nicholas.chua@scholarhr.edu.sg",
						full_name: "Nicholas Chua",
						avatar_url: null,
						phone: "+65 9678 9012",
						role: "hr",
						hr_id: "yUyM8PdgOzcPTvIfSPuEt8HOmm83",
						designation: "Senior HR Manager",
						employee_id: "HR-2053",
						department_id: "DPT-03",
					},
				];
				return Response.json(mockUsers, { status: 200 });
			}

			// Mock the endpoint for updating ticket status
			if (
				urlString.includes("/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218/status") &&
				options?.method === "PATCH"
			) {
				return Response.json({ success: true }, { status: 200 });
			}

			// Return the correct status maps so "Escalated" status name can be resolved to a status id
			if (urlString.includes("/tickets/statuses")) {
				const mockStatusesResponse = Object.entries(statusIdMap).map(([name, id]) => ({
					status_id: id,
					status_name: name,
				}));
				return new Response(JSON.stringify(mockStatusesResponse), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}

			// Return mock ticket details
			return new Response(JSON.stringify(mockTicketDetails), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		});

		render(
			<MemoryRouter initialEntries={["/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218"]}>
				<Routes>
					<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
				</Routes>
			</MemoryRouter>
		);

		// Nicholas Chua (HR) should not be on the screen before any assignment
		const officer = screen.queryByText("Nicholas Chua");
		expect(officer).not.toBeInTheDocument();

		// Daniel Wong (HR) should be on the screen as he is the assigned officer
		const assignedOfficer = await screen.findAllByText("Daniel Wong");
		expect(assignedOfficer[0]).toBeInTheDocument();

		// Find the reassign button on the TicketDetailsPage Action Panel and click it
		const reassignBtn = await screen.findByRole("button", { name: /Reassign Ticket/i });
		fireEvent.click(reassignBtn);

		// Verify the modal heading appears
		const modalHeading = await screen.findByText("Select Officer for Assignment");
		expect(modalHeading).toBeInTheDocument();

		// Verify Nicholas Chua (HR) is visible in the modal selection list
		const officerCard = await screen.findByRole("button", { name: /Nicholas Chua/i });
		expect(officerCard).toBeInTheDocument();

		// Verify Chloe Lee (Scholar) was successfully filtered out and is not in the modal
		expect(screen.queryByText("Chloe Lee")).not.toBeInTheDocument();

		// Click Nicholas's card to assign him
		fireEvent.click(officerCard);

		// The modal should dismiss itself upon successful assignment and the ticket details should be on screen again
		await waitFor(() => {
			expect(screen.queryByText("Select Officer for Assignment")).not.toBeInTheDocument();
			expect(
				screen.getByText("Reimbursement claim for overseas exchange flight ticket")
			).toBeInTheDocument();
		});

		// Check that the backend api endpoint was called with the correct payload details
		const assignmentRequest = fetchSpy.mock.calls.find(
			(call) =>
				call[0]
					.toString()
					.includes("/tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218/status") &&
				call[1]?.method === "PATCH"
		);
		expect(assignmentRequest).toBeDefined();

		// Verify that the payload contains the selected officer id inside the request body string
		expect(assignmentRequest![1]?.body).toContain("yUyM8PdgOzcPTvIfSPuEt8HOmm83");

		fetchSpy.mockRestore();
	});
});
