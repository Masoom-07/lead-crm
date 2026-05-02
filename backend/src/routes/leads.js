const express = require("express");
const router = express.Router();
const { pool } = require("../db");


function validateLead({ name, phone, source }) {
  const errors = [];
  if (!name || name.trim().length < 2)
    errors.push("Name must be at least 2 characters.");
  if (!phone || !/^\d{10}$/.test(phone.replace(/\s/g, "")))
    errors.push("Phone must be a 10-digit number.");
  if (!["call", "whatsapp", "field"].includes(source))
    errors.push("Source must be call, whatsapp, or field.");
  return errors;
}


router.get("/", async (req, res) => {
  try {
    const { search, status, source, sort } = req.query;
    let query = "SELECT * FROM leads WHERE 1=1";
    const params = [];
    let idx = 1;

    if (search) {
      query += ` AND (LOWER(name) LIKE $${idx} OR phone LIKE $${idx + 1})`;
      params.push(`%${search.toLowerCase()}%`, `%${search}%`);
      idx += 2;
    }
    if (status) {
      query += ` AND status = $${idx}`;
      params.push(status);
      idx++;
    }
    if (source) {
      query += ` AND source = $${idx}`;
      params.push(source);
      idx++;
    }

    query += sort === "oldest"
      ? " ORDER BY created_at ASC"
      : " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rowCount });
  } catch (err) {
    console.error("GET /leads error:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching leads." });
  }
});


router.get("/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'New') AS new_leads,
        COUNT(*) FILTER (WHERE status = 'Interested') AS interested,
        COUNT(*) FILTER (WHERE status = 'Not Interested') AS not_interested,
        COUNT(*) FILTER (WHERE status = 'Converted') AS converted,
        COUNT(*) FILTER (WHERE source = 'call') AS from_call,
        COUNT(*) FILTER (WHERE source = 'whatsapp') AS from_whatsapp,
        COUNT(*) FILTER (WHERE source = 'field') AS from_field,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'Converted') * 100.0 / NULLIF(COUNT(*), 0), 1
        ) AS conversion_rate
      FROM leads
    `);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("GET /stats error:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching stats." });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads WHERE id = $1", [req.params.id]);
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Lead not found." });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("GET /leads/:id error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, phone, source, notes = "" } = req.body;
    const errors = validateLead({ name, phone, source });
    if (errors.length)
      return res.status(400).json({ success: false, errors });

    const result = await pool.query(
      `INSERT INTO leads (name, phone, source, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), phone.trim(), source, notes.trim()]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: "Lead added successfully." });
  } catch (err) {
    console.error("POST /leads error:", err.message);
    res.status(500).json({ success: false, message: "Server error adding lead." });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ["New", "Interested", "Not Interested", "Converted"];

    if (status && !validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status value." });

    const fields = [];
    const params = [];
    let idx = 1;

    if (status !== undefined) { fields.push(`status = $${idx}`); params.push(status); idx++; }
    if (notes !== undefined) { fields.push(`notes = $${idx}`); params.push(notes); idx++; }

    if (!fields.length)
      return res.status(400).json({ success: false, message: "No fields to update." });

    params.push(req.params.id);
    const result = await pool.query(
      `UPDATE leads SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      params
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Lead not found." });

    res.json({ success: true, data: result.rows[0], message: "Lead updated." });
  } catch (err) {
    console.error("PATCH /leads/:id error:", err.message);
    res.status(500).json({ success: false, message: "Server error updating lead." });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM leads WHERE id = $1 RETURNING id, name",
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Lead not found." });
    res.json({ success: true, message: `Lead "${result.rows[0].name}" deleted.` });
  } catch (err) {
    console.error("DELETE /leads/:id error:", err.message);
    res.status(500).json({ success: false, message: "Server error deleting lead." });
  }
});


router.delete("/", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ success: false, message: "Status required for bulk delete." });
    const result = await pool.query(
      "DELETE FROM leads WHERE status = $1 RETURNING id",
      [status]
    );
    res.json({ success: true, message: `${result.rowCount} leads deleted.` });
  } catch (err) {
    console.error("DELETE bulk error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
