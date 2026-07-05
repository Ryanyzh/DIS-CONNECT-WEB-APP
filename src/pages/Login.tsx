import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInAsHr, AccessDeniedError } from "../lib/authRepository";
import DisconnectLogo from "../assets/disconnect_logo_transparent.svg";

function friendlyError(code: string): string {
	switch (code) {
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found":
			return "Invalid email or password.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		case "auth/user-disabled":
			return "This account has been disabled.";
		default:
			return "An unexpected error occurred.";
	}
}

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const rawFrom =
		(location.state as { from?: { pathname: string } })?.from?.pathname ?? "/tickets/all";
	const from = (rawFrom === "/logout" || rawFrom === "/login") ? "/tickets/all" : rawFrom;
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			await signInAsHr(email, password);
			console.log(from);
			navigate(from, { replace: true });
		} catch (err) {
			if (err instanceof AccessDeniedError) {
				setError("Access denied. This dashboard is for HR officers only.");
			} else if (err instanceof FirebaseError) {
				setError(friendlyError(err.code));
			} else {
				setError("An unexpected error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-dc-bg dark:bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
			{/* Decorative gradient orbs */}
			<div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-dc-primary/10 dark:bg-dc-primary/5 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-dc-secondary/10 dark:bg-dc-secondary/5 blur-3xl pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-dc-primary/5 dark:bg-dc-primary/3 blur-3xl pointer-events-none" />

			{/* Card */}
			<div className="relative w-full max-w-md">
				<div className="bg-white dark:bg-zinc-900 border border-dc-border dark:border-zinc-800 rounded-2xl shadow-dc-md p-8">
					{/* Brand */}
					<div className="flex flex-col items-center text-center mb-8">
						<img src={DisconnectLogo} alt="dis-connect" className="h-32 w-auto" />
						<span
							style={{ fontFamily: "'Poppins', sans-serif" }}
							className="text-3xl font-bold tracking-tight text-gradient"
						>
							dis-connect
						</span>
						<div className="mt-6 space-y-0.5">
							<h1 className="text-xl font-bold text-dc-text dark:text-white">
								Welcome back
							</h1>
							<p className="text-sm text-dc-text-muted dark:text-zinc-400">
								Sign in to your HR Officer account
							</p>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email */}
						<div>
							<label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="email"
								placeholder="you@example.com"
								className="w-full bg-white dark:bg-zinc-800 border border-dc-border dark:border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-dc-text dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-dc-primary dark:focus:border-dc-primary focus:ring-2 focus:ring-dc-primary/15 transition-colors"
							/>
						</div>

						{/* Password */}
						<div>
							<label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="current-password"
									placeholder="••••••••"
									className="w-full bg-white dark:bg-zinc-800 border border-dc-border dark:border-zinc-700 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-dc-text dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-dc-primary dark:focus:border-dc-primary focus:ring-2 focus:ring-dc-primary/15 transition-colors"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
									tabIndex={-1}
								>
									{showPassword ? (
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

						{/* Error */}
						{error && (
							<div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-lg px-3.5 py-2.5 text-xs">
								<svg
									className="w-4 h-4 flex-shrink-0 mt-0.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
										clipRule="evenodd"
									/>
								</svg>
								{error}
							</div>
						)}

						{/* Submit */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full btn-gradient text-white font-semibold rounded-lg py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
						>
							{isLoading ? (
								<>
									<svg
										className="w-4 h-4 animate-spin"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Signing in…
								</>
							) : (
								"Sign in"
							)}
						</button>
					</form>
				</div>

				{/* Footer note */}
				<p className="text-center text-xs text-dc-text-muted dark:text-zinc-600 mt-5">
					HR officers only · Contact your administrator for access
				</p>
			</div>
		</div>
	);
}
