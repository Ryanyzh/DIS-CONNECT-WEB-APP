import { useEffect, useState } from "react";
import { getIdToken } from "../lib/authRepository";
import type { TicketAttachment } from "../types/TicketAttachment";
import { apiFetch } from "../lib/apiFetch";

interface Message {
	message_id: string;
	sender_id: string;
	sender_name: string;
	sender_role: string;
	message_text: string;
	attachments: TicketAttachment[];
	created_at: Date;
}

export function ConversationTab({ ticketId }: { ticketId: string | undefined }) {
	if (!ticketId) {
		return (
			<div className="bg-wise-canvas h-full w-full flex flex-col gap-4 p-6 text-3xl font-semibold">
				<span className="text-center">This ticket could not be found.</span>
			</div>
		);
	}

	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>("");
	const [sending, setSending] = useState<boolean>(false);

	async function fetchMessages() {
		try {
			const response = await apiFetch(`/api/v1/tickets/${ticketId}/messages`)

			if (!response.ok) {
				throw new Error(`Error fetching conversation history: ${response.status}`);
			}

			const data = await response.json();
			const formattedData = data.messages.map((message: Message) => {
				return {
					...message,
					created_at: new Date(message.created_at),
				};
			});

			setMessages(formattedData);
		} catch (error) {
			console.error("Error fetching ticket history: ", error);
		}
	}

	useEffect(() => {
		fetchMessages();
	}, [ticketId]);

	const sendMessage = async (e: React.SubmitEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || sending) return;

		try {
			setSending(true);

			const response = await apiFetch(`/api/v1/tickets/${ticketId}/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message_text: newMessage }),
			});

			if (!response.ok) {
				throw new Error(`Failed to send message ${response.status}`);
			}

			setNewMessage("");
			await fetchMessages();
		} catch (error) {
			console.error("Error sending message: ", error);
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="bg-wise-canvas h-full w-full flex flex-col items-center justify-center">
			<div className="px-10 py-4 rounded-lg h-[22vw] w-full flex flex-col gap-4 overflow-y-auto">
				{messages.map((message) => (
					<div key={message.message_id} className={`flex flex-col ${message.sender_role == "scholar" ? "self-start items-start" : "self-end items-end"}`}>
						<div
							className={`flex flex-col w-fit border ${message.sender_role == "scholar" ? "rounded-tl-none" : "rounded-tr-none"} rounded-2xl p-3 shadow-sm`}
						>
							<p className="text-sm">{message.message_text}</p>
						</div>

						<span className="text-xs text-slate-400 mt-1 ml-1 tracking-wide">
							{message.sender_name} at {message.created_at.toLocaleString("en-SG")}
						</span>
					</div>
				))}
			</div>

			<form
				onSubmit={sendMessage}
				className="w-full p-3 bg-white border-t border-slate-200 flex gap-2 items-center"
			>
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Message"
					className="flex-1 text-sm border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-all text-slate-800 bg-slate-50"
					disabled={sending}
				/>
				<button
					type="submit"
					disabled={!newMessage.trim() || sending}
					className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs shrink-0"
				>
					{sending ? "Sending..." : "Send"}
				</button>
			</form>
		</div>
	);
}
