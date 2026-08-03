import { useEffect, useState, useRef, useLayoutEffect } from "react";
import type { TicketAttachment } from "../../types/TicketAttachment";
import { apiFetch } from "../../lib/apiFetch";
import { getDatabase, ref as rtdbRef, onValue } from "firebase/database";
import { app } from "../../lib/firebase";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

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
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [sending, setSending] = useState<boolean>(false);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
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
			<p className="text-sm text-dc-text-muted py-6 text-center">
				This ticket could not be found.
			</p>
		);
	}

	const uploadFileToStorage = async (file: File): Promise<TicketAttachment> => {
		const storage = getStorage(app);
		const fileId = crypto.randomUUID();
		const filePath = `tickets/${ticketId}/chat/${fileId}_${file.name}`;
		const fileStorageRef = storageRef(storage, filePath);

		await uploadBytes(fileStorageRef, file);
		const fileUrl = await getDownloadURL(fileStorageRef);

		return {
			attachment_id: fileId,
			file_name: file.name,
			file_path: fileUrl,
			file_type: file.type,
			file_size: file.size,
			uploaded_at: new Date().toISOString(),
		};
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			setSelectedFiles((prev) => [...prev, ...newFiles]);
		}
		// Reset input value
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const removeFile = (idxRemove: number) => {
		setSelectedFiles((prev) => prev.filter((_, idx) => idx !== idxRemove));
	};

	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return;
		try {
			setSending(true);
			const attachmentsPayload: TicketAttachment[] = await Promise.all(
				selectedFiles.map((file) => uploadFileToStorage(file))
			);

			const response = await apiFetch(`/api/v1/tickets/${ticketId}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message_text: newMessage,
					attachments: attachmentsPayload,
				}),
			});

			if (!response.ok) throw new Error(`Failed to send message ${response.status}`);

			setNewMessage("");
			setSelectedFiles([]);

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
				{messages.map((message, idx) => {
					const isScholar = message.sender_role === "scholar";
					return (
						<div
							key={message.message_id}
							ref={idx == messages.length - 1 ? messagesEndRef : null}
							className={`flex flex-col ${isScholar ? "items-start" : "items-end"}`}
						>
							<div
								className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
									isScholar
										? "rounded-tl-none bg-dc-elevated dark:bg-dc-elevated-dark text-dc-text dark:text-white border border-dc-border dark:border-dc-border-dark"
										: "rounded-tr-none bg-dc-primary text-white"
								}`}
							>
								{/* Message text */}
								{message.message_text && <p>{message.message_text}</p>}

								{/* File attachments */}
								{message.attachments && message.attachments.length > 0 && (
									<div className="mt-2 flex flex-col gap-2">
										{message.attachments.map((attachment) => {
											const isImage =
												attachment.file_type.startsWith("image/");
											return (
												<div
													key={
														attachment.attachment_id ||
														attachment.file_path
													}
												>
													{isImage ? (
														<a
															href={attachment.file_path}
															target="_blank"
															rel="noopener noreferrer"
														>
															<img
																src={attachment.file_path}
																alt={attachment.file_name}
																className="max-w-full max-h-48 rounded-lg object-cover border border-black/10 dark:border-white/10 hover:opacity-90 transition-opacity"
															/>
														</a>
													) : (
														<a
															href={attachment.file_path}
															target="_blank"
															rel="noopener noreferrer"
															className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs underline transition-colors ${
																isScholar
																	? "bg-dc-surface dark:bg-dc-surface-dark text-dc-primary"
																	: "bg-white/20 text-white hover:bg-white/30"
															}`}
														>
															{attachment.file_name}
														</a>
													)}
												</div>
											);
										})}
									</div>
								)}
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
				className="flex flex-col pt-3 border-t border-dc-border dark:border-dc-border-dark mt-2 gap-2"
			>
				{/* Attachment Preview Badges */}
				{selectedFiles.length > 0 && (
					<div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
						{selectedFiles.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className="flex items-center gap-2 px-3 py-1 bg-dc-elevated dark:bg-dc-elevated-dark border border-dc-border dark:border-dc-border-dark rounded-lg text-xs text-dc-text dark:text-white"
							>
								<span className="truncate max-w-[150px]">{file.name}</span>
								<button
									type="button"
									onClick={() => removeFile(index)}
									className="text-dc-text-muted hover:text-red-500 font-bold ml-1 transition-colors"
								>
									&times;
								</button>
							</div>
						))}
					</div>
				)}

				<div className="flex gap-2 items-center">
					{/* Hidden file input */}
					<input
						type="file"
						multiple
						ref={fileInputRef}
						className="hidden"
						onChange={handleFileSelect}
					/>

					<div className="flex flex-1 gap-2 justify-between border border-dc-border dark:border-dc-border-dark rounded-lg bg-dc-surface dark:bg-dc-surface-dark">
						{/* Text input */}
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder="Type a message..."
							className="flex-1 text-sm mx-4 py-2 bg-dc-surface dark:bg-dc-surface-dark text-dc-text dark:text-white placeholder:text-dc-text-muted focus:outline-none transition-colors"
							disabled={sending}
						/>

						{/* Attach button */}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={sending}
							className="mx-2 text-dc-text-muted text-xl hover:text-dc-primary rounded-lg transition-colors"
							title="Attach files"
						>
							+
						</button>
					</div>

					{/* Send button */}
					<button
						type="submit"
						disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
						className="btn-gradient disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0"
					>
						{sending ? "Sending…" : "Send"}
					</button>
				</div>
			</form>
		</div>
	);
}
