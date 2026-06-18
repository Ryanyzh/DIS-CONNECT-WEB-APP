type Role = "hr_admin" | "hr_officer";

interface RoleMeta {
	key: Role;
	label: string;
	description: string;
	badge: string;
	dot: string;
	userCount: number;
}

const ROLES: RoleMeta[] = [
	{
		key: "hr_admin",
		label: "HR Admin",
		description: "Full system access — manage accounts, settings, roles, and all content.",
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
		dot: "bg-violet-500",
		userCount: 1,
	},
	{
		key: "hr_officer",
		label: "HR Officer",
		description: "Day-to-day operations — tickets, announcements, and scholar management.",
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
		dot: "bg-blue-500",
		userCount: 2,
	},
];

function Check({ granted }: { granted: boolean }) {
	if (granted) {
		return (
			<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
				<svg
					className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2.5}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</span>
		);
	}
	return (
		<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800">
			<svg
				className="w-3 h-3 text-zinc-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</span>
	);
}

export function RolesAndPermissionsPage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-wise-ink/10 dark:border-zinc-700 pb-6">
				<div>
					<h1 className="mt-2 text-2xl font-semibold text-wise-ink dark:text-zinc-100">
						Roles & Permissions
					</h1>
					<p className="mt-1 text-sm text-wise-body dark:text-zinc-400">
						Define what each HR role can access and manage across the dashboard.
					</p>
				</div>
			</div>

			{/* Role cards */}
			<div className="grid grid-cols-2 gap-4">
				{ROLES.map((role) => (
					<div
						key={role.key}
						className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm"
					>
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-center gap-2">
								<span
									className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${role.dot}`}
								/>
								<span className="font-semibold text-wise-ink dark:text-zinc-100">
									{role.label}
								</span>
							</div>
							<span
								className={`text-xs font-medium px-2.5 py-0.5 rounded border ${role.badge}`}
							>
								{role.userCount} {role.userCount === 1 ? "user" : "users"}
							</span>
						</div>
						<p className="text-sm text-wise-body dark:text-zinc-400 leading-relaxed">
							{role.description}
						</p>
					</div>
				))}
			</div>

			{/* Permissions matrix */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
				<div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
					<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
						Permission Matrix
					</h2>
					<p className="text-xs text-zinc-400 mt-0.5">
						What each role is allowed to do within the system.
					</p>
				</div>

				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
							<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide w-full">
								Permission
							</th>
							{ROLES.map((role) => (
								<th
									key={role.key}
									className="px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide whitespace-nowrap text-center"
								>
									<div className="flex items-center justify-center gap-1.5">
										<span className={`w-2 h-2 rounded-full ${role.dot}`} />
										{role.label}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{AREAS.map((area) => {
							const rows = PERMISSIONS.filter((p) => p.area === area);
							return rows.map((perm, i) => (
								<tr
									key={perm.action}
									className="border-b border-zinc-50 dark:border-zinc-800/70 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
								>
									<td className="px-5 py-3">
										<div className="flex items-center gap-3">
											{i === 0 && (
												<span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 w-28 flex-shrink-0">
													{area}
												</span>
											)}
											{i !== 0 && <span className="w-28 flex-shrink-0" />}
											<span className="text-wise-body dark:text-zinc-300">
												{perm.action}
											</span>
										</div>
									</td>
									{ROLES.map((role) => (
										<td key={role.key} className="px-6 py-3 text-center">
											<div className="flex justify-center">
												<Check granted={perm[role.key]} />
											</div>
										</td>
									))}
								</tr>
							));
						})}
					</tbody>
				</table>
			</div>

			{/* Legend */}
			<div className="flex items-center gap-6 text-xs text-zinc-400">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
						<svg
							className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</span>
					Allowed
				</div>
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800">
						<svg
							className="w-2.5 h-2.5 text-zinc-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</span>
					Not allowed
				</div>
			</div>
		</div>
	);
}
