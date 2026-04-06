# MedBridge Backend

This backend now uses FastAPI + SQLModel with SQLite, real OCR for clean printed documents, rule-based medicine candidate parsing, a document-linked workflow from upload to review to schedule generation, and helper retrieval endpoints for frontend sync.

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

## Supported Upload Types

- `pdf`
- `jpg`
- `jpeg`
- `png`

## Document-Linked Workflow

1. `POST /api/upload`
   - stores the uploaded file locally
   - stores document metadata
   - runs OCR
   - stores OCR text, detected lines, and parsed medicine candidates
   - returns `document_id`

2. `POST /api/medicines/review`
   - accepts reviewed medicine entries
   - can include `document_id`
   - stores reviewed medicines linked to that document
   - returns `review_id` and `document_id`

3. `POST /api/schedule/generate`
   - can include `document_id` and `review_id`
   - uses the persisted reviewed medicines for that document/review
   - stores generated dose rows linked to patient, document, and review
   - returns `schedule_id`, `document_id`, and `review_id`

4. `GET /api/patient/today`
   - reads the latest persisted schedule state for the patient

5. `POST /api/doses/{dose_id}/status`
   - updates persisted dose state and activity history

## Helper Retrieval Endpoints

- `GET /api/documents/{document_id}`
  - returns persisted document metadata, OCR text, detected lines, warnings, medicine candidates, and the latest linked review/schedule IDs

- `GET /api/documents/{document_id}/review`
  - returns the latest persisted reviewed medicines for that document and its `review_id`

- `GET /api/documents/{document_id}/schedule`
  - returns the latest persisted generated schedule for that document with grouped doses and adherence summary

- `GET /api/schedules/{schedule_id}`
  - returns a persisted generated schedule directly by `schedule_id`

These helper routes make it easier for the frontend to reopen upload/review/schedule state after refresh or navigation reset.

## OCR Notes

- `/api/upload` performs real OCR for clean printed PDFs and clear image uploads.
- OCR works best for typed prescriptions, printed medicine sheets, and discharge summaries.
- Handwriting is not guaranteed and may produce warnings or weak extraction.
- The API returns warnings when OCR quality is weak or only limited text is detected.

## Parsing Notes

- OCR output is parsed line-by-line into `medicine_candidates` for the review screen.
- OCR lines are cleaned before parsing to remove numbering, bullets, extra punctuation, and obvious noise-only content.
- Medicine names are normalized to strip trailing schedule words like food timing, frequency, and duration phrases when they leak into OCR text.
- Dosage, timing, food timing, frequency, and duration values are normalized into review-friendly strings.
- Duplicate warnings use a lightweight near-duplicate check on normalized medicine names and dosage.

### Supported Rule-Based Patterns

- dosage values like `500 mg`, `40 mg`, `1 tablet`, `half tablet`
- frequency phrases like `once daily`, `twice daily`, `thrice daily`
- timing phrases like `morning`, `afternoon`, `evening`, `night`, `morning and night`
- food timing phrases like `before food`, `after food`, `before breakfast`, `after lunch`, `after dinner`
- duration phrases like `for 5 days`, `x 7 days`, `continue daily`
- PRN phrases like `SOS`, `if fever`, `if pain`, `as needed`, `when needed`

## Warning Behavior

The parser may return these candidate warnings when justified:

- `missing-dosage`
- `unclear-timing`
- `possible-prn-instruction`
- `low-clarity-line`
- `possible-duplicate`

Final confirmation still happens in the review step.

## Endpoints

- `GET /api/health`
- `POST /api/upload`
- `POST /api/medicines/review`
- `POST /api/schedule/generate`
- `GET /api/patient/today`
- `POST /api/doses/{dose_id}/status`
- `GET /api/documents/{document_id}`
- `GET /api/documents/{document_id}/review`
- `GET /api/documents/{document_id}/schedule`
- `GET /api/schedules/{schedule_id}`

## What Is Real Now

- SQLite database setup with SQLModel
- Patient and caregiver seed data
- Uploaded document metadata persistence
- Local uploaded file storage
- Real OCR text extraction for supported files
- OCR-derived detected lines and warning generation
- Rule-based parsing of OCR lines into structured medicine candidates
- Reviewed medicine persistence linked to document IDs
- Generated dose schedule persistence linked to patient, document, and review IDs
- Dose status update persistence
- Activity log persistence
- helper retrieval endpoints for documents, reviews, and schedules
- `/api/patient/today` reads the latest current schedule state from the database

## Validation Behavior

- review fails clearly if there is no uploaded document or the `document_id` is invalid
- schedule generation fails clearly if no reviewed medicines exist for the chosen document
- document/review/schedule retrieval fails clearly if the requested entity does not exist
- unsupported upload types still fail clearly in `/api/upload`

## What Is Still Approximate

- medicine names are cleaned conservatively, but OCR mistakes can still affect them
- missing or ambiguous timings remain review-dependent
- PRN instructions are flagged, not fully normalized into scheduling logic
- handwritten or low-quality scans are not guaranteed
- final confirmation still happens in the review step

## What Is Still Not Included

- authentication
- reminder scheduling delivery
- caregiver messaging
- AI or ML parsing
- PostgreSQL or production deployment setup

## Limitations

- clean printed documents are supported first
- handwritten prescriptions are not guaranteed
- parsing is rule-based and intentionally conservative
- unclear lines return warnings instead of pretending certainty

## Next Backend Steps

- patient-specific document listing if the frontend needs it later
- stronger duration and timing inference
- persistent reminder scheduling
- notification delivery integration
- PostgreSQL migration for multi-user deployment
