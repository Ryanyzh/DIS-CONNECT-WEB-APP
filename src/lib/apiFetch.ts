import { getIdToken } from "./authRepository";

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
	const token = await getIdToken();
	return fetch(input, {
		...init,
		headers: {
			...init?.headers,
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});
}
