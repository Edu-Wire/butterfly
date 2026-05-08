const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function apiUrl(path: string): string {
    // path should start with /api/...
    return `${API_BASE}${path}`;
}

type FetchOptions = RequestInit & { token?: string };

export async function apiFetch(path: string, options: FetchOptions = {}) {
    const { token, headers, ...rest } = options;

    const mergedHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string>),
    };

    return fetch(apiUrl(path), { headers: mergedHeaders, ...rest });
}
