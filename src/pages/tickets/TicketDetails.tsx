import { useParams, useNavigate } from "react-router-dom";
import PageShell from "../PageShell";
import { getIdToken } from "../../lib/authRepository";
import {
	type TicketProps,
	statusStyles,
	tagStyles,
	priorityStyles,
} from "../../components/TicketCard";
import { useState, useEffect } from "react";
import type { Scholar } from "../../types/Scholar";

type TabType = "Details" | "Conversation" | "Attachments" | "Activity";

export function TicketDetailsPage() {
	const { ticketId } = useParams<{ ticketId: string }>();
	const navigate = useNavigate();

	const [ticket, setTicket] = useState<TicketProps>();
	const [loading, setLoading] = useState<boolean>(true);

	const [activeTab, setActiveTab] = useState<TabType>("Details");

	const getTicketData = async () => {
		try {
			setLoading(true);
			const idToken = await getIdToken();

			const response = await fetch(`/api/v1/tickets/${ticketId}`, {
				method: "GET",
				headers: {
					authorization: idToken ? `Bearer ${idToken}` : "",
				},
			});

			if (!response.ok) {
				throw new Error(`Error retrieving tickets: ${response.status}`);
			}
			const data = await response.json();

			const scholarResponse = await fetch(`/api/v1/users/${data.scholar_id}`);

			if (!scholarResponse.ok) {
				throw new Error(`Error retrieving scholar: ${scholarResponse.status}`);
			}

			const scholarData = await scholarResponse.json();
			const formattedScholar: Scholar = {
				id: scholarData.user_id,
				name: scholarData.full_name,
				email: scholarData.email,
			};

			const formattedTicket: TicketProps = {
				id: data.ticket_id,
				code: data.ticket_code,
				title: data.subject,
				tag: data.category.category_name,
				description: data.description,
				priority: data.priority.level,
				status: data.status.status_name,
				deadline: new Date(data.due_at),
				lastUpdated: new Date(data.updated_at),
				createdAt: new Date(data.created_at),
				scholar: formattedScholar,
				officer: data.assigned_to,
				attachments: data.attachments
					? data.attachments.map((attachment: any) => {
							return {
								attachment_id: attachment.attachment_id,
								file_name: attachment.file_name,
								file_path: attachment.file_path,
								file_type: attachment.file_type,
								file_size: attachment.file_size,
								uploaded_at: new Date(attachment.uploaded_at),
							};
						})
					: [],
			};
			setTicket(formattedTicket);
		} catch (err) {
			console.error("Error retrieving tickets: ", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getTicketData();
	}, [ticketId]);

	if (loading) {
		return (
			<div className="bg-wise-canvas h-full w-full md:w-[75vw] flex flex-col items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
				</div>
			</div>
		);
	}

	if (!ticket || !ticket.scholar) {
		return (
			<div className="bg-wise-canvas h-full w-full md:w-[75vw] flex flex-col gap-4 p-6 text-3xl font-semibold">
				<button
					onClick={() => navigate(-1)}
					className="w-fit block text-sm border rounded-md p-2 hover:border-zinc-400 transition-all font-normal"
				>
					Back to tickets
				</button>
				<span className="text-center">This ticket could not be found.</span>
			</div>
		);
	}

	return (
		<div className="bg-wise-canvas h-full w-full md:w-[75vw] flex flex-col gap-4">
			<button
				onClick={() => navigate(-1)}
				className="w-fit block text-sm border rounded-md p-2 hover:border-zinc-400 transition-all font-normal mb-4"
			>
				Back to tickets
			</button>

			<div className="font-semibold">{ticket.code}</div>

			{/* Ticket title and status */}
			<div className="flex flex-row items-center text-xl font-semibold line-clamp-2 justify-between">
				<span>{ticket.title}</span>
				<span
					className={`line-clamp-2 flex font-semibold text-right w-fit min-h-0 text-sm leading-snug tracking-tight ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg} px-2.5 py-1.5 rounded-md`}
				>
					{ticket.status}
				</span>
			</div>

			{/* Ticket category and priority */}
			<div className="flex flex-row items-center justify-start gap-3">
				<span
					className={`text-sm px-2 py-1 rounded-md font-semibold ${tagStyles[ticket.tag]}`}
				>
					{ticket.tag}
				</span>
				<span
					className={`text-sm px-2 py-1 rounded-md font-semibold ${priorityStyles[ticket.priority]}`}
				>
					{ticket.priority <= 3
						? `Low Priority ${ticket.priority}`
						: ticket.priority >= 8
							? `High Priority ${ticket.priority}`
							: `Medium Priority ${ticket.priority}`}
				</span>
			</div>

			{/* Scholar, created at, assigned officer */}
			<div className="flex flex-row w-full text-center items-center justify-between divide-x">
				<div className="flex-1 flex-col">
					<div className="text-lg mb-1">{ticket.scholar.name}</div>
					<div className="text-sm text-zinc-400">Scholar</div>
				</div>
				<div className="flex-1 flex-col">
					<div className="text-lg mb-1">{ticket.createdAt.toLocaleString()}</div>
					<div className="text-sm text-zinc-400">Created</div>
				</div>
				<div className="flex-1 flex-col">
					<div className="text-lg mb-1">
						{ticket.officer ? ticket.officer.name : "Unassigned"}
					</div>
					<div className="text-sm text-zinc-400">Assigned Officer</div>
				</div>
			</div>

			{/* Tabs for more info: Details, Conversation, Attachments, Activity (only details and attachments for now) */}
			<div className="w-full flex flex-row items-center gap-6 text-sm text-zinc-400 px-2 pt-2 justify-start">
				{(["Details", "Conversation", "Attachments", "Activity"] as TabType[]).map(
					(tab) => {
						const isActive = activeTab == tab;

						// counts for conversation and attachments
						let count: number | undefined;
						if (tab == "Conversation") {
							count = 0; // placeholder
						}
						if (tab == "Attachments") {
							count = ticket.attachments.length;
						}

						return (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`relative pb-2 transition-all hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-zinc-500 border-b-2 border-zinc-400"}`}
							>
								<div className="flex items-center gap-1.5">
									<span>{tab}</span>
									{count != undefined && (
										<span className="text-xs bg-zinc-500/15 px-1.5 py-0.25 rounded-full text-zinc-600">
											{count}
										</span>
									)}
								</div>
							</button>
						);
					}
				)}
			</div>

			{/* Body of information (only details and attachments so far) */}
			<div className="h-full w-full flex flex-col gap-3">
				{activeTab == "Details" && (
					<div className="h-full w-full flex flex-col gap-3">
						<div className="font-semibold">Description</div>
						<div className="mb-4">{ticket.description}</div>

						<div className="flex flex-row justify-start gap-40">
							<div className="flex flex-col gap-3">
								<div className="font-semibold">Category</div>
								<div>{ticket.tag}</div>
							</div>

							<div className="flex flex-col gap-3">
								<div className="font-semibold">Due Date</div>
								<div>{ticket.deadline.toLocaleString()}</div>
							</div>
						</div>
					</div>
				)}

                {activeTab == "Attachments" && (
                    <div className="h-full w-full flex flex-col gap-3">
                        <div className="font-semibold">Files Uploaded ({ticket.attachments.length})</div>
                        {(ticket.attachments.length > 0) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ticket.attachments.map((file: any) => (
                                    <div key={file.attachment_id} className="border border-zinc-400 p-3 rounded-lg flex justify-between items-center text-sm select-none cursor-pointer">
                                        <span className="line-clamp-2">{file.file_name}</span>
                                        <span className="text-xs text-zinc-500">{(file.file_size / 1024).toFixed(2)} KB</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm">No attachments found.</div>
                        )}
                    </div>
                )}
			</div>
		</div>
	);
}
