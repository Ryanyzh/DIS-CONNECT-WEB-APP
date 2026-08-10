import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type ExchangePlacementFormData,
	type PlacementType,
	type PlacementStatus,
	PLACEMENT_STATUSES,
} from "../../types/ExchangePlacement";
import { useScholars } from "../../hooks/useScholars";
import PageShell from "../PageShell";

const EMPTY_FORM: ExchangePlacementFormData = {
	type: "Exchange",
	scholarId: "",
	hostInstitution: "",
	country: "",
	city: "",
	startDate: "",
	endDate: "",
	status: "Upcoming",
	academicCredits: "",
	department: "",
	supervisorName: "",
	notes: "",
};

const inputClass =
	"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
const selectClass =
	"w-full appearance-none bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 pr-9 text-sm text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
const labelClass =
	"block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide";
const sectionClass =
	"text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4";

export function ScholarExchangeFormPage() {
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const { scholars } = useScholars();
	const [form, setForm] = useState<ExchangePlacementFormData>(EMPTY_FORM);
	const [loading, setLoading] = useState(isEditing);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isEditing) return;
		apiFetch(`/api/v1/scholars/exchange/${id}`)
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((data) => {
				setForm({
					type: data.type,
					scholarId: data.scholarId,
					hostInstitution: data.hostInstitution,
					country: data.country,
					city: data.city,
					startDate: data.startDate,
					endDate: data.endDate,
					status: data.status,
					academicCredits: data.academicCredits?.toString() ?? "",
					department: data.department ?? "",
					supervisorName: data.supervisorName ?? "",
					notes: data.notes ?? "",
				});
			})
			.catch(() => {
				setError("Placement not found.");
			})
			.finally(() => setLoading(false));
	}, [id, isEditing]);

	const set =
		(field: keyof ExchangePlacementFormData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
			setForm((prev) => ({ ...prev, [field]: e.target.value }));

	const handleSubmit = async (e: { preventDefault(): void }) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		const scholar = scholars.find((s) => s.id === form.scholarId);
		const payload = {
			...form,
			scholarName: scholar?.name ?? "",
			studentId: scholar?.studentId ?? "",
			faculty: scholar?.faculty ?? "",
			academicCredits: form.academicCredits ? Number(form.academicCredits) : undefined,
		};

		try {
			const res = await apiFetch(
				isEditing ? `/api/v1/scholars/exchange/${id}` : "/api/v1/scholars/exchange",
				{
					method: isEditing ? "PATCH" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			if (!res.ok) throw new Error();
			navigate("/scholars/exchange");
		} catch {
			setError("Failed to save placement. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<span className="text-zinc-400 text-sm">Loading…</span>
			</div>
		);
	}

	return (
		<PageShell
			description={
				isEditing
					? "Update the placement details below and save your changes."
					: "Record a new exchange or internship placement for a scholar."
			}
		>
			{/* Back nav */}
			<button
				onClick={() => navigate("/scholars/exchange")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 transition-colors -mt-1"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Exchange & Internship Tracking
			</button>

			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
				<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
					<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
						{isEditing ? "Edit Placement" : "Placement Details"}
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-8">
					{/* Placement Info */}
					<div>
						<p className={sectionClass}>Placement Info</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<label className={labelClass}>Type</label>
								<div className="relative">
									<select value={form.type} onChange={set("type")} className={selectClass}>
										{(["Exchange", "Internship"] as PlacementType[]).map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
									<svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
							<div>
								<label className={labelClass}>Status</label>
								<div className="relative">
									<select value={form.status} onChange={set("status")} className={selectClass}>
										{PLACEMENT_STATUSES.map((s: PlacementStatus) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
									<svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
							<div className="md:col-span-2">
								<label className={labelClass}>Scholar</label>
								<div className="relative">
									<select
										value={form.scholarId}
										onChange={set("scholarId")}
										required
										className={selectClass}
									>
										<option value="">Select a scholar…</option>
										{scholars.map((s) => (
											<option key={s.id} value={s.id}>
												{s.name} — {s.studentId}
											</option>
										))}
									</select>
									<svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Host Details */}
					<div>
						<p className={sectionClass}>Host Details</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="md:col-span-2">
								<label className={labelClass}>
									{form.type === "Exchange" ? "Host University" : "Company / Organisation"}
								</label>
								<input
									type="text"
									value={form.hostInstitution}
									onChange={set("hostInstitution")}
									required
									placeholder={
										form.type === "Exchange" ? "e.g. ETH Zürich" : "e.g. Google Singapore"
									}
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>City</label>
								<input
									type="text"
									value={form.city}
									onChange={set("city")}
									required
									placeholder="e.g. Zürich"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Country</label>
								<input
									type="text"
									value={form.country}
									onChange={set("country")}
									required
									placeholder="e.g. Switzerland"
									className={inputClass}
								/>
							</div>
						</div>
					</div>

					{/* Duration & Extras */}
					<div>
						<p className={sectionClass}>Duration & Details</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<label className={labelClass}>Start Date</label>
								<input
									type="date"
									value={form.startDate}
									onChange={set("startDate")}
									required
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>End Date</label>
								<input
									type="date"
									value={form.endDate}
									onChange={set("endDate")}
									required
									className={inputClass}
								/>
							</div>

							{form.type === "Exchange" ? (
								<div>
									<label className={labelClass}>Academic Credits</label>
									<input
										type="number"
										min={0}
										value={form.academicCredits}
										onChange={set("academicCredits")}
										placeholder="e.g. 20"
										className={inputClass}
									/>
								</div>
							) : (
								<>
									<div>
										<label className={labelClass}>Department</label>
										<input
											type="text"
											value={form.department}
											onChange={set("department")}
											placeholder="e.g. Cloud Infrastructure"
											className={inputClass}
										/>
									</div>
									<div>
										<label className={labelClass}>Supervisor Name</label>
										<input
											type="text"
											value={form.supervisorName}
											onChange={set("supervisorName")}
											placeholder="e.g. Ms. Priya Menon"
											className={inputClass}
										/>
									</div>
								</>
							)}

							<div className="md:col-span-2">
								<label className={labelClass}>Notes (optional)</label>
								<textarea
									value={form.notes}
									onChange={set("notes")}
									rows={3}
									placeholder="Any remarks or follow-up actions…"
									className={`${inputClass} resize-none`}
								/>
							</div>
						</div>
					</div>

					{error && (
						<div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2.5">
							<svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
									clipRule="evenodd"
								/>
							</svg>
							{error}
						</div>
					)}

					{/* Footer */}
					<div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 btn-gradient text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Saving…" : isEditing ? "Save Changes" : "Add Placement"}
						</button>
						<button
							type="button"
							onClick={() => navigate("/scholars/exchange")}
							className="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</PageShell>
	);
}
