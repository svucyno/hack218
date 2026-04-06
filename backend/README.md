# MedBridge Backend

This backend now uses FastAPI + SQLModel with SQLite for the first real persistence milestone. The existing API routes stay the same so the current frontend can keep calling the same contracts.

## Setup

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate it:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn backend.app.main:app --reload
```

The API starts under `/api`.

## SQLite Storage

By default the app uses a local SQLite database file at:

- `backend/medbridge.db`

Optional environment variables:

- `MEDBRIDGE_DATABASE_URL`
- `MEDBRIDGE_UPLOADS_DIR`
- `MEDBRIDGE_CORS_ORIGINS`

## Endpoints

- `GET /api/health`
- `POST /api/upload`
- `POST /api/medicines/review`
- `POST /api/schedule/generate`
- `GET /api/patient/today`
- `POST /api/doses/{dose_id}/status`

## What Is Real Now

- SQLite database setup with SQLModel
- Patient and caregiver seed data
- Uploaded document metadata persistence
- Reviewed medicine persistence
- Generated dose schedule persistence
- Dose status update persistence
- Activity log persistence
- `/api/patient/today` reads current schedule state from the database

## What Is Still Mocked

- OCR text extraction
- Document line detection
- Medicine parsing intelligence
- Reminder scheduling delivery
- Authentication
- Caregiver messaging
- PostgreSQL or production deployment setup

## Notes For This Phase

- `/api/upload` stores file metadata and the uploaded file path locally, but the extracted text is still mocked.
- `/api/medicines/review` stores normalized reviewed medicine rows.
- `/api/schedule/generate` generates and stores dose rows in SQLite.
- `/api/doses/{dose_id}/status` updates stored dose state and appends activity history.

## Next Backend Steps

- OCR integration
- Structured parsing from extracted text
- Stronger patient/document relationships
- Persistent reminder scheduling
- Notification delivery integration
- PostgreSQL migration for multi-user deployment
