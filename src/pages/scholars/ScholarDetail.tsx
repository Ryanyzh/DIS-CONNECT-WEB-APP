import { useNavigate, useParams } from "react-router-dom";
import {
	scholarStatusConfig,
	ticketStatusConfig,
	ticketTagConfig,
	getInitials,
	formatDate,
	MOCK_SCHOLARS,
} from "../../types/Scholar";

const PRIORITY_LABEL: Record<number, { label: string; color: string }> = {
	1: { label: "Very Low", color: "text-zinc-400" },
	2: { label: "Low", color: "text-blue-500" },
	3: { label: "Medium", color: "text-amber-500" },
	4: { label: "High", color: "text-orange-500" },
	5: { label: "Critical", color: "text-rose-500" },
};

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
			<span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex-shrink-0 w-36">
				{label}
			</span>
			<span className="text-sm text-wise-ink dark:text-zinc-200 text-right">{value}</span>
		</div>
	);
}

export function ScholarDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const scholar = MOCK_SCHOLARS.find((s) => s.id === id);

	if (!scholar) {
		return (
			<div className="text-center py-24">
				<p className="text-zinc-400 text-sm mb-4">Scholar not found.</p>
				<button
					onClick={() => navigate("/scholars/profiles")}
					className="text-sm text-wise-ink dark:text-zinc-300 underline"
				>
					Back to Scholar Profiles
				</button>
			</div>
		);
	}

	const statusCfg = scholarStatusConfig[scholar.status];
	const openTickets = scholar.tickets.filter(
		(t) => t.status !== "Resolved" && t.status !== "Closed"
	);
	const closedTickets = scholar.tickets.filter(
		(t) => t.status === "Resolved" || t.status === "Closed"
	);

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			{/* Back */}
			<button
				onClick={() => navigate("/scholars/profiles")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 transition-colors"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Scholar Profiles
			</button>

			{/* Profile hero */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
				<div className="flex items-start gap-5">
					<div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
						{getInitials(scholar.fullName)}
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3 flex-wrap">
							<h1 className="text-xl font-bold text-wise-ink dark:text-zinc-100">
								{scholar.fullName}
							</h1>
							<span
								className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded border ${statusCfg.badge}`}
							>
								<span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
								{scholar.status}
							</span>
						</div>
						<p className="mt-0.5 text-sm text-zinc-400">{scholar.email}</p>
						<div className="flex flex-wrap gap-4 mt-3 text-sm text-wise-body dark:text-zinc-400">
							<span className="flex items-center gap-1.5">
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
									/>
								</svg>
								{scholar.studentId}
							</span>
							<span className="flex items-center gap-1.5">
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								{scholar.phone}
							</span>
							<span className="flex items-center gap-1.5">
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								Enrolled {formatDate(scholar.createdAt)}
							</span>
						</div>
					</div>
					{/* Summary stats */}
					<div className="flex gap-4 flex-shrink-0">
						<div className="text-center">
							<p className="text-2xl font-bold text-wise-ink dark:text-zinc-100">
								{scholar.tickets.length}
							</p>
							<p className="text-xs text-zinc-400 mt-0.5">Total tickets</p>
						</div>
						<div className="w-px bg-zinc-200 dark:bg-zinc-700" />
						<div className="text-center">
							<p
								className={`text-2xl font-bold ${openTickets.length > 0 ? "text-rose-500" : "text-emerald-500"}`}
							>
								{openTickets.length}
							</p>
							<p className="text-xs text-zinc-400 mt-0.5">Open</p>
						</div>
					</div>
				</div>
			</div>

			{/* Two-column body */}
			<div className="grid grid-cols-3 gap-6">
				{/* Left: Details */}
				<div className="col-span-1 space-y-4">
					{/* Academic info */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm">
						<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
							Academic
						</h2>
						<InfoRow label="Faculty" value={scholar.faculty} />
						<InfoRow label="Programme" value={scholar.program} />
						<InfoRow label="Year of Study" value={`Year ${scholar.yearOfStudy}`} />
						<InfoRow label="Scholarship" value={scholar.scholarshipType} />
					</div>

					{/* Contact info */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm">
						<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
							Contact
						</h2>
						<InfoRow label="Email" value={scholar.email} />
						<InfoRow label="Phone" value={scholar.phone} />
						<InfoRow label="Preferred" value={scholar.preferredContact} />
					</div>

					{/* Exchange */}
					{scholar.exchange && (
						<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm">
							<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
								Exchange / Internship
							</h2>
							<InfoRow label="University" value={scholar.exchange.university} />
							<InfoRow label="Country" value={scholar.exchange.country} />
							<InfoRow
								label="Period"
								value={`${formatDate(scholar.exchange.startDate)} – ${formatDate(scholar.exchange.endDate)}`}
							/>
							<div className="flex items-start justify-between gap-4 py-2.5">
								<span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex-shrink-0 w-36">
									Status
								</span>
								<span
									className={`text-xs font-medium px-2 py-0.5 rounded border ${
										scholar.exchange.status === "Completed"
											? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
											: scholar.exchange.status === "Ongoing"
												? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
												: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
									}`}
								>
									{scholar.exchange.status}
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Right: Tickets */}
				<div className="col-span-2 space-y-4">
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
						<div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
								Ticket History
							</h2>
							<p className="text-xs text-zinc-400 mt-0.5">
								All support requests submitted by this scholar.
							</p>
						</div>

						{scholar.tickets.length === 0 ? (
							<div className="text-center py-12 text-zinc-400 text-sm">
								No tickets submitted yet.
							</div>
						) : (
							<div className="divide-y divide-zinc-100 dark:divide-zinc-800">
								{[...openTickets, ...closedTickets].map((ticket) => {
									const statusCfg = ticketStatusConfig[ticket.status];
									const tagCfg = ticketTagConfig[ticket.tag];
									const priority = PRIORITY_LABEL[ticket.priority];
									return (
										<div
											key={ticket.id}
											className="px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
										>
											<div className="flex items-start justify-between gap-3">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1.5 flex-wrap">
														<span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
															{ticket.id}
														</span>
														<span
															className={`text-xs font-medium px-1.5 py-0.5 rounded border ${tagCfg}`}
														>
															{ticket.tag}
														</span>
													</div>
													<p className="text-sm font-semibold text-wise-ink dark:text-zinc-100 leading-snug">
														{ticket.title}
													</p>
													<div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
														<span>
															Updated {formatDate(ticket.lastUpdated)}
														</span>
														<span
															className={`font-medium ${priority.color}`}
														>
															{priority.label} priority
														</span>
													</div>
												</div>
												<span
													className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${statusCfg.badge}`}
												>
													{ticket.status}
												</span>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
