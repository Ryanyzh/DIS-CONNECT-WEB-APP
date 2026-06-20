import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
				<span className="text-zinc-400 text-sm">Loading...</span>
			</div>
		);
	}

	return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
