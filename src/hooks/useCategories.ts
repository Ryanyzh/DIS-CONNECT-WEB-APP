import { useState, useEffect } from "react";
import { apiFetch } from "../lib/apiFetch";

export interface Category {
	category_id: string;
	category_name: string;
}

export function useCategories(): Category[] {
	const [categories, setCategories] = useState<Category[]>([]);
	useEffect(() => {
		apiFetch("/api/v1/categories")
			.then((res) => res.json())
			.then((data: Category[]) => setCategories(data))
			.catch((err) => console.error("Failed to load categories:", err));
	}, []);
	return categories;
}
