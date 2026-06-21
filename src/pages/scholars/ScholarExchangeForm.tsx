import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../lib/apiFetch";
import {
	type ExchangePlacementFormData,
	type PlacementType,
	type PlacementStatus,
	PLACEMENT_STATUSES,
	MOCK_PLACEMENTS,
} from "../../types/ExchangePlacement";
import { MOCK_SCHOLARS } from "../../types/Scholar";

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

export function ScholarExchangeFormPage() {
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

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
				// Fallback to mock data when backend not ready
				const mock = MOCK_PLACEMENTS.find((p) => p.id === id);
				if (mock) {
					setForm({
						type: mock.type,
						scholarId: mock.scholarId,
						hostInstitution: mock.hostInstitution,
						country: mock.country,
						city: mock.city,
						startDate: mock.startDate,
						endDate: mock.endDate,
						status: mock.status,
						academicCredits: mock.academicCredits?.toString() ?? "",
						department: mock.department ?? "",
						supervisorName: mock.supervisorName ?? "",
						notes: mock.notes ?? "",
					});
				} else {
					setError("Placement not found.");
				}
			})
			.finally(() => setLoading(false));
	}, [id, isEditing]);

	const set =
		(field: keyof ExchangePlacementFormData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
			setForm((prev) => ({ ...prev, [field]: e.target.value }));

	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		const scholar = MOCK_SCHOLARS.find((s) => s.id === form.scholarId);
		const payload = {
			...form,
			scholarName: scholar?.fullName ?? "",
			studentId: scholar?.studentId ?? "",
			faculty: scholar?.faculty ?? "",
			academicCredits: form.academicCredits ? Number(form.academicCredits) : undefined,
		};

		try {
			const res = await apiFetch(
				isEditing
					? `/api/v1/scholars/exchange/${id}`
					: "/api/v1/scholars/exchange",
				{
					method: isEditing ? "PATCH" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			if (!res.ok) throw new Error();
			navigate("/scholars/exchange");
		} catch {
			// Navigate back anyway when backend is not ready
			navigate("/scholars/exchange");
		} finally {
			setSubmitting(false);
		}
	};

	const inputClass =
		"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-wise-ink dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
	const labelClass = "block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1";

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<span className="text-zinc-400 text-sm">Loading…</span>
			</div>
		);
	}
	

	return (
		<div className="max-w-2xl mx-auto">
			<button
				onClick={() => navigate("/scholars/exchange")}
				className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 mb-6 transition-colors"
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

			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 shadow-sm">
				<h1 className="text-xl font-bold text-wise-ink dark:text-zinc-100 mb-6">
					{isEditing ? "Edit Placement" : "Add Placement"}
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{/* Type + Status */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Type</label>
							<select value={form.type} onChange={set("type")} className={inputClass}>
								{(["Exchange", "Internship"] as PlacementType[]).map((t) => (
									<option key={t} value={t}>
										{t}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className={labelClass}>Status</label>
							<select
								value={form.status}
								onChange={set("status")}
								className={inputClass}
							>
								{PLACEMENT_STATUSES.map((s: PlacementStatus) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Scholar */}
					<div>
						<label className={labelClass}>Scholar</label>
						<select
							value={form.scholarId}
							onChange={set("scholarId")}
							required
							className={inputClass}
						>
							<option value="">Select a scholar…</option>
							{MOCK_SCHOLARS.map((s) => (
								<option key={s.id} value={s.id}>
									{s.fullName} — {s.studentId}
								</option>
							))}
						</select>
					</div>

					{/* Host institution */}
					<div>
						<label className={labelClass}>
							{form.type === "Exchange"
								? "Host University"
								: "Company / Organisation"}
						</label>
						<input
							type="text"
							value={form.hostInstitution}
							onChange={set("hostInstitution")}
							required
							placeholder={
								form.type === "Exchange"
									? "e.g. ETH Zürich"
									: "e.g. Google Singapore"
							}
							className={inputClass}
						/>
					</div>

					{/* City + Country */}
					<div className="grid grid-cols-2 gap-4">
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

					{/* Dates */}
					<div className="grid grid-cols-2 gap-4">
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
					</div>

					{error && <p className="text-rose-500 text-xs">{error}</p>}

					<div className="flex gap-3 pt-1">
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 bg-wise-ink dark:bg-zinc-100 text-wise-canvas dark:text-zinc-900 font-semibold rounded-lg py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Saving…" : isEditing ? "Save Changes" : "Add Placement"}
						</button>
						<button
							type="button"
							onClick={() => navigate("/scholars/exchange")}
							className="px-4 py-2 text-sm text-zinc-500 hover:text-wise-ink dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
