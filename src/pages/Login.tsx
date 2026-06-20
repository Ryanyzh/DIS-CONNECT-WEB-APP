import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInAsHr, AccessDeniedError } from "../lib/authRepository";

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
	const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/tickets/all";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			await signInAsHr(email, password);
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
		<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
			<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm shadow-xl">
				<h1 className="text-2xl font-bold text-zinc-100 mb-1">Sign in</h1>
				<p className="text-zinc-400 text-sm mb-6">HR Dashboard</p>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label className="block text-xs font-medium text-zinc-400 mb-1">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
							className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
							placeholder="you@example.com"
						/>
					</div>
					<div>
						<label className="block text-xs font-medium text-zinc-400 mb-1">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="current-password"
							className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
							placeholder="••••••••"
						/>
					</div>
					{error && <p className="text-rose-400 text-xs">{error}</p>}
					<button
						type="submit"
						disabled={isLoading}
						className="bg-zinc-100 text-zinc-900 font-semibold rounded-lg py-2 text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
				</form>
			</div>
		</div>
	);
}
