import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser, getIdToken } from "../../lib/authRepository";
import {
	type TicketProps,
	statusStyles,
	categoryStyles,
	priorityStyles,
	priorityLabels,
	type TicketStatus,
} from "../../components/TicketCard";
import { useState, useEffect, useCallback } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { STATUS_IDS, storage } from "../../lib/firebase";
import { ActionsPanel } from "../../components/ActionsPanel";
import { TicketInfoPanel } from "../../components/TicketInfoPanel";
import { useRole } from "../../hooks/useRole";
import { ActivityTab } from "../../components/ActivityTab";
import { ConversationTab } from "../../components/ConversationTab";
import { formatDate } from "../../types/Scholar";
import { apiFetch } from "../../lib/apiFetch";

type TabType = "Details" | "Conversation" | "Attachments" | "Activity";

const handleAttachmentPreview = async (filePath: string) => {
	try {
		const fileRef = ref(storage, filePath);
		const previewUrl = await getDownloadURL(fileRef);

		// open preview of attachment in browser
		window.open(previewUrl, "_blank", "noopener,noreferrer");
	} catch (error) {
		console.error("Error previewing attachment: ", error);
		alert("Could not load attachment preview. Please try again.");
	}
};

export function TicketDetailsPage() {
	const { role, roleLoading } = useRole(getCurrentUser()?.uid);
	const { ticketId } = useParams<{ ticketId: string }>();
	const navigate = useNavigate();

	const [ticket, setTicket] = useState<TicketProps>();
	const [loading, setLoading] = useState<boolean>(true);
	const [refresh, setRefresh] = useState<number>(0);

	const [activeTab, setActiveTab] = useState<TabType>("Details");

	const getTicketData = useCallback(async () => {
		try {
			setLoading(true);
			
			const response = await apiFetch(`/api/v1/tickets/${ticketId}`)

			if (!response.ok) {
				throw new Error(`Error retrieving tickets: ${response.status}`);
			}
			const data = await response.json();

			const formattedTicket: TicketProps = {
				id: data.ticket_id,
				code: data.ticket_code,
				title: data.subject,
				category: data.category.category_name,
				description: data.description,
				priority: data.priority.level,
				status: data.status.status_name,
				deadline: data.due_at,
				lastUpdated: data.updated_at,
				createdAt: data.created_at,
				isEscalated: data.is_escalated,
				scholar: {
						...data.scholar,
						studentId: data.scholar.student_id ?? "",
						faculty: data.scholar.faculty ?? "",
						program: data.scholar.program ?? "",
						yearOfStudy: data.scholar.year_of_study ?? "",
						preferredContact: data.scholar.preferred_contact ?? "Email",
						scholarshipType: data.scholar.scholarship_type ?? "",
						status: data.scholar.status ?? "Active",
						tickets: [],
					},
				officer: data.assigned_to,
				attachments: data.attachments ?? [],
			};
			setTicket(formattedTicket);
		} catch (err) {
			console.error("Error retrieving tickets: ", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		getTicketData();
	}, [ticketId, refresh, getTicketData]);

	async function handleExecuteAction(nextStatus: TicketStatus, metadata?: Record<string, any>) {
		if (!ticketId) return;

		const nextStatusId = STATUS_IDS[nextStatus];
		if (!nextStatusId) {
			console.error(`No status ID found for ${nextStatus}`);
			return;
		}

		try {
			setLoading(true);
			
			const response = await apiFetch(`/api/v1/tickets/${ticketId}/status`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status_id: nextStatusId,
					...metadata,
				}),
			});

			if (!response.ok) {
				throw new Error(`Error executing action: ${response.status}`);
			}

			setRefresh((prev) => prev + 1);
			console.log("Successfully executed action");
		} catch (error) {
			console.error("Failed to execute action: ", error);
		} finally {
			setLoading(false);
		}
	}

	if (loading || roleLoading) {
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
		<div className="bg-wise-canvas h-full w-full md:w-[75vw] flex flex-row gap-4">
			<div className="bg-wise-canvas h-full w-full min-w-[50vw] flex flex-col gap-4">
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
						className={`line-clamp-2 flex font-semibold w-fit min-h-0 text-sm leading-snug tracking-tight ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg} px-2.5 py-1.5 rounded-md`}
					>
						{ticket.status}
					</span>
				</div>

				{/* Ticket category and priority */}
				<div className="flex flex-row items-center justify-start gap-3">
					<span
						className={`text-sm px-2 py-1 rounded-md font-semibold ${categoryStyles[ticket.category]}`}
					>
						{ticket.category}
					</span>
					<span
						className={`text-sm px-2 py-1 rounded-md font-semibold ${priorityStyles[ticket.priority]}`}
					>
						{priorityLabels[ticket.priority]}
					</span>
				</div>

				{/* Scholar, created at, assigned officer */}
				<div className="flex flex-row w-full text-center items-center justify-between divide-x">
					<div className="flex-1 flex-col">
						<div className="text-lg mb-1">{ticket.scholar.name}</div>
						<div className="text-sm text-zinc-400">Scholar</div>
					</div>
					<div className="flex-1 flex-col">
						<div className="text-lg mb-1">
							{formatDate(ticket.createdAt)}
						</div>
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

				{/* Body of information */}
				<div className="h-full w-full flex flex-col gap-3">
					{activeTab == "Details" && (
						<div className="h-full w-full flex flex-col gap-3">
							<div className="font-semibold">Description</div>
							<div className="mb-4">{ticket.description}</div>

							<div className="flex flex-row justify-start gap-40">
								<div className="flex flex-col gap-3">
									<div className="font-semibold">Category</div>
									<div>{ticket.category}</div>
								</div>

								<div className="flex flex-col gap-3">
									<div className="font-semibold">Due Date</div>
									<div>{formatDate(ticket.deadline)}</div>
								</div>
							</div>
						</div>
					)}

					{activeTab == "Conversation" && (
						<ConversationTab ticketId={ticketId} />
					)}

					{activeTab == "Attachments" && (
						<div className="h-full w-full flex flex-col gap-3">
							<div className="font-semibold">
								Files Uploaded ({ticket.attachments.length})
							</div>
							{ticket.attachments.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{ticket.attachments.map((file: any) => (
										<div
											key={file.attachment_id}
											onClick={() => handleAttachmentPreview(file.file_path)}
											data-testid="attachment-preview"
											className="border border-zinc-400 p-3 rounded-lg flex justify-between items-center text-sm select-none cursor-pointer hover:bg-zinc-100 transition-all"
											role="button"
										>
											<span className="line-clamp-2">{file.file_name}</span>
											<span className="text-xs text-zinc-500">
												{(file.file_size / 1024).toFixed(2)} KB
											</span>
										</div>
									))}
								</div>
							) : (
								<div className="text-sm">No attachments found.</div>
							)}
						</div>
					)}

					{activeTab == "Activity" && (
						<ActivityTab ticketId={ticketId} refresh={refresh} />
					)}
				</div>
			</div>

			{/* Ticket information and actions panel */}
			<div className="h-full w-full flex flex-col border rounded-lg">
				<TicketInfoPanel ticket={ticket} officer={ticket.officer} />
				{role == "hr" && (
					<ActionsPanel ticket={ticket} currentStatus={ticket.status} onAction={handleExecuteAction} />
				)}
			</div>
		</div>
	);
}
