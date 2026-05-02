Lead Management CRM

This is a full-stack mini CRM application built to manage sales leads efficiently. It allows users to add, update, filter, and analyze leads in a simple interface.

The project is built using:

React for the frontend
Node.js with Express for the backend
PostgreSQL as the database
Project Structure
lead-crm/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── db.js
│   │   └── routes/
│   │       └── leads.js
│   ├── database/
│   │   └── setup.sql
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   ├── api/
    │   │   └── leadsApi.js
    │   └── components/
    │       ├── StatsDashboard.jsx
    │       ├── AddLeadForm.jsx
    │       ├── LeadCard.jsx
    │       └── SearchFilter.jsx
    ├── public/
    │   └── index.html
    └── package.json
Prerequisites

Make sure the following are installed on your system:

Node.js (version 18 or later)
PostgreSQL (version 13 or later)
npm (comes with Node.js)
Step 1 — Database Setup
Using pgAdmin
Open pgAdmin
Right-click on "Databases" and create a new database
Name it lead_crm
Open Query Tool for the database
Run the SQL file located at backend/database/setup.sql
Using Terminal (psql)
psql -U postgres

CREATE DATABASE lead_crm;
\q

psql -U postgres -d lead_crm -f backend/database/setup.sql
Step 2 — Backend Configuration

Go to backend/.env and update the database credentials:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lead_crm
DB_USER=postgres
DB_PASSWORD=yourpassword

Replace yourpassword with your actual PostgreSQL password.

Step 3 — Run Backend

Open terminal inside the backend folder:

cd backend
npm install
npm run dev

If everything is configured correctly, the server will start and connect to the database.

You can verify by opening:
http://localhost:5000

Step 4 — Run Frontend

Open another terminal:

cd frontend
npm install
npm start

The frontend will run on:
http://localhost:3000

API Endpoints
Method	Endpoint	Description
GET	/api/leads	Fetch all leads
GET	/api/leads/stats	Get dashboard statistics
GET	/api/leads/:id	Get a specific lead
POST	/api/leads	Create a new lead
PATCH	/api/leads/:id	Update lead details
DELETE	/api/leads/:id	Delete a lead
Query Parameters
search → filter by name or phone
status → filter by lead status
source → filter by source (call, whatsapp, field)
sort → newest or oldest
Example POST Request
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "source": "call",
  "notes": "Interested in 2BHK"
}
Example PATCH Request
{
  "status": "Converted",
  "notes": "Deal closed"
}
Features
Add new leads with basic details
Input validation including phone number check
View leads in a card layout
Update lead status through stages
Delete leads
Dashboard with statistics
Search functionality
Filter by status and source
Sort leads by time
Troubleshooting

Backend not starting

Check database credentials in .env
Ensure PostgreSQL service is running
On Windows, verify from Services panel

Frontend cannot fetch data

Confirm backend is running on port 5000
Check browser console for errors

Port already in use

Change backend port in .env (e.g., 5001)
React will prompt automatically for another port if needed
