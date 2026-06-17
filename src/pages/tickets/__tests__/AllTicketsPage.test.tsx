import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AllTicketsPage } from "../AllTickets";
import { MemoryRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

describe("AllTicketsPage Integration Test", () => {
	const mockTickets = {
		tickets: [
			{
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
			},
			{
				escalated_at: null,
				created_at: "2026-06-07T14:26:11.747572+00:00",
				is_escalated: false,
				scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
				description:
					"Requesting reimbursement for hostel fees for Year 1 Semester 1 - Resubmission after rejection",
				due_at: null,
				escalated_to: null,
				assigned_to: null,
				source: "mobile",
				ticket_id: "aa765f16-f5e3-43e8-88c5-370e4cd9ce96",
				closed_at: null,
				subject: "Hostel Reimbursement Resubmission",
				updated_at: "2026-06-07T14:26:11.747573+00:00",
				ticket_code: "TKT-2026-31791D",
				resolved_at: null,
				status: {
					status_id: "22a6d9cf-7356-55e3-b1c7-223b34bd0225",
					status_name: "In Review",
					status_type: "active",
					is_closed: false,
				},
				priority: {
					priority_id: "c17adf18-56fb-5686-84ba-52a3c37ea9e1",
					priority_name: "Low",
					color_code: "#22C55E",
					level: 1,
				},
				category: {
					category_id: "503b3a9a-fc71-5c51-83b9-f24ddf9725dc",
					category_name: "Reimbursement",
				},
				attachments: [],
			},
			{
				escalated_at: null,
				created_at: "2026-06-06T14:05:01.385264+00:00",
				is_escalated: false,
				scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
				description:
					"I would like to submit my reimbursement claim for my flight ticket to Toronto for the NOC programme. I have attached the invoice and payment receipt. Could HR advise if the claim amount and supporting documents are sufficient?",
				due_at: null,
				escalated_to: null,
				assigned_to: null,
				source: "mobile",
				ticket_id: "64e57d1e-e7ce-4aa9-a163-b4604559c218",
				closed_at: null,
				updated_at: "2026-06-06T14:05:01.385265+00:00",
				subject: "Reimbursement claim for overseas exchange flight ticket",
				ticket_code: "TKT-2026-B0E7C1",
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
						file_name:
							"Testing Attachment (JPG)-7472B1ED-8D97-4031-B552-888EF0B14783.JPG",
						file_path:
							"tickets/64e57d1e-e7ce-4aa9-a163-b4604559c218/Testing Attachment (JPG)-7472B1ED-8D97-4031-B552-888EF0B14783.JPG",
						file_type: "image/jpeg",
						file_size: 169938,
						uploaded_at: "2026-06-06T14:05:05.690380+00:00",
					},
				],
			},
		],
	};

	beforeEach(() => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			Response.json(mockTickets, { status: 200 })
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("displays tickets on the screen", async () => {
		render(
			<MemoryRouter>
				<AllTicketsPage />
			</MemoryRouter>
		);

		const firstTicket = await screen.findByText("TKT-2026-500E17");
		expect(firstTicket).toBeInTheDocument();

		expect(screen.getByText("Enquiry regarding major change")).toBeInTheDocument();
		expect(
			screen.getByText("Reimbursement claim for overseas exchange flight ticket")
		).toBeInTheDocument();
		expect(screen.getByText("Hostel Reimbursement Resubmission")).toBeInTheDocument();
	});
});
