import React, { useState } from "react";

const STATUS_OPTIONS = ["New", "Interested", "Not Interested", "Converted"];

const STATUS_STYLE = {
  New:             { bg: "#EFF6FF", color: "#1D4ED8" },
  Interested:      { bg: "#F0FDF4", color: "#15803D" },
  "Not Interested":{ bg: "#FEF2F2", color: "#B91C1C" },
  Converted:       { bg: "#F0FDFA", color: "#0F766E" },
};

const SOURCE_LABEL = { call: "📞 Call", whatsapp: "💬 WhatsApp", field: "🗺️ Field" };

const AVATAR_COLORS = [
  ["#EDE9FE","#5B21B6"], ["#D1FAE5","#065F46"], ["#FEE2E2","#991B1B"],
  ["#FEF3C7","#92400E"], ["#DBEAFE","#1E40AF"], ["#FCE7F3","#9D174D"],
];

function avatarColors(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function initials(name) {
  return name.split(" ").map((p) => p[0] || "").slice(0, 2).join("").toUpperCase() || "?";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function LeadCard({ lead, onStatusChange, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [bg, textColor] = avatarColors(lead.name);
  const statusStyle = STATUS_STYLE[lead.status] || STATUS_STYLE.New;

  async function handleStatusChange(e) {
    setUpdating(true);
    await onStatusChange(lead.id, e.target.value);
    setUpdating(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete lead "${lead.name}"?`)) return;
    setDeleting(true);
    await onDelete(lead.id);
  }

  return (
    <div className={`lead-card ${deleting ? "deleting" : ""}`}>
      <div className="lead-main" onClick={() => setExpanded((p) => !p)}>
        
        <div className="avatar" style={{ background: bg, color: textColor }}>
          {initials(lead.name)}
        </div>

      
        <div className="lead-info">
          <span className="lead-name">{lead.name}</span>
          <div className="lead-meta">
            <span>📱 {lead.phone}</span>
            <span>{SOURCE_LABEL[lead.source]}</span>
            <span className="lead-date">{formatDate(lead.created_at)}</span>
          </div>
        </div>

        
        <span className="status-badge" style={statusStyle}>
          {lead.status}
        </span>

        <span className={`expand-arrow ${expanded ? "open" : ""}`}>›</span>
      </div>

      
      {expanded && (
        <div className="lead-actions">
          {lead.notes && (
            <p className="lead-notes">📝 {lead.notes}</p>
          )}
          <div className="actions-row">
            <div className="status-update">
              <label>Update status:</label>
              <select
                value={lead.status}
                onChange={handleStatusChange}
                disabled={updating}
                className="status-select"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {updating && <span className="updating-text">Saving…</span>}
            </div>
            <button
              className="btn-delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "🗑 Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
