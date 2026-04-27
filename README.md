# ETHYX AI
“Is your AI treating everyone fairly?”

## Problem Statement
**Unbiased AI Decision** — Ensuring Fairness and Detecting Bias in Automated Decisions.

## What the MVP does
- CSV upload
- fairness audit
- dashboard
- explainability view
- mitigation sandbox preview
- report PDF export
- profile/audit history

## Tech Stack
- Next.js 14 App Router
- TypeScript
- Tailwind
- Supabase
- FastAPI
- Azure Blob Storage
- Gemini API
- Recharts
- jsPDF/html2canvas

## Required Environment Variables

### Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`):
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
DATABASE_URL=...
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_STORAGE_CONTAINER_NAME=...
GEMINI_API_KEY=...
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
BACKEND_PORT=8000
```

## How to Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## How to Run Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## Supabase Setup
- Run `supabase/schema.sql` to set up tables.
- Enable RLS policies.
- Configure authentication.

## Azure Setup
- Create a private blob container.
- Set `AZURE_STORAGE_CONNECTION_STRING`.
- Set `AZURE_STORAGE_CONTAINER_NAME`.

## Known MVP Limitations
- Mitigation is a sandbox preview, not real production retraining.
- Report is an analytical aid, not a legal certification.
- Fairness metrics depend on dataset quality.
- Advanced fairness metrics may be unavailable without a prediction column.

## Demo Flow
1. Sign up / Login.
2. Upload CSV dataset.
3. Map columns (target, protected attributes).
4. Run the fairness audit.
5. View results on the dashboard.
6. Open explain/mitigate/report views.
7. Export PDF report.
