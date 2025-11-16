PROMPT START

You are assisting me in building a full-stack project from scratch called Supreme Tuning.
I need you to generate a complete working codebase with the following requirements.

🎯 PROJECT OVERVIEW

Build:

Backend (Node.js + Express)

Puppeteer DVX Scraper

Frontend (React + Vite)

JSON database system

Admin panel with authentication

Public performance tuning calculator

Deployment-ready configuration

The project must follow the structure and features described below.

🗂 FOLDER STRUCTURE

Create a complete project with this structure:

/backend
  /src
    /routes
    /controllers
    /services
    /scraper
    /middleware
    /utils
  supreme-tuning.json          // main DB
  backups/                     // auto-backups
  app.js
  server.js

/frontend
  /src
    /components
    /pages
    /context
    /utils
  vite.config.js

🛠 BACKEND REQUIREMENTS
1. REST API (Express)

Implement endpoints:

GET    /brands
GET    /models?brand=
GET    /engines?brand=&model=
GET    /stages?brand=&model=&engine=
GET    /power?brand=&model=&engine=&stage=

# Admin
POST   /data            (get full JSON)
POST   /save            (save updated DB)
POST   /login           (admin login)

2. JSON Database

File: supreme-tuning.json
Structure:

{
  "brands": [
    {
      "id": "bmw",
      "name": "BMW",
      "models": [
        {
          "id": "m5-f90",
          "name": "M5 F90",
          "engines": [
            {
              "id": "s63b44t4",
              "name": "S63B44T4",
              "stages": [
                {
                  "stage": "1",
                  "stockHP": 600,
                  "tunedHP": 700,
                  "notes": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

3. Auto-backup System

Every time /save is called, create a file in /backups like:

backup-2025-01-28-18-22.json

🔐 4. Admin Authentication

Use:

JWT

/login endpoint

Middleware authRequired for /save

User credentials stored in .env:

ADMIN_EMAIL=admin@supa.com
ADMIN_PASS=password123
JWT_SECRET=xxxx

🤖 5. DVX PUPPETEER SCRAPER

Create a script in /scraper/scrapeDvx.js with:

Multi-step wizard:

Select Brand

Load Models

Load Engine list

Load Stage power table

Output shape:
{
  stage1: {},
  stage1Plus: {},
  stage2: {},
  stage2Plus: {}
}

Extract:

Stock HP

Stock NM

Tuned HP

Tuned NM

Navigate site:

Use page.waitForSelector

Use stable CSS selectors

Solve multi-step flows with chained waits

⚙ 6. SPECIAL RULES
BMW built after June 2020

Append note:

ECU unlock required


Logic:

if (brand === "BMW" && modelYear >= 2020 && month >= 6)

AMG M177/M178 engines from 2018+

Append note:

CPC upgrade required


Logic:

if (brand === "Mercedes" && engine in ["M177", "M178"] && year >= 2018)

🎨 FRONTEND REQUIREMENTS

React + Vite + Tailwind.

Pages:

Public Calculator

Brand dropdown

Model dropdown

Engine dropdown

Stage selector

Auto-display power gains

Show notes (ECU unlock / CPC upgrade)

Admin Panel

Login page

Editor page

Editable table for brands/models/engines/stages

Autosave to /save endpoint

State management:

Use Context API or Zustand.

🚀 DEPLOYMENT

Provide:

Dockerfile (backend)

docker-compose.yml

Production Vite build config

render.yaml or vercel.json optional

🧩 IMPORTANT

When generating this project:

✔ Write complete working code
✔ Create reusable services and controllers
✔ Make the scraper modular
✔ Ensure JSON database writes safely
✔ Make the frontend fully functional
✔ Use good UI/UX
✔ Provide comments and explanations
✔ No placeholder pseudo-code
✔ Everything must run end-to-end

PROMPT END

✅ Done.

Paste this entire prompt into GitHub Agent, Cursor, or Copilot Workspace and it will generate a complete boilerplate project for you.

If you want, I can also create:

🔥 A README for the repo
🔥 A diagram of the architecture
🔥 The scraper logic in detail
🔥 The admin editor UI mockup
🔥 API contract documentation