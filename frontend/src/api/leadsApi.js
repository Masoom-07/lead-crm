import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Leads ─────────────────────────────────────────────────────────────────
export const getLeads = (params = {}) =>
  api.get("/leads", { params }).then((r) => r.data);

export const getStats = () =>
  api.get("/leads/stats").then((r) => r.data);

export const addLead = (data) =>
  api.post("/leads", data).then((r) => r.data);

export const updateLead = (id, data) =>
  api.patch(`/leads/${id}`, data).then((r) => r.data);

export const deleteLead = (id) =>
  api.delete(`/leads/${id}`).then((r) => r.data);

export default api;
