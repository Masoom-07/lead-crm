# 🏠 Lead Management CRM

A full-stack mini CRM to manage sales leads.
Built with **React** (frontend) + **Node.js/Express** (backend) + **PostgreSQL** (database).

---

## 📁 Project Structure

```
lead-crm/
├── backend/
│   ├── src/
│   │   ├── server.js          ← Express app entry point
│   │   ├── db.js              ← PostgreSQL connection + table init
│   │   └── routes/
│   │       └── leads.js       ← All API routes (CRUD + stats)
│   ├── database/
│   │   └── setup.sql          ← SQL schema + seed data
│   ├── .env                   ← DB credentials (edit this!)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js             ← Main React component
    │   ├── App.css            ← All styles
    │   ├── index.js           ← React entry point
    │   ├── api/
    │   │   └── leadsApi.js    ← Axios API calls
    │   └── components/
    │       ├── StatsDashboard.jsx
    │       ├── AddLeadForm.jsx
    │       ├── LeadCard.jsx
    │       └── SearchFilter.jsx
    ├── public/
    │   └── index.html
    └── package.json
```

---

## ⚙️ Prerequisites

Install these before starting:

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (v13 or later)
- npm (comes with Node.js)

---

## 🗄️ Step 1 — Set Up PostgreSQL Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin → right-click "Databases" → Create → Database
2. Name it: `lead_crm` → Save
3. Right-click `lead_crm` → Query Tool
4. Open and run the file: `backend/database/setup.sql`

### Option B: Using psql (terminal)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE lead_crm;
\q

# Run the setup script
psql -U postgres -d lead_crm -f backend/database/setup.sql
```

---

## 🔧 Step 2 — Configure Backend

Edit `backend/.env` with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lead_crm
DB_USER=postgres
DB_PASSWORD=yourpassword    ← change this to your actual password
```

---

## 🚀 Step 3 — Start the Backend

Open a terminal in VS Code:

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Database connected and table ready.
🚀 Server running at http://localhost:5000
```

Test it: open http://localhost:5000 in your browser.

---

## ⚛️ Step 4 — Start the Frontend

Open a **second terminal** in VS Code:

```bash
cd frontend
npm install
npm start
```

The app opens at: **http://localhost:3000**

---

## 🛠️ API Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | /api/leads            | Get all leads (supports filters)   |
| GET    | /api/leads/stats      | Get dashboard stats                |
| GET    | /api/leads/:id        | Get single lead                    |
| POST   | /api/leads            | Add a new lead                     |
| PATCH  | /api/leads/:id        | Update lead status / notes         |
| DELETE | /api/leads/:id        | Delete a lead                      |

### Query Parameters for GET /api/leads
- `search=rahul`       — search by name or phone
- `status=Interested`  — filter by status
- `source=call`        — filter by source (call/whatsapp/field)
- `sort=oldest`        — sort order (newest/oldest)

### POST /api/leads body
```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "source": "call",
  "notes": "Interested in 2BHK"
}
```

### PATCH /api/leads/:id body
```json
{
  "status": "Converted",
  "notes": "Deal closed"
}
```

---

## ✅ Features

- Add leads with name, phone, source (Call/WhatsApp/Field)
- Form validation (required fields, 10-digit phone check)
- View all leads as cards
- Update lead status: New → Interested → Not Interested → Converted
- Delete individual leads
- Dashboard stats (total, interested, converted, conversion rate)
- Search by name or phone
- Filter by status or source
- Sort by newest/oldest

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check `.env` credentials match your PostgreSQL setup
- Make sure PostgreSQL service is running
- Windows: search "Services" → find PostgreSQL → Start

**Frontend shows "Could not load leads":**
- Make sure backend is running on port 5000
- Check browser console for errors

**Port already in use:**
- Backend: change `PORT=5001` in `.env`
- Frontend: React will ask to use another port automatically
