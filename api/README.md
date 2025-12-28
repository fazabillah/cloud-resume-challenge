# API (Local Mock)

FastAPI mock server for local development. Simulates the view counter API that runs on AWS Lambda / Azure Functions in production.

## Quick Start

```bash
python3 -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Server: http://localhost:8000

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
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

Counter persists in `counter.json` (gitignored).

Manual reset:
```bash
echo '{"count": 0}' > counter.json
```

## CORS

Configured for Vite dev server:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Production Equivalents

| Local (FastAPI) | AWS | Azure |
|-----------------|-----|-------|
| `counter.json` | DynamoDB | CosmosDB |
| `uvicorn` | Lambda + API Gateway | Azure Functions |
| Manual CORS | SAM CORS config | Function CORS |

## Migration Notes

This mock mirrors the production API contract:

```json
// Response format
{"count": 123}
```

AWS Lambda implementation: [aws/src/counter/app.py](../aws/src/counter/app.py)
