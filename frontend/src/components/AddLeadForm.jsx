import React, { useState } from "react";

const SOURCES = [
  { id: "call",      label: "Call",      icon: "📞" },
  { id: "whatsapp",  label: "WhatsApp",  icon: "💬" },
  { id: "field",     label: "Field",     icon: "🗺️" },
];

const INITIAL = { name: "", phone: "", source: "", notes: "" };

export default function AddLeadForm({ onAdd, loading }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit phone number.";
    if (!form.source)
      e.source = "Please select a lead source.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onAdd(form);
    if (ok) setForm(INITIAL);
  }

  function set(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Add New Lead</h2>

     
      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input
          id="name" type="text" placeholder="e.g. Rahul Sharma"
          value={form.name} onChange={(e) => set("name", e.target.value)}
          className={errors.name ? "input-err" : ""}
        />
        {errors.name && <span className="err-msg">{errors.name}</span>}
      </div>

    
      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone" type="tel" placeholder="10-digit number"
          value={form.phone} onChange={(e) => set("phone", e.target.value)}
          className={errors.phone ? "input-err" : ""}
        />
        {errors.phone && <span className="err-msg">{errors.phone}</span>}
      </div>

      
      <div className="field">
        <label>Lead Source</label>
        <div className="source-btns">
          {SOURCES.map((s) => (
            <button
              type="button" key={s.id}
              className={`source-btn ${form.source === s.id ? "active" : ""}`}
              onClick={() => set("source", s.id)}
            >
              <span className="src-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        {errors.source && <span className="err-msg">{errors.source}</span>}
      </div>

      <div className="field">
        <label htmlFor="notes">Notes <span className="optional">(optional)</span></label>
        <textarea
          id="notes" rows={3} placeholder="Any additional notes..."
          value={form.notes} onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Adding…" : "+ Add Lead"}
      </button>
    </form>
  );
}
