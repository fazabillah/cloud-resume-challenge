# API (Local Mock)

FastAPI mock server for local development. Simulates the view counter API.

## Why this exists

When developing the frontend locally you dont want to hit the production Lambda. This mock provides the same API contract so the frontend works without deploying anything.

## Quick start

```bash
python3 -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Server runs at http://localhost:8000

## Endpoints

| Method | Path | What it does |
|--------|------|--------------|
| GET | `/` | Health check |
| GET | `/api/counter` | Get count (no increment) |
| POST | `/api/counter/increment` | Increment and return count |
| POST | `/api/counter/reset` | Reset to 0 (dev only) |
| GET | `/docs` | Swagger UI |

## Testing

```bash
# Health check
curl http://localhost:8000

# Get count
curl http://localhost:8000/api/counter

# Increment
curl -X POST http://localhost:8000/api/counter/increment

# Reset
curl -X POST http://localhost:8000/api/counter/reset
```

## Storage

Counter persists in `counter.json`. Gitignored.

Reset manually:
```bash
echo '{"count": 0}' > counter.json
```

Or just delete the file.

## CORS

Configured for Vite dev server:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

If you change the frontend port, update the CORS config in `app.py`.

## Production equivalents

| This mock | AWS | Azure |
|-----------|-----|-------|
| `counter.json` | DynamoDB | CosmosDB |
| FastAPI + uvicorn | Lambda + API Gateway | Azure Functions |
| `allow_origins` in code | SAM CORS config | Function CORS settings |

## API contract

Both mock and production return the same format:

```json
{"count": 123}
```

So the frontend doesnt care which backend its talking to.

## Troubleshooting

### Port already in use

```bash
lsof -i :8000
kill -9 <PID>
```

Or use a different port:
```bash
uvicorn app:app --reload --port 8001
```

### CORS errors in browser

Check the error message. Usually means your frontend URL isnt in the allowed origins list. Update `app.py`.
