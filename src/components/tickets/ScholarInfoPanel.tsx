import type { TicketProps } from "./TicketCard";

interface ScholarInfoPanelProps {
	ticket: TicketProps;
	onClose: () => void;
	isOpen: boolean;
}

export function ScholarInfoPanel({ ticket, onClose, isOpen }: ScholarInfoPanelProps) {
	if (!ticket.scholar) return null;

	return (
		<div
			className={`h-full flex flex-col border border-dc-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-dc-sm overflow-hidden shrink-0 transition-all duration-300 ease-in-out ${
				isOpen
					? "w-full max-w-[20vw] opacity-100 border-l"
					: "w-0 opacity-0 border-l-0 pointer-events-none"
			}`}
		>
			{/* Panel Header */}
			<div className="p-4 border-b border-dc-border dark:border-zinc-200 flex justify-between items-center bg-dc-elevated/30 dark:bg-zinc-900/40 min-w-[20vw]">
				<div>
					<span className="text-[10px] font-bold text-dc-text-muted tracking-wider block">
						Scholar Info
					</span>
					<span className="font-bold text-xs text-dc-text dark:text-white mt-0.5 truncate max-w-[12rem]">
						{ticket.scholar.name}
					</span>
				</div>
				<button
					onClick={onClose}
					className="text-dc-text-muted hover:text-dc-text dark:hover:text-white text-lg p-1 leading-none transition-colors"
				>
					&times;
				</button>
			</div>

			{/* Panel Details Body */}
			<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs min-w-[20vw]">
				{/* Academic Overview */}
				<div className="flex flex-col gap-1.5">
					<span className="text-[10px] font-bold text-dc-text-muted tracking-wider">
						Academic Profile
					</span>
					<div className="bg-dc-surface dark:bg-zinc-900/30 p-3 rounded-xl border border-dc-border dark:border-zinc-200 space-y-2">
						<div>
							<span className="text-dc-text-muted block">Student ID</span>
							<span className="font-semibold text-dc-text dark:text-white">
								{ticket.scholar.studentId || "—"}
							</span>
						</div>
						<div>
							<span className="text-dc-text-muted block">Faculty</span>
							<span className="font-semibold text-dc-text dark:text-white">
								{ticket.scholar.faculty || "—"}
							</span>
						</div>
						<div>
							<span className="text-dc-text-muted block">Program / Major</span>
							<span className="font-semibold text-dc-text dark:text-white">
								{ticket.scholar.program || "—"}
							</span>
						</div>
						<div>
							<span className="text-dc-text-muted block">Year of Study</span>
							<span className="font-semibold text-dc-text dark:text-white">
								Year {ticket.scholar.yearOfStudy || "—"}
							</span>
						</div>
					</div>
				</div>

				{/* Scholarship Admin Info */}
				<div className="flex flex-col gap-1.5">
					<span className="text-[10px] font-bold text-dc-text-muted tracking-wider">
						Scholarship Admin Info
					</span>
					<div className="bg-dc-surface dark:bg-zinc-900/30 p-3 rounded-xl border border-dc-border dark:border-zinc-200 space-y-2">
						<div>
							<span className="text-dc-text-muted block">Scholarship Type</span>
							<span className="font-semibold text-dc-primary">
								{ticket.scholar.scholarshipType || "-"}
							</span>
						</div>
						<div>
							<span className="text-dc-text-muted block">Status</span>
							<span
								className={`inline-block font-semibold px-1.5 py-0.5 rounded text-[10px] mt-0.5 ${
									ticket.scholar.status === "Active"
										? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
										: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
								}`}
							>
								{ticket.scholar.status}
							</span>
						</div>
					</div>
				</div>

				{/* Contact Info */}
				<div className="flex flex-col gap-1.5">
					<span className="text-[10px] font-bold text-dc-text-muted tracking-wider">
						Contact Information
					</span>
					<div className="flex flex-col gap-1.5">
						<div className="cursor-pointer flex items-center gap-1 p-2 rounded-lg border border-dc-border dark:border-zinc-200 bg-dc-elevated/40 dark:bg-zinc-900/30 hover:bg-dc-elevated dark:hover:bg-zinc-600/30 transition-all text-dc-text dark:text-white">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="w-3.5 h-3.5 text-dc-text-muted"
							>
								<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
								<circle cx="8" cy="10" r="2" />
								<path d="M4 16c0-1.5 2-2.5 4-2.5s4 1 4 2.5" />
								<line x1="15" y1="9" x2="19" y2="9" />
								<line x1="15" y1="13" x2="18" y2="13" />
							</svg>
							Preferred Contact:
							<span className="truncate text-dc-text-muted">
								{ticket.scholar.preferredContact || "-"}
							</span>
						</div>
						<a
							href={`mailto:${ticket.scholar.email}`}
							className="flex items-center gap-1 p-2 rounded-lg border border-dc-border dark:border-zinc-200 bg-dc-elevated/40 dark:bg-zinc-900/30 hover:bg-dc-elevated dark:hover:bg-zinc-600/30 transition-all text-dc-text dark:text-white"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="w-3.5 h-3.5 text-dc-text-muted"
							>
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							Email:
							<span className="truncate text-dc-text-muted hover:text-dc-text dark:hover:text-white">
								{ticket.scholar.email}
							</span>
						</a>
						{ticket.scholar.phone && (
							<a
								href={`tel:${ticket.scholar.phone}`}
								className="flex items-center gap-1 p-2 rounded-lg border border-dc-border dark:border-zinc-200 bg-dc-elevated/40 dark:bg-zinc-900/30 hover:bg-dc-elevated dark:hover:bg-zinc-600/30 transition-all text-dc-text dark:text-white"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-3.5 h-3.5 text-dc-text-muted"
								>
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
								</svg>
								Phone No.:
								<span className="truncate text-dc-text-muted hover:text-dc-text dark:hover:text-white">
									{ticket.scholar.phone}
								</span>
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
