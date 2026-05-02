import React from "react";

const STATUS_FILTERS = ["All", "New", "Interested", "Not Interested", "Converted"];
const SOURCE_FILTERS = ["All Sources", "Call", "WhatsApp", "Field"];

export default function SearchFilter({ search, status, source, sort, onChange, total }) {
  function set(key, val) {
    onChange({ search, status, source, sort, [key]: val });
  }

  return (
    <div className="search-filter-bar">
      
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => set("search", e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="clear-btn" onClick={() => set("search", "")}>✕</button>
        )}
      </div>

      
      <div className="filters-row">
        {/* Status tabs */}
        <div className="filter-tabs">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`ftab ${status === s ? "ftab-active" : ""}`}
              onClick={() => set("status", s)}
            >
              {s}
            </button>
          ))}
        </div>

       
        <select
          value={source}
          onChange={(e) => set("source", e.target.value)}
          className="filter-select"
        >
          {SOURCE_FILTERS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        
        <select
          value={sort}
          onChange={(e) => set("sort", e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <p className="results-count">{total} lead{total !== 1 ? "s" : ""} found</p>
    </div>
  );
}
