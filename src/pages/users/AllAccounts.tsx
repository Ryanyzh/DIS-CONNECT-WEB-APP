import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";

interface Student {
	id: string;
	fullName: string;
	email: string;
	studentId: string;
	faculty: string;
	program: string;
	yearOfStudy: string;
	phone: string;
	createdAt: string;
}

interface HrOfficer {
	id: string;
	fullName: string;
	email: string;
	employeeId: string;
	department: string;
	designation: string;
	phone: string;
	createdAt: string;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

function formatDate(iso: string) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-SG", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
	return (
		<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 shadow-sm">
			<p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
				{label}
			</p>
			<p className="mt-1 text-2xl font-bold text-wise-ink dark:text-zinc-100">{value}</p>
			{sub && <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>}
		</div>
	);
}

export function AllAccountsPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"students" | "hr-officers">("students");
	const [search, setSearch] = useState("");
	const [students, setStudents] = useState<Student[]>([]);
	const [hrOfficers, setHrOfficers] = useState<HrOfficer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch("/api/v1/users/")
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
				return res.json();
			})
			.then((users: Record<string, unknown>[]) => {
				const scholars: Student[] = [];
				const hr: HrOfficer[] = [];

				for (const u of users) {
					if (u.role === "scholar") {
						scholars.push({
							id: (u.user_id as string) ?? "",
							fullName: (u.full_name as string) ?? "",
							email: (u.email as string) ?? "",
							studentId: (u.student_id as string) ?? "—",
							faculty: (u.faculty as string) ?? "—",
							program: (u.program as string) ?? "—",
							yearOfStudy: u.year_of_study != null ? String(u.year_of_study) : "—",
							phone: (u.phone as string) ?? "—",
							createdAt: (u.created_at as string) ?? "",
						});
					} else if (u.role === "hr") {
						hr.push({
							id: (u.user_id as string) ?? "",
							fullName: (u.full_name as string) ?? "",
							email: (u.email as string) ?? "",
							employeeId: (u.employee_id as string) ?? "—",
							department: (u.department_id as string) ?? "—",
							designation: (u.designation as string) ?? "—",
							phone: (u.phone as string) ?? "—",
							createdAt: (u.created_at as string) ?? "",
						});
					}
				}

				setStudents(scholars);
				setHrOfficers(hr);
			})
			.catch((err: unknown) => setError(String(err)))
			.finally(() => setLoading(false));
	}, []);

	const filteredStudents = students.filter(
		(s) =>
			s.fullName.toLowerCase().includes(search.toLowerCase()) ||
			s.email.toLowerCase().includes(search.toLowerCase()) ||
			s.studentId.toLowerCase().includes(search.toLowerCase())
	);

	const filteredOfficers = hrOfficers.filter(
		(o) =>
			o.fullName.toLowerCase().includes(search.toLowerCase()) ||
			o.email.toLowerCase().includes(search.toLowerCase()) ||
			o.employeeId.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-wise-ink/10 dark:border-zinc-700 pb-6">
				<div>
					<h1 className="mt-2 text-2xl font-semibold text-wise-ink dark:text-zinc-100">
						All Accounts
					</h1>
					<p className="mt-1 text-sm text-wise-body dark:text-zinc-400">
						Manage all student and HR officer accounts in the system.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => navigate("/users/create-student")}
						className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-wise-ink dark:text-zinc-100 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						New Student
					</button>
					<button
						onClick={() => navigate("/users/create-hr-officer")}
						className="flex items-center gap-2 bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						New HR Officer
					</button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				<StatCard
					label="Total Accounts"
					value={students.length + hrOfficers.length}
					sub="across all roles"
				/>
				<StatCard label="Students" value={students.length} sub="scholar accounts" />
				<StatCard label="HR Officers" value={hrOfficers.length} sub="staff accounts" />
			</div>

			{/* Search + Tabs */}
			<div className="flex items-center justify-between gap-4">
				<div className="relative flex-1 max-w-sm">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by name, email, or ID…"
						className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
					/>
				</div>

				<div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
					<button
						onClick={() => setActiveTab("students")}
						className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
							activeTab === "students"
								? "bg-white dark:bg-zinc-900 text-wise-ink dark:text-zinc-100 shadow-sm"
								: "text-zinc-500 dark:text-zinc-400 hover:text-wise-ink dark:hover:text-zinc-200"
						}`}
					>
						Students
						<span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
							{students.length}
						</span>
					</button>
					<button
						onClick={() => setActiveTab("hr-officers")}
						className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
							activeTab === "hr-officers"
								? "bg-white dark:bg-zinc-900 text-wise-ink dark:text-zinc-100 shadow-sm"
								: "text-zinc-500 dark:text-zinc-400 hover:text-wise-ink dark:hover:text-zinc-200"
						}`}
					>
						HR Officers
						<span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
							{hrOfficers.length}
						</span>
					</button>
				</div>
			</div>

			{/* Tables */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
				{loading ? (
					<div className="text-center py-16 text-zinc-400 text-sm">Loading accounts…</div>
				) : error ? (
					<div className="text-center py-16 text-red-500 text-sm">{error}</div>
				) : activeTab === "students" ? (
					<>
						{filteredStudents.length === 0 ? (
							<div className="text-center py-16 text-zinc-400 text-sm">
								No students match your search.
							</div>
						) : (
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Scholar
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Student ID
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Faculty & Programme
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Year
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Phone
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Joined
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
									{filteredStudents.map((student) => (
										<tr
											key={student.id}
											className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
										>
											<td className="px-5 py-3.5">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
														{getInitials(student.fullName)}
													</div>
													<div className="min-w-0">
														<p className="font-semibold text-wise-ink dark:text-zinc-100 truncate">
															{student.fullName}
														</p>
														<p className="text-xs text-zinc-400 truncate">
															{student.email}
														</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-3.5">
												<span className="inline-block text-xs font-mono font-medium px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded">
													{student.studentId}
												</span>
											</td>
											<td className="px-5 py-3.5">
												<p className="text-wise-ink dark:text-zinc-100 font-medium truncate max-w-[200px]">
													{student.program}
												</p>
												<p className="text-xs text-zinc-400 truncate max-w-[200px]">
													{student.faculty}
												</p>
											</td>
											<td className="px-5 py-3.5">
												<span className="text-wise-body dark:text-zinc-400">
													{student.yearOfStudy !== "—"
														? `Year ${student.yearOfStudy}`
														: "—"}
												</span>
											</td>
											<td className="px-5 py-3.5 text-wise-body dark:text-zinc-400">
												{student.phone}
											</td>
											<td className="px-5 py-3.5 text-wise-body dark:text-zinc-400 whitespace-nowrap">
												{formatDate(student.createdAt)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</>
				) : (
					<>
						{filteredOfficers.length === 0 ? (
							<div className="text-center py-16 text-zinc-400 text-sm">
								No HR officers match your search.
							</div>
						) : (
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Officer
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Employee ID
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Department & Designation
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Phone
										</th>
										<th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
											Joined
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
									{filteredOfficers.map((officer) => (
										<tr
											key={officer.id}
											className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
										>
											<td className="px-5 py-3.5">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
														{getInitials(officer.fullName)}
													</div>
													<div className="min-w-0">
														<p className="font-semibold text-wise-ink dark:text-zinc-100 truncate">
															{officer.fullName}
														</p>
														<p className="text-xs text-zinc-400 truncate">
															{officer.email}
														</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-3.5">
												<span className="inline-block text-xs font-mono font-medium px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded">
													{officer.employeeId}
												</span>
											</td>
											<td className="px-5 py-3.5">
												<p className="text-wise-ink dark:text-zinc-100 font-medium">
													{officer.designation}
												</p>
												<p className="text-xs text-zinc-400">
													{officer.department}
												</p>
											</td>
											<td className="px-5 py-3.5 text-wise-body dark:text-zinc-400">
												{officer.phone}
											</td>
											<td className="px-5 py-3.5 text-wise-body dark:text-zinc-400 whitespace-nowrap">
												{formatDate(officer.createdAt)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</>
				)}
			</div>
		</div>
	);
}
