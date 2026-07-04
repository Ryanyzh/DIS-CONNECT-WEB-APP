import { useState } from "react";
import PageShell from "../PageShell";
import { apiFetch } from "../../lib/apiFetch";

const inputClass =
	"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
const labelClass =
	"block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide";
const sectionClass =
	"text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4";

export function CreateHrOfficerAccountPage() {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [phone, setPhone] = useState("");
	const [employeeId, setEmployeeId] = useState("");
	const [departmentId, setDepartmentId] = useState("");
	const [designation, setDesignation] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [notification, setNotification] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const generatePassword = () => {
		const code = Math.floor(Math.random() * 90000000) + 10000000;
		setPassword(code.toString());
	};

	const showNotification = (type: "success" | "error", text: string) => {
		setNotification({ type, text });
		window.setTimeout(() => setNotification(null), 4000);
	};

	const resetForm = () => {
		setFullName("");
		setEmail("");
		setPassword("");
		setPhone("");
		setEmployeeId("");
		setDepartmentId("");
		setDesignation("");
		setShowPassword(false);
	};

	const handleSubmit = async (event: { preventDefault(): void }) => {
		event.preventDefault();
		setSubmitting(true);

		const payload = {
			full_name: fullName,
			email,
			password,
			phone,
			employee_id: employeeId,
			department_id: departmentId,
			designation,
		};

		try {
			const res = await apiFetch("/api/v1/auth/register-hr", {
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

			showNotification("success", `HR officer account for ${fullName} has been created.`);
			resetForm();
		} catch (error) {
			console.error(error);
			showNotification("error", String(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<PageShell description="Add a new HR officer account for user management, permissions, and authentication.">
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
				<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
					<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
						Officer Details
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
									placeholder="Enter officer name"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Email Address</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="hr@example.com"
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

					{/* Employment Details */}
					<div>
						<p className={sectionClass}>Employment Details</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<label className={labelClass}>Employee ID</label>
								<input
									value={employeeId}
									onChange={(e) => setEmployeeId(e.target.value)}
									placeholder="e.g. HR-2048"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Department ID</label>
								<input
									value={departmentId}
									onChange={(e) => setDepartmentId(e.target.value)}
									placeholder="e.g. DPT-01"
									className={inputClass}
								/>
							</div>
							<div className="md:col-span-2">
								<label className={labelClass}>Designation</label>
								<input
									value={designation}
									onChange={(e) => setDesignation(e.target.value)}
									placeholder="e.g. HR Officer"
									className={inputClass}
								/>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
						<p className="text-xs text-zinc-400 dark:text-zinc-500">
							HR officers can manage scholar accounts and permission levels.
						</p>
						<button
							type="submit"
							disabled={submitting}
							className="flex-shrink-0 btn-gradient text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Creating…" : "Create HR officer account"}
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
