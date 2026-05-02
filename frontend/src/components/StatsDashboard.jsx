import React from "react";

const cards = [
  { key: "total",        label: "Total Leads",    color: "#3B82F6", bg: "#EFF6FF" },
  { key: "interested",   label: "Interested",     color: "#16A34A", bg: "#F0FDF4" },
  { key: "converted",    label: "Converted",      color: "#0D9488", bg: "#F0FDFA" },
  { key: "conversion_rate", label: "Conv. Rate",  color: "#7C3AED", bg: "#F5F3FF", suffix: "%" },
];

export default function StatsDashboard({ stats }) {
  if (!stats) return null;
  return (
    <div className="stats-grid">
      {cards.map(({ key, label, color, bg, suffix = "" }) => (
        <div key={key} className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
          <p className="stat-label">{label}</p>
          <p className="stat-value" style={{ color }}>
            {stats[key] ?? 0}{suffix}
          </p>
        </div>
      ))}
      <div className="stat-card source-card">
        <p className="stat-label">By Source</p>
        <div className="source-breakdown">
          <span>📞 {stats.from_call ?? 0}</span>
          <span>💬 {stats.from_whatsapp ?? 0}</span>
          <span>🗺️ {stats.from_field ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
