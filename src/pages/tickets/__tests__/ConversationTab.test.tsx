import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../lib/apiFetch";
import { ConversationTab } from "../../../components/tickets/ConversationTab";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

declare module "vitest" {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// mock apiFetch so it doesn't actually send real network requests
vi.mock("../../../lib/apiFetch", () => ({
	apiFetch: vi.fn(),
}));

const mockMessages = {
	messages: [
		{
			sender_role: "scholar",
			created_at: "2026-06-19T23:13:53.010295+00:00",
			message_id: "7032efd2-82cc-4020-bbfd-185b3c2daf07",
			sender_name: "Ryan Tan",
			message_text: "test",
			attachments: [],
			sender_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		},
		{
			sender_role: "scholar",
			created_at: "2026-06-19T23:18:15.278178+00:00",
			message_id: "a40eabed-56e6-46cd-b43c-f12e4705f33b",
			sender_name: "Ryan Tan",
			message_text: "test again",
			attachments: [],
			sender_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		},
		{
			sender_role: "scholar",
			created_at: "2026-06-19T23:19:08.537514+00:00",
			message_id: "5c2c05ae-7136-43d5-ad5b-9491124b35c4",
			sender_name: "Ryan Tan",
			message_text: "test message",
			attachments: [],
			sender_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		},
		{
			sender_role: "scholar",
			created_at: "2026-06-19T23:19:51.405943+00:00",
			message_id: "df3423aa-62df-4034-83c7-579e34258f59",
			sender_name: "Ryan Tan",
			message_text: "this is a message",
			attachments: [],
			sender_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		},
		{
			sender_role: "scholar",
			created_at: "2026-06-19T23:39:03.354975+00:00",
			message_id: "96089237-6a38-4b69-9f0d-907470e934ea",
			sender_name: "Ryan Tan",
			message_text: "this is another message hello hello",
			attachments: [],
			sender_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		},
		{
			sender_role: "scholar",
			created_at: "2026-06-21T07:56:34.955157+00:00",
			message_id: "89239da4-857b-40df-bfc4-5f9e1d458ee2",
			sender_name: "Ryan Tan",
			message_text: "test message after merge",
			attachments: [],
			sender_id: "XDRno5f0JAbAsOfV8WzbvQYxn253",
		},
		{
			sender_role: "hr",
			created_at: "2026-06-21T13:23:18.142544+00:00",
			message_id: "f69fd5f0-3add-4b6b-b57f-04d0f0ebbaf6",
			sender_name: "Daniel Wong",
			message_text: "test message from officer",
			attachments: [],
			sender_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		},
		{
			sender_role: "hr",
			created_at: "2026-06-22T00:11:45.026832+00:00",
			message_id: "485b03a8-fbce-4e30-872d-14073078d8e9",
			sender_name: "Daniel Wong",
			message_text: "test message from officer 2",
			attachments: [],
			sender_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		},
		{
			sender_role: "hr",
			created_at: "2026-06-22T15:53:44.246901+00:00",
			message_id: "372eb5cc-1ab5-49c0-beb9-1d3ed30efd7f",
			sender_name: "Daniel Wong",
			message_text: "test message from officer after minor fix",
			attachments: [],
			sender_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		},
		{
			sender_role: "hr",
			created_at: "2026-06-23T02:39:43.214457+00:00",
			message_id: "e03ced55-1995-4730-a360-692f0c8cc4a6",
			sender_name: "Daniel Wong",
			message_text: "test message after switching to apiFetch",
			attachments: [],
			sender_id: "Gr1OeIhIQZcfZt880yNwqNEBurJ2",
		},
		{
			sender_role: "hr",
			created_at: "2026-06-23T03:49:47.929376+00:00",
			message_id: "6e3b6bd5-f5f4-487f-a95b-82d074cf0142",
			sender_name: "Nicholas Chua",
			message_text: "test message from other officer",
			attachments: [],
			sender_id: "yUyM8PdgOzcPTvIfSPuEt8HOmm83",
		},
	],
};

describe("Conversation Tab Integration Test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
	});

	it("displays message history as speech bubbles correctly", async () => {
		// mock GET request response
		(apiFetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockMessages,
		});

		render(<ConversationTab ticketId="ticket1" />);

		await waitFor(() => {
			expect(screen.getByText("this is another message hello hello")).toBeInTheDocument();
			expect(screen.getByText("test message from officer")).toBeInTheDocument();
		});
	});

	it("applies correct layout alignment based on sender roles", async () => {
		// mock GET request response
		(apiFetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockMessages,
		});

		render(<ConversationTab ticketId="ticket2" />);

		await waitFor(() => {
			// check that scholar messages are aligned to the left and officer messages are aligned to the right
			const scholarBubble = screen.getByText(
				"this is another message hello hello"
			).parentElement;
			const officerBubble = screen.getByText("test message from officer").parentElement;

			expect(scholarBubble?.parentElement).toHaveClass("items-start");
			expect(scholarBubble).toHaveClass("rounded-tl-none");
			expect(officerBubble?.parentElement).toHaveClass("items-end");
			expect(officerBubble).toHaveClass("rounded-tr-none");
		});
	});

	it("sends new message payload through apiFetch when send button is clicked", async () => {
		// mock POST and GET request responses
		(apiFetch as any).mockImplementation(async () => {
			return {
				ok: true,
				status: 200,
				json: async () => ({ messages: [] }),
			};
		});

		render(<ConversationTab ticketId="ticket3" />);

		const inputField = screen.getByPlaceholderText("Type a message...");
		const sendButton = screen.getByRole("button", { name: /Send/ });

		// simulate typing message
		fireEvent.change(inputField, { target: { value: "test sending message" } });
		fireEvent.click(sendButton);

		// verify that POST request is sent through apiFetch
		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith(
				"/api/v1/tickets/ticket3/messages",
				expect.objectContaining({
					method: "POST",
					// verify that the payload contains the correct message text and attachments
					body: JSON.stringify({
						message_text: "test sending message",
						attachments: [],
					}),
				})
			);
		});
	});
});
