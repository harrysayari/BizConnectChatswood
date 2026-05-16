import type { Business, UpdateBusiness, CreateAlert, Issue, CreateIssue } from "@bizconnect/shared";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  businesses: {
    list: () => request<Business[]>("/businesses"),
    get: (id: string) => request<Business>(`/businesses/${id}`),
    update: (id: string, body: UpdateBusiness) =>
      request<{ success: boolean }>(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  },
  alerts: {
    create: (body: CreateAlert) =>
      request<{ id: string }>("/alerts", { method: "POST", body: JSON.stringify(body) }),
    send: (id: string) =>
      request<{ matched: number; businessIds: string[] }>(`/alerts/${id}/send`, { method: "POST" }),
  },
  issues: {
    create: (body: CreateIssue) =>
      request<{ id: string }>("/issues", { method: "POST", body: JSON.stringify(body) }),
    updateStatus: (id: string, status: Issue["status"]) =>
      request<{ success: boolean }>(`/issues/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  },
};
