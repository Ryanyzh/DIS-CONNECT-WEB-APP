import { useState } from "react";
import {
	updateProfile,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import PageShell from "../PageShell";

const inputClass =
	"w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-wise-ink dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";
const inputReadonlyClass =
	"w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-zinc-400 dark:text-zinc-500 cursor-not-allowed select-none";
const labelClass =
	"block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide";
const sectionClass =
	"text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4";

const AVATAR_PALETTE = [
	{ bg: "bg-indigo-500", text: "text-white" },
	{ bg: "bg-sky-500", text: "text-white" },
	{ bg: "bg-teal-500", text: "text-white" },
	{ bg: "bg-violet-500", text: "text-white" },
	{ bg: "bg-emerald-500", text: "text-white" },
	{ bg: "bg-amber-500", text: "text-white" },
	{ bg: "bg-rose-500", text: "text-white" },
	{ bg: "bg-slate-500", text: "text-white" },
];

function avatarClasses(name: string | null): { bg: string; text: string } {
	if (!name) return AVATAR_PALETTE[0];
	const i = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_PALETTE.length;
	return AVATAR_PALETTE[i];
}

function getInitials(name: string | null): string {
	if (!name) return "?";
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

function formatTs(ts: string | undefined): string {
	if (!ts) return "—";
	return new Date(ts).toLocaleDateString("en-SG", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function MyAccountPage() {
	const { user } = useAuth();

	// ── Profile form ──────────────────────────────────────────────────────────
	const [displayName, setDisplayName] = useState(user?.displayName ?? "");
	const [savingProfile, setSavingProfile] = useState(false);

	// ── Handlers ──────────────────────────────────────────────────────────────
	const handleSaveProfile = async (e: { preventDefault(): void }) => {
		e.preventDefault();
		if (!auth.currentUser) return;
		setSavingProfile(true);
		try {
			await updateProfile(auth.currentUser, { displayName: displayName.trim() });
			showToast("success", "Display name updated successfully.");
		} catch {
			showToast("error", "Failed to update profile. Please try again.");
		} finally {
			setSavingProfile(false);
		}
	};

	const avatar = avatarClasses(user?.displayName ?? user?.email ?? null);
	const initials = getInitials(user?.displayName ?? user?.email ?? null);

	return (
		<PageShell description="Manage your profile information and account security settings.">
			<div className="grid grid-cols-5 gap-6 items-start">
				{/* ── Left: Profile summary ──────────────────────────────── */}
				<div className="col-span-2 space-y-4 sticky top-6">
					{/* Avatar card */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 flex flex-col items-center text-center gap-3">
						<div
							className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold flex-shrink-0 ${avatar.bg} ${avatar.text}`}
						>
							{initials}
						</div>
						<div>
							<p className="font-semibold text-wise-ink dark:text-zinc-100 text-base leading-tight">
								{user?.displayName ?? "—"}
							</p>
							<p className="text-xs text-zinc-400 mt-0.5">{user?.email ?? "—"}</p>
						</div>
						<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded border bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800">
							<span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
							HR Officer
						</span>
					</div>
					{/* Account metadata */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-5 space-y-0">
						<p className={sectionClass}>Account Info</p>
						{[
							{
								label: "User ID",
								value: user?.uid ? `${user.uid.slice(0, 8)}…` : "—",
							},
							{ label: "Joined", value: formatTs(user?.metadata.creationTime) },
							{ label: "Last login", value: formatTs(user?.metadata.lastSignInTime) },
						].map(({ label, value }) => (
							<div
								key={label}
								className="flex items-start justify-between gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
							>
								<span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
									{label}
								</span>
								<span className="text-xs font-medium text-wise-ink dark:text-zinc-300 text-right truncate max-w-[140px]">
									{value}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* ── Right: Settings forms ──────────────────────────────── */}
				<div className="col-span-3 space-y-5">
					{/* Personal Information */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
						<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
								Personal Information
							</h2>
							<p className="text-xs text-zinc-400 mt-0.5">
								Update your display name shown across the dashboard.
							</p>
						</div>
						<form onSubmit={handleSaveProfile} className="p-6 space-y-4">
							<div>
								<label className={labelClass}>Display Name</label>
								<input
									type="text"
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									placeholder="Your full name"
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Email Address</label>
								<div className="relative">
									<input
										type="email"
										value={user?.email ?? ""}
										readOnly
										className={inputReadonlyClass}
									/>
									<span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-500 px-1.5 py-0.5 rounded">
										Read-only
									</span>
								</div>
								<p className="mt-1.5 text-xs text-zinc-400">
									Email cannot be changed here. Contact an admin if needed.
								</p>
							</div>
							<div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
								<button
									type="submit"
									disabled={savingProfile || !displayName.trim()}
									className="bg-dc-primary hover:bg-dc-primary-hover text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{savingProfile ? "Saving…" : "Save changes"}
								</button>
							</div>
						</form>
					</div>

					{/* Change Password */}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
						<div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h2 className="text-sm font-semibold text-wise-ink dark:text-zinc-100">
								Change Password
							</h2>
							<p className="text-xs text-zinc-400 mt-0.5">
								Use a strong password of at least 8 characters.
							</p>
						</div>
						<form onSubmit={handleChangePassword} className="p-6 space-y-4">
							<div>
								<label className={labelClass}>Current Password</label>
								<div className="relative">
									<input
										type={showCurrent ? "text" : "password"}
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										placeholder="Enter current password"
										className={`${inputClass} pr-10`}
									/>
									<button
										type="button"
										onClick={() => setShowCurrent(!showCurrent)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
									>
										{showCurrent ? (
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
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
												/>
											</svg>
										) : (
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										)}
									</button>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className={labelClass}>New Password</label>
									<div className="relative">
										<input
											type={showNew ? "text" : "password"}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Min. 8 characters"
											className={`${inputClass} pr-10`}
										/>
										<button
											type="button"
											onClick={() => setShowNew(!showNew)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
										>
											{showNew ? (
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
														d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
													/>
												</svg>
											) : (
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
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
											)}
										</button>
									</div>
								</div>
								<div>
									<label className={labelClass}>Confirm New Password</label>
									<input
										type={showNew ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="Repeat new password"
										className={`${inputClass} ${
											confirmPassword && confirmPassword !== newPassword
												? "border-rose-300 dark:border-rose-700 focus:border-rose-400 dark:focus:border-rose-600"
												: ""
										}`}
									/>
									{confirmPassword && confirmPassword !== newPassword && (
										<p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
											Passwords do not match.
										</p>
									)}
								</div>
							</div>

							{/* Strength indicator */}
							{newPassword && (
								<div className="space-y-1.5">
									<div className="flex gap-1">
										{[
											newPassword.length >= 8,
											/[A-Z]/.test(newPassword),
											/[0-9]/.test(newPassword),
											/[^A-Za-z0-9]/.test(newPassword),
										].map((met, i) => (
											<div
												key={i}
												className={`flex-1 h-1 rounded-full transition-colors ${
													met
														? "bg-emerald-500"
														: "bg-zinc-200 dark:bg-zinc-700"
												}`}
											/>
										))}
									</div>
									<p className="text-xs text-zinc-400">
										{(() => {
											const score = [
												newPassword.length >= 8,
												/[A-Z]/.test(newPassword),
												/[0-9]/.test(newPassword),
												/[^A-Za-z0-9]/.test(newPassword),
											].filter(Boolean).length;
											return score <= 1
												? "Weak"
												: score === 2
													? "Fair"
													: score === 3
														? "Good"
														: "Strong";
										})()}{" "}
										password — use uppercase, numbers and symbols to strengthen
										it.
									</p>
								</div>
							)}

							<div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
								<button
									type="submit"
									disabled={
										savingPassword ||
										!currentPassword ||
										!newPassword ||
										!confirmPassword ||
										newPassword !== confirmPassword
									}
									className="bg-dc-primary hover:bg-dc-primary-hover text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{savingPassword ? "Updating…" : "Update password"}
								</button>
							</div>
						</form>
					</div>

					{/* Danger zone */}
					<div className="bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 rounded-xl shadow-sm">
						<div className="px-6 py-4 border-b border-rose-100 dark:border-rose-900/40">
							<h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
								Danger Zone
							</h2>
							<p className="text-xs text-zinc-400 mt-0.5">
								Irreversible actions — proceed with caution.
							</p>
						</div>
						<div className="p-6 flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-wise-ink dark:text-zinc-100">
									Delete account
								</p>
								<p className="text-xs text-zinc-400 mt-0.5">
									Permanently remove your account and all associated data.
								</p>
							</div>
							<button
								type="button"
								className="flex-shrink-0 text-sm font-semibold text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 rounded-lg px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
							>
								Delete account
							</button>
						</div>
					</div>
				</div>
			</div>
		</PageShell>
	);
}
