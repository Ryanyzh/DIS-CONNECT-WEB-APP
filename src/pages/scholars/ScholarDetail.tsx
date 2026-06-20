import { useNavigate, useParams } from "react-router-dom";
import { scholarStatusConfig, getInitials, formatDate, MOCK_SCHOLARS } from "../../types/Scholar";

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
		</div>
	);
}
