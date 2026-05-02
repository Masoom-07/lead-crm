import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import StatsDashboard from "./components/StatsDashboard";
import AddLeadForm from "./components/AddLeadForm";
import LeadCard from "./components/LeadCard";
import SearchFilter from "./components/SearchFilter";
import { getLeads, getStats, addLead, updateLead, deleteLead } from "./api/leadsApi";
import "./App.css";

const DEFAULT_FILTERS = {
  search: "", status: "All", source: "All Sources", sort: "newest",
};

export default function App() {
  const [leads, setLeads]       = useState([]);
  const [stats, setStats]       = useState(null);
  const [filters, setFilters]   = useState(DEFAULT_FILTERS);
  const [loading, setLoading]   = useState(false);
  const [adding, setAdding]     = useState(false);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);


  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.search)                    params.search = filters.search;
      if (filters.status !== "All")          params.status = filters.status;
      if (filters.source !== "All Sources")  params.source = filters.source.toLowerCase();
      if (filters.sort)                      params.sort   = filters.sort;

      const res = await getLeads(params);
      setLeads(res.data || []);
    } catch (err) {
      setError("Could not load leads. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

 
  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch failed:", err.message);
    }
  };

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, []);


  async function handleAdd(formData) {
    setAdding(true);
    try {
      await addLead(formData);
      toast.success("Lead added successfully!");
      setShowForm(false);
      await Promise.all([fetchLeads(), fetchStats()]);
      return true;
    } catch (err) {
      const msg = err.response?.data?.errors?.join(", ") || "Failed to add lead.";
      toast.error(msg);
      return false;
    } finally {
      setAdding(false);
    }
  }


  async function handleStatusChange(id, status) {
    try {
      await updateLead(id, { status });
      toast.success(`Status updated to "${status}"`);
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
      fetchStats();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  }


  async function handleDelete(id) {
    try {
      const res = await deleteLead(id);
      toast.success(res.message || "Lead deleted.");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      fetchStats();
    } catch (err) {
      toast.error("Failed to delete lead.");
    }
  }

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

   
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="header-title"> Lead Pipeline</h1>
            <p className="header-sub">Sales CRM — track and convert your leads</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm((p) => !p)}>
            {showForm ? "✕ Close" : "+ Add Lead"}
          </button>
        </div>
      </header>

      <main className="main">
        
        <StatsDashboard stats={stats} />

      
        {showForm && (
          <div className="form-wrapper">
            <AddLeadForm onAdd={handleAdd} loading={adding} />
          </div>
        )}

       
        <SearchFilter
          {...filters}
          total={leads.length}
          onChange={(f) => setFilters(f)}
        />

        {error && (
          <div className="error-banner">
            ⚠️ {error}
            <button onClick={fetchLeads} className="retry-btn">Retry</button>
          </div>
        )}

       
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading leads…</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No leads found. Add your first lead!</p>
          </div>
        ) : (
          <div className="leads-list">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
