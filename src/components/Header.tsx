import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
	darkMode: boolean;
	onToggleDarkMode: () => void;
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

const AVATAR_PALETTE = [
	{ bg: "#e0e7ff", text: "#3730a3" }, // indigo
	{ bg: "#e0f2fe", text: "#075985" }, // sky
	{ bg: "#ccfbf1", text: "#0f766e" }, // teal
	{ bg: "#ede9fe", text: "#5b21b6" }, // violet
	{ bg: "#dcfce7", text: "#166534" }, // green
	{ bg: "#fef3c7", text: "#92400e" }, // amber
	{ bg: "#ffe4e6", text: "#9f1239" }, // rose
	{ bg: "#f1f5f9", text: "#334155" }, // slate
];

function avatarColor(name: string | null): { bg: string; text: string } {
	if (!name) return AVATAR_PALETTE[0];
	const index = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_PALETTE.length;
	return AVATAR_PALETTE[index];
}

export default function Header({ onToggleDarkMode }: HeaderProps) {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [searchFocus, setSearchFocus] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	const displayName = user?.displayName ?? user?.email ?? "User";
	const firstName = displayName.split(" ")[0];
	const initials = getInitials(user?.displayName ?? user?.email ?? null);
	const bgColor = avatarColor(user?.displayName ?? user?.email ?? null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setShowUserMenu(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="sticky top-0 z-20 border-b border-wise-ink/10 bg-wise-canvas shadow-sm dark:border-wise-canvasSoft/20 dark:bg-wise-ink">
			<div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
				{/* Search Bar */}
				<div className="flex-1 max-w-2xl">
					<div
						className={`flex items-center rounded-xl border bg-white transition ${
							searchFocus
								? "border-wise-active dark:border-wise-mute"
								: "border-wise-ink/20 dark:border-wise-mute"
						} dark:bg-wise-ink`}
					>
						<svg
							className="ml-3 h-5 w-5 flex-shrink-0 text-wise-ink dark:text-wise-canvas"
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
							placeholder="Search or type command..."
							onFocus={() => setSearchFocus(true)}
							onBlur={() => setSearchFocus(false)}
							className="flex-1 bg-transparent px-4 py-2 text-sm text-wise-ink placeholder:text-wise-mute outline-none dark:placeholder:text-wise-neutral dark:text-white"
						/>
						<span className="flex items-center gap-1 px-4 text-xs font-medium text-wise-mute dark:text-wise-neutral">
							⌘ K
						</span>
					</div>
				</div>

				{/* Right Actions */}
				<div className="flex items-center gap-2 sm:gap-3">
					<button
						type="button"
						onClick={onToggleDarkMode}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-wise-ink/20 bg-wise-canvas text-wise-ink transition hover:bg-wise-active active:bg-wise-neutral dark:border-wise-canvasSoft/30 dark:bg-wise-ink dark:text-white dark:hover:bg-[#1a1f14]"
					>
						<svg
							className="w-6 h-6 text-wise-ink dark:text-wise-mute"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								fill-rule="evenodd"
								d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<div className="relative" ref={userMenuRef}>
						<button
							type="button"
							onClick={() => setShowUserMenu(!showUserMenu)}
							className="inline-flex items-center gap-2 rounded-full border border-wise-ink/20 bg-wise-canvas px-4 py-2 text-sm font-semibold text-wise-ink transition hover:bg-wise-active dark:border-wise-mute dark:bg-wise-body dark:text-white dark:hover:bg-[#1a1f14]"
						>
							<div
								className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
								style={{ backgroundColor: bgColor.bg, color: bgColor.text }}
							>
								{initials}
							</div>
							<span className="hidden sm:inline">{firstName}</span>
							<svg
								className={`h-4 w-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{showUserMenu && (
							<div className="absolute right-0 mt-2 w-56 rounded-wiseXl border border-wise-ink/20 bg-wise-canvas shadow-lg dark:border-wise-canvasSoft/20 dark:bg-wise-ink">
								<div className="border-b border-wise-ink/10 px-4 py-4 dark:border-wise-canvasSoft/20">
									<div className="flex items-center gap-3 mb-1">
										<div
											className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
											style={{
												backgroundColor: bgColor.bg,
												color: bgColor.text,
											}}
										>
											{initials}
										</div>
										<div className="min-w-0">
											<p className="font-semibold text-wise-ink dark:text-wise-canvas leading-tight truncate">
												{displayName}
											</p>
											<p className="text-xs text-wise-body dark:text-wise-canvasSoft mt-0.5 truncate">
												{user?.email ?? ""}
											</p>
										</div>
									</div>
								</div>
								<div className="space-y-1 p-2">
									<button onClick={() => { navigate("/profile/account"); setShowUserMenu(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										Account settings
									</button>
								</div>
								<div className="border-t border-slate-200/80 p-2 dark:border-slate-700/80">
									<button
										onClick={() => navigate("/logout")}
										className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
									>
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											/>
										</svg>
										Sign out
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
