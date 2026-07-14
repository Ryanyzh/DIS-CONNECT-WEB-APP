import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../lib/authRepository";
import {
	type TicketProps,
	statusStyles,
	categoryStyles,
	priorityStyles,
	priorityLabels,
	type TicketStatus,
} from "../../components/tickets/TicketCard";
import type { TicketAttachment } from "../../types/TicketAttachment";
import { useState, useEffect, useCallback } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { ActionsPanel } from "../../components/tickets/ActionsPanel";
import { TicketInfoPanel } from "../../components/tickets/TicketInfoPanel";
import { useRole } from "../../hooks/useRole";
import { useStatuses } from "../../hooks/useStatuses";
import { ActivityTab } from "../../components/tickets/ActivityTab";
import { ConversationTab } from "../../components/tickets/ConversationTab";
import { formatDate } from "../../types/Scholar";
import { apiFetch } from "../../lib/apiFetch";
import { ScholarInfoPanel } from "../../components/tickets/ScholarInfoPanel";

const STATUS_ALIASES: Record<string, TicketStatus> = {
	"Waiting for Response": "Waiting",
};
function normalizeStatus(raw: string): TicketStatus {
	return (STATUS_ALIASES[raw] ?? raw) as TicketStatus;
}

type TabType = "Details" | "Conversation" | "Attachments" | "Activity";

const handleAttachmentPreview = async (filePath: string) => {
	try {
		const fileRef = ref(storage, filePath);
		const previewUrl = await getDownloadURL(fileRef);
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
	const statusIdMap = useStatuses();

	const [ticket, setTicket] = useState<TicketProps>();
	const [loading, setLoading] = useState<boolean>(true);
	const [refresh, setRefresh] = useState<number>(0);
	const [activeTab, setActiveTab] = useState<TabType>("Details");

	const [isScholarPanelOpen, setIsScholarPanelOpen] = useState<boolean>(false);
	const [isScholarPanelHovered, setIsScholarPanelHovered] = useState<boolean>(false);

	const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const getTicketData = useCallback(async () => {
		try {
			setLoading(true);
			const response = await apiFetch(`/api/v1/tickets/${ticketId}`);
			if (!response.ok) throw new Error(`Error retrieving tickets: ${response.status}`);
			const data = await response.json();

			const formattedTicket: TicketProps = {
				id: data.ticket_id,
				code: data.ticket_code,
				title: data.subject,
				category: data.category?.category_name ?? "General Query",
				description: data.description,
				priority: data.priority?.level ?? 1,
				status: normalizeStatus(data.status?.status_name ?? "Open"),
				deadline: data.due_at,
				lastUpdated: data.updated_at,
				createdAt: data.created_at,
				isEscalated: data.is_escalated,
				escalatedAt: data.escalated_at,
				resolvedAt: data.resolved_at,
				scholar: data.scholar
					? {
							...data.scholar,
							studentId: data.scholar.student_id,
							yearOfStudy: data.scholar.year_of_study,
							preferredContact: data.scholar.preferred_contact,
							scholarshipType: data.scholar.scholarship_type,
							tickets: [],
						}
					: undefined,
				officer: data.assigned_officer,
				attachments: data.attachments ?? [],
			};
			setTicket(formattedTicket);
		} catch (err) {
			console.error("Error retrieving tickets: ", err);
		} finally {
			setLoading(false);
		}
	}, [ticketId]);

	useEffect(() => {
		getTicketData();
	}, [ticketId, refresh, getTicketData]);

	async function handleExecuteAction(nextStatus: TicketStatus, metadata?: Record<string, any>) {
		if (!ticketId) return;
		const nextStatusId = statusIdMap[nextStatus];
		if (!nextStatusId) {
			console.error(`No status ID found for ${nextStatus}`);
			return;
		}
		try {
			setLoading(true);
			const response = await apiFetch(`/api/v1/tickets/${ticketId}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status_id: nextStatusId, ...metadata }),
			});

			if (response.status == 403) {
				setErrorMessage("Action denied: You are not the assigned officer for this ticket.");
				setShowErrorPopup(true);

				setTimeout(() => {
					setShowErrorPopup(false);
				}, 4000); // after 4 seconds close the popup

				return;
			}

			if (!response.ok) {
				throw new Error(`Error executing action: ${response.status}`);
			}

			setRefresh((prev) => prev + 1);
		} catch (error) {
			console.error("Failed to execute action: ", error);
		} finally {
			setLoading(false);
		}
	}

	if (loading || roleLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-dc-border dark:border-dc-border-dark border-t-dc-primary" />
			</div>
		);
	}

	if (!ticket || !ticket.scholar) {
		return (
			<div className="h-full w-full flex flex-col gap-4 p-6">
				<button
					onClick={() => navigate(-1)}
					className="w-fit text-sm font-medium text-dc-text-muted dark:text-dc-text-subtle hover:text-dc-primary dark:hover:text-dc-primary transition-colors flex items-center gap-1.5"
				>
					← Back to tickets
				</button>
				<span className="text-xl font-semibold text-dc-text dark:text-white text-center mt-8">
					This ticket could not be found.
				</span>
			</div>
		);
	}

	return (
		<div className="h-full w-full flex flex-row gap-4">
			{/* Main content */}
			<div className="h-full w-full min-w-0 flex flex-col gap-4 flex-1">
				<button
					onClick={() => navigate(-1)}
					className="w-fit text-sm font-medium text-dc-text-muted dark:text-dc-text-subtle hover:text-dc-primary dark:hover:text-dc-primary transition-colors flex items-center gap-1.5"
				>
					← Back to tickets
				</button>

				<span className="font-mono text-xs tracking-wider text-dc-text-muted">
					{ticket.code}
				</span>

				{/* Title and status */}
				<div className="flex flex-row items-start gap-3 justify-between">
					<h1 className="text-xl font-bold text-dc-text dark:text-white leading-snug">
						{ticket.title}
					</h1>
					<span
						className={`shrink-0 text-sm font-semibold px-2.5 py-1 rounded-md ${statusStyles[ticket.status].text} ${statusStyles[ticket.status].bg}`}
					>
						{ticket.status}
					</span>
				</div>

				{/* Category and priority badges */}
				<div className="flex flex-row items-center gap-2">
					<span
						className={`text-xs px-2 py-0.5 rounded-md font-semibold ${categoryStyles[ticket.category]}`}
					>
						{ticket.category}
					</span>
					<span
						className={`text-xs px-2 py-0.5 rounded-md font-semibold ${priorityStyles[ticket.priority]}`}
					>
						{priorityLabels[ticket.priority]}
					</span>
				</div>

				{/* Scholar / Created / Officer summary */}
				<div className="flex flex-row w-full border border-dc-border dark:border-dc-border-dark rounded-xl overflow-hidden divide-x divide-dc-border dark:divide-dc-border-dark">
					{[
						{ value: ticket.scholar.name, label: "Scholar" },
						{ value: formatDate(ticket.createdAt), label: "Created" },
						{ value: ticket.officer?.name ?? "Unassigned", label: "Officer" },
					].map(({ value, label }) => {
						const isScholar = label === "Scholar";
						const isShowingScholar = isScholarPanelOpen || isScholarPanelHovered;

						return (
							<div
								key={label}
								onClick={
									isScholar
										? () => setIsScholarPanelOpen(!isScholarPanelOpen)
										: undefined
								}
								onMouseEnter={isScholar ? () => setIsScholarPanelHovered(true) : undefined}
								onMouseLeave={isScholar ? () => setIsScholarPanelHovered(false) : undefined}
								className={`flex-1 flex flex-col items-center py-3 transition-colors ${isScholar ? `cursor-pointer select-none group ${isShowingScholar ? "bg-dc-primary/5 dark:bg-dc-primary/10" : "hover:bg-dc-elevated/40 dark:hover:bg-zinc-800/40"}` : ""}`}
								role={isScholar ? "button" : undefined}
							>
								<span
									className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${isScholar && isShowingScholar ? "text-dc-primary" : "text-dc-text dark:text-white"}`}
								>
									{value}
									{isScholar && (
										<span
											className={`flex items-center text-sm text-dc-text-muted group-hover:text-dc-primary transition-colors ${
												isShowingScholar ? "scale-x-[-1]" : ""
											} transform duration-200`}
										>
											&rsaquo;
										</span>
									)}
								</span>
								<span
									className={`text-xs mt-0.5 transition-colors ${isScholar && isShowingScholar ? "text-dc-primary/85" : "text-dc-text-muted"}`}
								>
									{label}
								</span>
							</div>
						);
					})}
				</div>

				{/* Tabs */}
				<div className="flex flex-row gap-1 border-b border-dc-border dark:border-dc-border-dark">
					{(["Details", "Conversation", "Attachments", "Activity"] as TabType[]).map(
						(tab) => {
							const isActive = activeTab === tab;
							const count =
								tab === "Attachments" ? ticket.attachments.length : undefined;

							return (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`relative px-3 pb-2 text-sm transition-colors flex items-center gap-1.5 border-b-2 -mb-px ${
										isActive
											? "text-dc-primary font-semibold border-dc-primary"
											: "text-dc-text-muted border-transparent hover:text-dc-text dark:hover:text-white"
									}`}
								>
									<span>{tab}</span>
									{count !== undefined && (
										<span className="text-xs bg-dc-elevated dark:bg-dc-elevated-dark text-dc-text-muted px-1.5 py-0.5 rounded-full font-medium">
											{count}
										</span>
									)}
								</button>
							);
						}
					)}
				</div>

				{/* Tab content */}
				<div className="flex-1 min-h-0 w-full overflow-y-auto">
					{activeTab === "Details" && (
						<div className="flex flex-col gap-5">
							<div>
								<h2 className="text-xs font-semibold uppercase tracking-widest text-dc-text-muted mb-2">
									Description
								</h2>
								<p className="text-sm text-dc-text dark:text-white leading-relaxed">
									{ticket.description}
								</p>
							</div>
							<div className="flex flex-row gap-12">
								<div>
									<h2 className="text-xs font-semibold uppercase tracking-widest text-dc-text-muted mb-1">
										Category
									</h2>
									<span
										className={`text-xs px-2 py-0.5 rounded-md font-semibold ${categoryStyles[ticket.category]}`}
									>
										{ticket.category}
									</span>
								</div>
								<div>
									<h2 className="text-xs font-semibold uppercase tracking-widest text-dc-text-muted mb-1">
										Due Date
									</h2>
									<span className="text-sm text-dc-text dark:text-white">
										{formatDate(ticket.deadline) || "—"}
									</span>
								</div>
							</div>
						</div>
					)}

					{activeTab === "Conversation" && <ConversationTab ticketId={ticketId} />}

					{activeTab === "Attachments" && (
						<div className="flex flex-col gap-3">
							<span className="text-xs font-semibold uppercase tracking-widest text-dc-text-muted">
								Files Uploaded ({ticket.attachments.length})
							</span>
							{ticket.attachments.length > 0 ? (
								<div className="flex flex-wrap gap-2.5">
									{ticket.attachments.map((file: TicketAttachment) => (
										<div
											key={file.attachment_id}
											onClick={() => handleAttachmentPreview(file.file_path)}
											className="border border-dc-border dark:border-dc-border-dark bg-dc-surface dark:bg-dc-surface-dark hover:border-dc-primary/40 dark:hover:border-dc-primary/60 hover:shadow-dc-sm p-3 rounded-xl flex justify-between items-center text-sm cursor-pointer transition-all"
											role="button"
										>
											<span className="line-clamp-2 text-dc-text dark:text-white text-xs">
												{file.file_name}
											</span>
											<span className="text-xs text-dc-text-muted shrink-0 ml-2">
												{(file.file_size / 1024).toFixed(2)} KB
											</span>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-dc-text-muted py-6 text-center">
									No attachments found.
								</p>
							)}
						</div>
					)}

					{activeTab === "Activity" && (
						<ActivityTab ticketId={ticketId} refresh={refresh} />
					)}
				</div>
			</div>

			<div className="h-full flex flex-row gap-4 items-stretch shrink-0 transition-all duration-300">
				{(isScholarPanelOpen || isScholarPanelHovered) && (
					<ScholarInfoPanel
						ticket={ticket}
						onClose={() => {
							setIsScholarPanelOpen(false);
							setIsScholarPanelHovered(false);
						}}
					/>
				)}

				{/* Info + actions + scholar info sidebar */}
				<div className="h-full flex flex-col border border-dc-border dark:border-dc-border-dark rounded-xl overflow-hidden bg-dc-surface dark:bg-dc-surface-dark shadow-dc-sm min-w-[14rem] max-w-[18rem]">
					<TicketInfoPanel ticket={ticket} officer={ticket.officer} />
					{role === "hr" && (
						<ActionsPanel
							ticket={ticket}
							currentStatus={ticket.status}
							onAction={handleExecuteAction}
						/>
					)}
				</div>
			</div>

			{/* Error popup for non-assigned officers */}
			{showErrorPopup && (
				<div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-lg shadow-xl animate-fade-in-up border border-red-700">
					<div className="flex flex-col text-sm font-medium">{errorMessage}</div>

					{/* Manual Close Button */}
					<button
						onClick={() => setShowErrorPopup(false)}
						className="ml-2 text-white hover:text-red-200 transition-colors focus:outline-none"
					>
						&times;
					</button>
				</div>
			)}
		</div>
	);
}
