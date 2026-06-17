import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TicketDetailsPage } from "../TicketDetails";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

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
				"https://firebasestorage.googleapis.com/v0/b/orbital-dis-connect.firebasestorage.app/o/tickets%2F6ff67865-dfdf-486b-85ea-6e969ef5d705%2Fnew-C6856264-0ECF-4C65-8DC0-FA86502FBF87.PNG?alt=media&token=54443b42-6bac-40e8-a113-b4dcc767b799"
			)
		),
	};
});

describe("TicketDetailsPage Integration Test", () => {
	const mockTicketDetails = {
		escalated_at: null,
		created_at: "2026-06-07T14:34:14.132781+00:00",
		is_escalated: false,
		scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		description:
			"Enquiry regarding the process and implications of changing major from Computer Science to Business Administration",
		due_at: null,
		escalated_to: null,
		assigned_to: null,
		source: "mobile",
		ticket_id: "6ff67865-dfdf-486b-85ea-6e969ef5d705",
		closed_at: null,
		subject: "Enquiry regarding major change",
		updated_at: "2026-06-07T14:34:14.132781+00:00",
		ticket_code: "TKT-2026-500E17",
		resolved_at: null,
		status: {
			status_id: "22a6d9cf-7356-55e3-b1c7-223b34bd0225",
			status_name: "In Review",
			status_type: "active",
			is_closed: false,
		},
		priority: {
			priority_id: "f1b9f4e8-4723-50b5-92ae-ddd8d5b929db",
			priority_name: "High",
			color_code: "#EF4444",
			level: 3,
		},
		category: {
			category_id: "4308c61a-353f-5c6c-b09c-830cbe0cb101",
			category_name: "Policy",
		},
		attachments: [
			{
				attachment_id: "986a5517-9220-4fdb-a641-4f9161a8be8b",
				file_name: "new-C6856264-0ECF-4C65-8DC0-FA86502FBF87.PNG",
				file_path:
					"tickets/6ff67865-dfdf-486b-85ea-6e969ef5d705/new-C6856264-0ECF-4C65-8DC0-FA86502FBF87.PNG",
				file_type: "image/png",
				file_size: 798456,
				uploaded_at: "2026-06-07T14:34:18.613134+00:00",
			},
		],
	};

	beforeEach(() => {
		vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
			const urlString = url.toString();

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

		const ticketCode = await screen.findByText("TKT-2026-500E17");
		expect(ticketCode).toBeInTheDocument();

		// Scholar name
		expect(screen.getByText("Ryan Tan")).toBeInTheDocument();

		// Ticket description
		expect(
			screen.getByText(
				"Enquiry regarding the process and implications of changing major from Computer Science to Business Administration"
			)
		).toBeInTheDocument();

		// status and priority
		expect(screen.getByText("In Review")).toBeInTheDocument();
		expect(screen.getByText("Low Priority 3")).toBeInTheDocument();

		// attachments
		const attachmentsTabButton = screen.getByRole("button", { name: /Attachments/ });
		fireEvent.click(attachmentsTabButton);

		// test attachment preview
		const attachment = await screen.findByRole("button", {
			name: /new-C6856264-0ECF-4C65-8DC0-FA86502FBF87.PNG/,
		});
		expect(attachment).toBeInTheDocument();
		fireEvent.click(attachment);

		await waitFor(() => {
			expect(windowOpenSpy).toHaveBeenCalledOnce();
		});

		expect(windowOpenSpy).toHaveBeenCalledWith(
			expect.stringContaining("new-C6856264-0ECF-4C65-8DC0-FA86502FBF87.PNG"),
			"_blank",
			"noopener,noreferrer"
		);

		windowOpenSpy.mockRestore();
	});
});
