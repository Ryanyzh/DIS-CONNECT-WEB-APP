import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AllTicketsPage } from "../AllTickets";
import { MemoryRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// mock useOfficers hook
const mockUseOfficers = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useOfficers", () => ({
	useOfficers: mockUseOfficers,
}));

describe("AllTicketsPage Integration Test", () => {
	const mockTickets = {
		tickets: [
			{
				escalated_at: null,
				created_at: "2026-06-07T14:34:14.132781+00:00",
				is_escalated: true,
				scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
				description:
					"Enquiry regarding the process and implications of changing major from Computer Science to Business Administration",
				due_at: null,
				escalated_to: null,
				source: "mobile",
				ticket_id: "6ff67865-dfdf-486b-85ea-6e969ef5d705",
				closed_at: null,
				subject: "Enquiry regarding major change",
				ticket_code: "TKT-2026-500E17",
				updated_at: "2026-06-23T03:12:23.072689+00:00",
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
				scholar: {
					id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
					name: "Ryan Tan",
					email: "ryan.tan@u.nus.edu",
					phone: "+65 9123 4567",
					createdAt: "2026-05-24T17:29:40.259379+00:00",
				},
				assigned_to: null,
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
				scholar: {
					id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
					name: "Ryan Tan",
					email: "ryan.tan@u.nus.edu",
					phone: "+65 9123 4567",
					createdAt: "2026-05-24T17:29:40.259379+00:00",
				},
				assigned_to: null,
				attachments: [],
			},
			{
				escalated_at: null,
				created_at: "2026-06-06T14:05:01.385264+00:00",
				is_escalated: true,
				scholar_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
				description:
					"I would like to submit my reimbursement claim for my flight ticket to Toronto for the NOC programme. I have attached the invoice and payment receipt. Could HR advise if the claim amount and supporting documents are sufficient?",
				due_at: null,
				escalated_to: null,
				source: "mobile",
				ticket_id: "64e57d1e-e7ce-4aa9-a163-b4604559c218",
				closed_at: null,
				ticket_code: "TKT-2026-B0E7C1",
				subject: "Reimbursement claim for overseas exchange flight ticket",
				updated_at: "2026-06-23T03:16:01.886146+00:00",
				resolved_at: null,
				status: {
					status_id: "52YiKzCj6wkXszMAt8xn",
					status_name: "Escalated",
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

	beforeEach(() => {
		mockUseOfficers.mockReturnValue({
			officers: mockUsers
				.filter((user: any) => user.role === "hr")
				.map((user: any) => ({
					id: user.user_id,
					name: user.full_name,
					email: user.email,
				})),
			loading: false,
			error: null,
			refetch: vi.fn(),
		});

		vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
			const urlString = url.toString();

			// Intercept useCategories() endpoint
			if (urlString.includes("/api/v1/categories")) {
				const mockCategories = [
					{
						category_id: "2d267226-a9d7-50f9-a6f6-c36ebee38261",
						description: "Internship-related forms, approvals, and documentation",
						created_at: "2026-06-06T06:57:50.356727+00:00",
						updated_at: "2026-06-06T06:57:50.356727+00:00",
						category_name: "Internship",
						department_id: null,
					},
					{
						category_id: "4308c61a-353f-5c6c-b09c-830cbe0cb101",
						description: "Policy clarifications and compliance-related enquiries",
						created_at: "2026-06-06T06:57:50.356727+00:00",
						updated_at: "2026-06-06T06:57:50.356727+00:00",
						category_name: "Policy",
						department_id: null,
					},
					{
						category_id: "503b3a9a-fc71-5c51-83b9-f24ddf9725dc",
						description: "Claims and reimbursements for approved expenses",
						created_at: "2026-06-06T06:57:50.356727+00:00",
						updated_at: "2026-06-06T06:57:50.356727+00:00",
						category_name: "Reimbursement",
						department_id: null,
					},
					{
						category_id: "50739be1-ff48-5fe4-8704-a31a47df2558",
						description: "Leave applications and approvals",
						created_at: "2026-06-06T06:57:50.356727+00:00",
						updated_at: "2026-06-06T06:57:50.356727+00:00",
						category_name: "Leave",
						department_id: null,
					},
					{
						category_id: "9d250fae-12f8-5a62-b383-11434111cf6c",
						description: "Student exchange programme requests and coordination",
						created_at: "2026-06-06T06:57:50.356727+00:00",
						updated_at: "2026-06-06T06:57:50.356727+00:00",
						category_name: "Exchange",
						department_id: null,
					},
					{
						category_id: "b149db0c-ce44-5ee7-8565-21a65c4891b3",
						description: "Scholarship applications, declarations, and disbursements",
						created_at: "2026-06-06T06:57:50.356727+00:00",
						updated_at: "2026-06-06T06:57:50.356727+00:00",
						category_name: "Scholarship",
						department_id: null,
					},
				];
				return Promise.resolve(
					new Response(JSON.stringify(mockCategories), { status: 200 })
				);
			}

			// standard tickets fetch request
			return Promise.resolve(
				new Response(JSON.stringify(mockTickets), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				})
			);
		});
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
