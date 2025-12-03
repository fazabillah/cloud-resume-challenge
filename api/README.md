# Cloud Resume Counter API

Mock Python API for the view counter feature (localhost development).

## Setup

1. Create virtual environment:
   ```bash
   cd api
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

   Server runs at: http://localhost:8000

## API Endpoints

- **GET /** - Health check
- **GET /api/counter** - Get current count (no increment)
- **POST /api/counter/increment** - Increment and return new count
- **POST /api/counter/reset** - Reset counter to 0 (dev only)
- **GET /docs** - Interactive API documentation (Swagger UI)

## Testing

```bash
# Get current count
curl http://localhost:8000/api/counter

# Increment counter
curl -X POST http://localhost:8000/api/counter/increment

# Reset counter
curl -X POST http://localhost:8000/api/counter/reset
```

## Counter Storage

Counter persists in `counter.json` (gitignored). To reset manually:
```bash
echo '{"count": 0}' > counter.json
```

## Migration to AWS Lambda

This API is designed for easy migration:
1. Replace FastAPI with AWS Lambda handler
2. Replace JSON file with DynamoDB table
3. Add API Gateway integration
4. Update CORS for production domain
