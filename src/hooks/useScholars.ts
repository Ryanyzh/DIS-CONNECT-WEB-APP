import { useState, useEffect } from "react";
import { type Scholar } from "../types/Scholar";
import { apiFetch } from "../lib/apiFetch";

export function normalizeScholar(s: any): Scholar {
	return {
		id: s.scholar_id ?? s.id ?? "",
		name: s.full_name ?? s.name ?? "",
		email: s.email ?? "",
		studentId: s.student_id ?? s.studentId ?? "",
		faculty: s.faculty ?? "",
		program: s.program ?? "",
		yearOfStudy: String(s.year_of_study ?? s.yearOfStudy ?? ""),
		phone: s.phone ?? "",
		preferredContact: s.preferred_contact ?? s.preferredContact ?? "Email",
		scholarshipType: s.scholarship_type ?? s.scholarshipType ?? "",
		status: s.status ?? "Active",
		createdAt: s.created_at ?? s.createdAt ?? "",
		exchange: s.exchange
			? {
					university: s.exchange.university ?? "",
					country: s.exchange.country ?? "",
					startDate: s.exchange.start_date ?? s.exchange.startDate ?? "",
					endDate: s.exchange.end_date ?? s.exchange.endDate ?? "",
					status: s.exchange.status ?? "Upcoming",
				}
			: undefined,
		tickets: Array.isArray(s.tickets)
			? s.tickets.map((t: any) => ({
					id: t.ticket_id ?? t.id ?? "",
					title: t.subject ?? t.title ?? "",
					category: t.category?.category_name ?? t.category ?? "General Query",
					status: t.status?.status_name ?? t.status ?? "Open",
					priority: t.priority?.level ?? t.priority ?? 1,
					createdAt: t.created_at ?? t.createdAt ?? "",
					lastUpdated: t.updated_at ?? t.lastUpdated ?? "",
				}))
			: [],
	};
}

export function useScholars() {
	const [scholars, setScholars] = useState<Scholar[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch("/api/v1/scholars")
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load scholars (${res.status})`);
				return res.json();
			})
			.then((data: any[]) => setScholars(data.map(normalizeScholar)))
			.catch((err: unknown) => setError(String(err)))
			.finally(() => setLoading(false));
	}, []);

	return { scholars, loading, error };
}
