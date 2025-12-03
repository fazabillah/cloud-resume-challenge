from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from pathlib import Path

app = FastAPI(
    title="Cloud Resume Counter API",
    description="Mock API for view counter - localhost development",
    version="1.0.0"
)

# CORS configuration for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Counter storage file
COUNTER_FILE = Path(__file__).parent / "counter.json"

# Response model
class CounterResponse(BaseModel):
    count: int

# Initialize counter file if it doesn't exist
def init_counter():
    if not COUNTER_FILE.exists():
        with open(COUNTER_FILE, 'w') as f:
            json.dump({"count": 0}, f)

def read_counter():
    """Read current counter value"""
    init_counter()
    with open(COUNTER_FILE, 'r') as f:
        data = json.load(f)
    return data.get("count", 0)

def write_counter(count: int):
    """Write counter value"""
    with open(COUNTER_FILE, 'w') as f:
        json.dump({"count": count}, f)

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": "Cloud Resume Counter API",
        "status": "running",
        "current_count": read_counter()
    }

@app.get("/api/counter")
def get_counter():
    """Get current counter value without incrementing"""
    count = read_counter()
    return CounterResponse(count=count)

@app.post("/api/counter/increment")
def increment_counter():
    """Increment counter and return new value"""
    try:
        current = read_counter()
        new_count = current + 1
        write_counter(new_count)
        return CounterResponse(count=new_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to increment counter: {str(e)}")

@app.post("/api/counter/reset")
def reset_counter():
    """Reset counter to 0 (development only)"""
    write_counter(0)
    return CounterResponse(count=0)

# Development only: Enable when running with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
