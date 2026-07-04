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
				</div>
			</div>
		</PageShell>
	);
}
