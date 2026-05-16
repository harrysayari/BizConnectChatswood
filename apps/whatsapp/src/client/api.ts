import type { Business, UpdateBusiness, CreateIssue, Issue } from "@bizconnect/shared";

const BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const apiClient = {
  getBusiness: (id: string) => request<Business>(`/businesses/${id}`),
  updateBusiness: (id: string, body: UpdateBusiness) =>
    request<{ success: boolean }>(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  createIssue: (body: CreateIssue) =>
    request<{ id: string }>("/issues", { method: "POST", body: JSON.stringify(body) }),
  updateIssueStatus: (id: string, status: Issue["status"]) =>
    request<{ success: boolean }>(`/issues/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};
