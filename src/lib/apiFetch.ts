import { getIdToken } from "./authRepository";

async function withToken(input: RequestInfo, init: RequestInit | undefined, token: string | null): Promise<Response> {
    return fetch(input, {
        ...init,
        headers: {
            ...init?.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const token = await getIdToken();
    const response = await withToken(input, init, token);

    if (response.status === 401) {
        const refreshedToken = await getIdToken(true);
        const retried = await withToken(input, init, refreshedToken);
        if (retried.status === 401) {
            window.location.href = "/login";
        }
        return retried;
    }

    return response;
}
