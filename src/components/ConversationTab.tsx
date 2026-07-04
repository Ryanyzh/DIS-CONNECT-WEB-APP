import { useEffect, useState, useRef, useLayoutEffect } from "react";
import type { TicketAttachment } from "../types/TicketAttachment";
import { apiFetch } from "../lib/apiFetch";
import { getDatabase, ref as rtdbRef, onValue } from "firebase/database";
import { app } from "../lib/firebase";

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
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>("");
	const [sending, setSending] = useState<boolean>(false);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	async function fetchMessages() {
		if (!ticketId) return;

		try {
			const response = await apiFetch(`/api/v1/tickets/${ticketId}/messages`);

			if (!response.ok) {
				throw new Error(`Error fetching ticket messages: ${response.status}`);
			}

			const data = await response.json();
			const formattedData = data.messages.map((msg: any) => {
				return {
					...msg,
					created_at: new Date(msg.created_at),
				};
			});

			setMessages(formattedData);
		} catch (error) {
			console.error("Error fetching ticket messages: ", error);
		}
	}

	useEffect(() => {
		fetchMessages();
	}, [ticketId]);

	// listen for incoming messages
	useEffect(() => {
		if (!ticketId) return;

		const db = getDatabase(app);
		const messagesRef = rtdbRef(db, `ticket_messages/${ticketId}`);

		const stopListening = onValue(messagesRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const formattedData: Message[] = Object.keys(data).map((key) => {
					return {
						...data[key],
						created_at: new Date(data[key].created_at),
					};
				});

				formattedData.sort(
					(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				);

				setMessages(formattedData);
			} else {
				setMessages([]);
			}
		});

		return () => stopListening();
	}, [ticketId]);

	useLayoutEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!ticketId) {
		return (
			<p className="text-sm text-dc-text-muted py-6 text-center">This ticket could not be found.</p>
		);
	}

	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || sending) return;
		try {
			setSending(true);
			const response = await apiFetch(`/api/v1/tickets/${ticketId}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message_text: newMessage }),
			});
			if (!response.ok) throw new Error(`Failed to send message ${response.status}`);
			setNewMessage("");
			await fetchMessages();
		} catch (error) {
			console.error("Error sending message: ", error);
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="flex flex-col h-full min-h-0">
			{/* Message list */}
			<div className="flex flex-col gap-3 py-2 flex-1 overflow-y-auto max-h-[22rem]">
				{messages.length === 0 && (
					<p className="text-sm text-dc-text-muted py-4 text-center">No messages yet.</p>
				)}
				{messages.map((message) => {
					const isScholar = message.sender_role === "scholar";
					return (
						<div
							key={message.message_id}
							className={`flex flex-col ${isScholar ? "items-start" : "items-end"}`}
						>
							<div
								className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
									isScholar
										? "rounded-tl-none bg-dc-elevated dark:bg-dc-elevated-dark text-dc-text dark:text-white border border-dc-border dark:border-dc-border-dark"
										: "rounded-tr-none bg-dc-primary text-white"
								}`}
							>
								{message.message_text}
							</div>
							<span className="text-xs text-dc-text-muted mt-1 mx-1 tracking-wide">
								{message.sender_name} · {message.created_at.toLocaleString("en-SG")}
							</span>
						</div>
					);
				})}
			</div>

			{/* Send form */}
			<form
				onSubmit={sendMessage}
				className="flex gap-2 items-center pt-3 border-t border-dc-border dark:border-dc-border-dark mt-2"
			>
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					className="flex-1 text-sm border border-dc-border dark:border-dc-border-dark rounded-lg px-4 py-2 bg-dc-surface dark:bg-dc-surface-dark text-dc-text dark:text-white placeholder:text-dc-text-muted focus:outline-none focus:ring-2 focus:ring-dc-primary/30 focus:border-dc-primary transition-colors"
					disabled={sending}
				/>
				<button
					type="submit"
					disabled={!newMessage.trim() || sending}
					className="btn-gradient disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0"
				>
					{sending ? "Sending…" : "Send"}
				</button>
			</form>
		</div>
	);
}
