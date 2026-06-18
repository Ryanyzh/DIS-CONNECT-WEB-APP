import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const mockStudents: Student[] = [
	{
		id: "1",
		fullName: "Alice Johnson",
		email: "alice@example.com",
		studentId: "S1234567",
		faculty: "School of Computing",
		program: "Computer Science",
		yearOfStudy: "3",
		phone: "+65 9123 4567",
		createdAt: "2024-01-15",
	},
	{
		id: "2",
		fullName: "Bob Smith",
		email: "bob@example.com",
		studentId: "S1234568",
		faculty: "NUS Business School",
		program: "Finance",
		yearOfStudy: "2",
		phone: "+65 9234 5678",
		createdAt: "2024-01-20",
	},
	{
		id: "3",
		fullName: "Carol White",
		email: "carol@example.com",
		studentId: "S1234569",
		faculty: "College of Humanities & Sciences",
		program: "Biology",
		yearOfStudy: "1",
		phone: "+65 9345 6789",
		createdAt: "2024-02-01",
	},
];

const mockHrOfficers: HrOfficer[] = [
	{
		id: "1",
		fullName: "Sarah Williams",
		email: "sarah@example.com",
		employeeId: "HR-2048",
		department: "Human Resources",
		designation: "HR Officer",
		phone: "+65 9456 7890",
		createdAt: "2023-06-10",
	},
	{
		id: "2",
		fullName: "Mark Johnson",
		email: "mark@example.com",
		employeeId: "HR-2049",
		department: "Human Resources",
		designation: "Senior HR Officer",
		phone: "+65 9567 8901",
		createdAt: "2023-03-15",
	},
];

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

function formatDate(iso: string) {
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

export function UsersPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"students" | "hr-officers">("students");
	const [search, setSearch] = useState("");

	const filteredStudents = mockStudents.filter(
		(s) =>
			s.fullName.toLowerCase().includes(search.toLowerCase()) ||
			s.email.toLowerCase().includes(search.toLowerCase()) ||
			s.studentId.toLowerCase().includes(search.toLowerCase())
	);

	const filteredOfficers = mockHrOfficers.filter(
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

			{/* Tables */}
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden"></div>
		</div>
	);
}
