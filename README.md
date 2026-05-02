Lead Management CRM

A full-stack CRM application designed to manage and track sales leads efficiently.
It provides a clean interface to create, update, filter, and analyze leads.

Overview

This project demonstrates a complete full-stack workflow using modern technologies:

Frontend: React
Backend: Node.js + Express
Database: PostgreSQL

It is structured to reflect real-world application architecture and can be extended easily.



lead-crm/
│
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

Make sure your system has the following installed:

Node.js (v18 or higher)
PostgreSQL (v13 or higher)
npm
Database Setup
Using pgAdmin
Create a new database named lead_crm
Open Query Tool
Run the SQL file:
backend/database/setup.sql
Using Terminal
psql -U postgres

CREATE DATABASE lead_crm;
\q

psql -U postgres -d lead_crm -f backend/database/setup.sql
Backend Configuration

Update the .env file inside the backend folder:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lead_crm
DB_USER=postgres
DB_PASSWORD=yourpassword
Running the Backend
cd backend
npm install
npm run dev

Server will start at:

http://localhost:5000
Running the Frontend
cd frontend
npm install
npm start

Application will run at:

http://localhost:3000
API Reference
Endpoints
Method	Endpoint	Description
GET	/api/leads	Fetch all leads
GET	/api/leads/stats	Fetch statistics
GET	/api/leads/:id	Fetch single lead
POST	/api/leads	Create new lead
PATCH	/api/leads/:id	Update lead
DELETE	/api/leads/:id	Delete lead
Query Parameters
Parameter	Description
search	Search by name or phone
status	Filter by lead status
source	Filter by source
sort	newest or oldest
Sample Request

Create Lead

{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "source": "call",
  "notes": "Interested in 2BHK"
}

Update Lead

{
  "status": "Converted",
  "notes": "Deal closed"
}
Features
Lead creation with validation
Phone number format checking
Card-based UI for lead display
Lead status tracking
Search and filtering
Sorting functionality
Dashboard analytics (conversion rate, counts)
Delete and update operations
Common Issues
Backend not starting
Verify database credentials
Ensure PostgreSQL service is running
Frontend not fetching data
Confirm backend is running on port 5000
Check browser console logs
Port conflicts
Change backend port in .env
React will automatically suggest another port
