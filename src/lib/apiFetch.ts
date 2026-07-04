import { getIdToken, signOut } from "./authRepository";

// In dev: empty string — Vite proxy forwards /api/* to http://127.0.0.1:8000
// In prod: Firebase Functions base URL — paths like /api/v1/... are appended to it
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function withToken(url: RequestInfo, init: RequestInit | undefined, token: string | null): Promise<Response> {
    return fetch(url, {
        ...init,
        headers: {
            ...init?.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? `${API_BASE}${input}` : input;
    const token = await getIdToken();
    const response = await withToken(url, init, token);

    if (response.status === 401) {
        const refreshedToken = await getIdToken(true);
        const retried = await withToken(url, init, refreshedToken);
        if (retried.status === 401) {
            await signOut();
            window.location.href = "/login";
        }
        return retried;
    }

    return response;
}
