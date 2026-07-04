import { useState } from "react";
import PageShell from "../PageShell";
import { apiFetch } from "../../lib/apiFetch";

export const facultyOptions = [
	"College of Humanities & Sciences",
	"School of Computing",
	"College of Design & Engineering",
	"NUS Business School",
	"Faculty of Law",
	"Yong Loo Lin School of Medicine",
	"Faculty of Dentistry",
	"Alice Lee Centre for Nursing Studies",
	"Yong Siew Toh Conservatory of Music",
	"School of Pharmacy",
	"Saw Swee Hock School of Public Health",
	"NUS College",
	"Other",
];

export const programOptionsByFaculty: Record<string, string[]> = {
	"School of Computing": [
		"Computer Science",
		"Business Analytics",
		"Business Artificial Intelligence Systems",
		"Information Security",
		"Computer Engineering",
		"Artificial Intelligence",
	],
	"College of Design & Engineering": [
		"Architecture",
		"Biomedical Engineering",
		"Chemical Engineering",
		"Civil Engineering",
		"Computer Engineering",
		"Electrical Engineering",
		"Engineering Science",
		"Environmental & Sustainability Engineering",
		"Industrial & Systems Engineering",
		"Industrial Design",
		"Infrastructure & Project Management",
		"Landscape Architecture",
		"Materials Science & Engineering",
		"Mechanical Engineering",
		"Robotics & Machine Intelligence",
	],
	"NUS Business School": [
		"Business Administration",
		"Accountancy",
		"Finance",
		"Marketing",
		"Operations & Supply Chain",
		"Business Economics",
		"Analytics & Operations",
		"Innovation & Entrepreneurship",
		"Real Estate",
	],
	"College of Humanities & Sciences": [
		"Data Science & Economics",
		"Economics",
		"Psychology",
		"Political Science",
		"Communications & New Media",
		"Mathematics",
		"Statistics",
		"Physics",
		"Chemistry",
		"Life Sciences",
		"Environmental Studies",
		"Food Science & Technology",
		"Philosophy, Politics & Economics (PPE)",
		"History",
		"Sociology",
		"English Language",
		"Philosophy",
		"Geography",
		"Anthropology",
		"Chinese Studies",
		"Malay Studies",
		"Japanese Studies",
	],
	"Faculty of Law": ["Law"],
	"Yong Loo Lin School of Medicine": ["Medicine"],
	"Faculty of Dentistry": ["Dentistry"],
	"Alice Lee Centre for Nursing Studies": ["Nursing"],
	"Yong Siew Toh Conservatory of Music": ["Music"],
	"School of Pharmacy": ["Pharmacy", "Pharmaceutical Science"],
	"Saw Swee Hock School of Public Health": ["Public Health"],
	"NUS College": ["NUS College"],
	Other: ["Other"],
};

export const programOptions = Array.from(
	new Set(Object.values(programOptionsByFaculty).flat())
).sort();

const inputClass =
	"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
const labelClass =
	"block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide";
const sectionClass =
	"text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4";

export function CreateStudentAccountPage() {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [phone, setPhone] = useState("");
	const [studentId, setStudentId] = useState("");
	const [faculty, setFaculty] = useState("");
	const [program, setProgram] = useState("");
	const [yearOfStudy, setYearOfStudy] = useState("");
	const [preferredContact, setPreferredContact] = useState("");
	const [scholarshipType, setScholarshipType] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [notification, setNotification] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const programOptionsForFaculty = faculty ? (programOptionsByFaculty[faculty] ?? []) : [];

	const showNotification = (type: "success" | "error", text: string) => {
		setNotification({ type, text });
		window.setTimeout(() => setNotification(null), 4000);
	};

	const resetForm = () => {
		setFullName("");
		setEmail("");
		setPassword("");
		setPhone("");
		setStudentId("");
		setFaculty("");
		setProgram("");
		setYearOfStudy("");
		setPreferredContact("");
		setScholarshipType("");
		setShowPassword(false);
	};

	const generatePassword = () => {
		const code = Math.floor(Math.random() * 90000000) + 10000000;
		setPassword(code.toString());
	};

	const handleSubmit = async (event: { preventDefault(): void }) => {
		event.preventDefault();
		setSubmitting(true);

		const payload = {
			full_name: fullName,
			email,
			password,
			phone,
			student_id: studentId,
			faculty,
			program,
			year_of_study: yearOfStudy,
			preferred_contact: preferredContact,
			scholarship_type: scholarshipType,
		};

		try {
			const res = await apiFetch("/api/v1/auth/register-scholar", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				let detail = `Request failed with status ${res.status}`;
				try {
					const body = await res.json();
					detail = body.detail ?? JSON.stringify(body);
				} catch {
					detail = (await res.text()) || detail;
				}
				showNotification("error", detail);
				return;
			}

			showNotification(
				"success",
				`Student account for ${fullName} has been created successfully.`
			);
			resetForm();
		} catch (error) {
			console.error(error);
			showNotification("error", String(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<PageShell description="Add a new student account to the system for user management and authentication.">
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
				<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
					<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
						Student Details
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-8">
					{/* Personal Information */}
					<div>
						<p className={sectionClass}>Personal Information</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<label className={labelClass}>Full Name</label>
								<input
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									placeholder="Enter student name"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Email Address</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="student@example.com"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Password</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<input
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Create a secure password"
											className={`${inputClass} pr-10`}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
											title={showPassword ? "Hide password" : "Show password"}
										>
											{showPassword ? (
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
												</svg>
											) : (
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											)}
										</button>
									</div>
									<button
										type="button"
										onClick={generatePassword}
										className="px-3.5 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
									>
										Generate
									</button>
								</div>
							</div>
							<div>
								<label className={labelClass}>Phone Number</label>
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="+65 9123 4567"
									className={inputClass}
								/>
							</div>
						</div>
					</div>

					{/* Academic Information */}
					<div>
						<p className={sectionClass}>Academic Information</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<label className={labelClass}>Student ID</label>
								<input
									value={studentId}
									onChange={(e) => setStudentId(e.target.value)}
									placeholder="e.g. A0123456B"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Faculty</label>
								<select
									value={faculty}
									onChange={(e) => {
										setFaculty(e.target.value);
										setProgram("");
									}}
									className={inputClass}
								>
									<option value="">Select faculty</option>
									{facultyOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className={labelClass}>Programme</label>
								<select
									value={program}
									onChange={(e) => setProgram(e.target.value)}
									disabled={!faculty}
									className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									<option value="">
										{faculty ? "Select programme" : "Choose faculty first"}
									</option>
									{programOptionsForFaculty.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className={labelClass}>Year of Study</label>
								<select
									value={yearOfStudy}
									onChange={(e) => setYearOfStudy(e.target.value)}
									className={inputClass}
								>
									<option value="">Select year</option>
									<option value="1">1st year</option>
									<option value="2">2nd year</option>
									<option value="3">3rd year</option>
									<option value="4">4th year</option>
									<option value="5">5th year+</option>
								</select>
							</div>
							<div>
								<label className={labelClass}>Preferred Contact</label>
								<select
									value={preferredContact}
									onChange={(e) => setPreferredContact(e.target.value)}
									className={inputClass}
								>
									<option value="">Select contact method</option>
									<option value="email">Email</option>
									<option value="phone">Phone</option>
									<option value="sms">SMS</option>
								</select>
							</div>
							<div>
								<label className={labelClass}>Scholarship Type</label>
								<input
									value={scholarshipType}
									onChange={(e) => setScholarshipType(e.target.value)}
									placeholder="e.g. ASEAN, MOE, PSC"
									className={inputClass}
								/>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
						<p className="text-xs text-zinc-400 dark:text-zinc-500">
							Student accounts can be managed by HR officers once created.
						</p>
						<button
							type="submit"
							disabled={submitting}
							className="flex-shrink-0 btn-gradient text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Creating…" : "Create student account"}
						</button>
					</div>
				</form>
			</div>

			{notification && (
				<div
					role="status"
					aria-live="polite"
					className={`fixed top-6 right-6 z-[999] w-[min(100%,24rem)] rounded-xl border px-4 py-3 text-sm shadow-xl shadow-black/10 ${
						notification.type === "success"
							? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
							: "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300"
					}`}
				>
					{notification.text}
				</div>
			)}
		</PageShell>
	);
}
