"""
Azure Function: View Counter API

API Contract (matches AWS Lambda):
- GET  /api/view_counter → increment + return {"count": N}
- POST /api/view_counter → increment + return {"count": N}

Note: Both methods increment for AWS frontend compatibility.
"""

import azure.functions as func
from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError, CosmosAccessConditionFailedError
from azure.core import MatchConditions
import json
import logging
import os
import time

# Configuration from environment
COSMOSDB_ENDPOINT = os.getenv("COSMOSDB_ENDPOINT")
COSMOSDB_KEY = os.getenv("COSMOSDB_KEY")
DATABASE_NAME = os.getenv("COSMOSDB_DATABASE_NAME", "viewCounterDb")
CONTAINER_NAME = os.getenv("COSMOSDB_CONTAINER_NAME", "counter")
PARTITION_KEY = os.getenv("COSMOSDB_PARTITION_KEY", "global")
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "5"))

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


def _get_container():
    """Get CosmosDB container client."""
    if not COSMOSDB_ENDPOINT or not COSMOSDB_KEY:
        raise ValueError("Missing COSMOSDB_ENDPOINT or COSMOSDB_KEY")

    client = CosmosClient(COSMOSDB_ENDPOINT, COSMOSDB_KEY)
    database = client.get_database_client(DATABASE_NAME)
    container = database.get_container_client(CONTAINER_NAME)
    return container


def _ensure_counter_exists(container):
    """Create counter document if it doesn't exist."""
    try:
        item = container.read_item(item=PARTITION_KEY, partition_key=PARTITION_KEY)
        return item
    except CosmosResourceNotFoundError:
        logging.info("Creating new counter document")
        new_item = {"id": PARTITION_KEY, "count": 0}
        try:
            container.create_item(body=new_item)
            return new_item
        except Exception as e:
            logging.warning(f"Race condition: {e}")
            return container.read_item(item=PARTITION_KEY, partition_key=PARTITION_KEY)


def _json_response(data, status_code=200):
    """Create JSON HTTP response."""
    return func.HttpResponse(
        body=json.dumps(data),
        status_code=status_code,
        mimetype="application/json"
    )


def get_count():
    """Get current count (GET request)."""
    container = _get_container()
    item = _ensure_counter_exists(container)
    return {"count": item["count"]}


def increment_count():
    """Increment count with optimistic concurrency (POST request)."""
    container = _get_container()

    for attempt in range(MAX_RETRIES):
        try:
            item = _ensure_counter_exists(container)
            current_count = item.get("count", 0)
            current_etag = item.get("_etag")

            new_count = current_count + 1
            updated_item = {"id": PARTITION_KEY, "count": new_count}

            container.replace_item(
                item=PARTITION_KEY,
                body=updated_item,
                etag=current_etag,
                match_condition=MatchConditions.IfNotModified
            )

            logging.info(f"Counter: {current_count} -> {new_count}")
            return {"count": new_count}

        except CosmosAccessConditionFailedError:
            logging.warning(f"Retry {attempt + 1}/{MAX_RETRIES}")
            time.sleep(0.05 * (2 ** attempt))

    raise Exception(f"Failed after {MAX_RETRIES} retries")


@app.route(route="view_counter", methods=["GET", "POST"])
def view_counter(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP endpoint - both GET and POST increment counter.
    Matches AWS Lambda behavior for frontend compatibility.

    GET/POST /api/view_counter → {"count": N}
    """
    try:
        result = increment_count()  # Both methods increment
        return _json_response(result)

    except ValueError as e:
        logging.error(f"Config error: {e}")
        return _json_response({"error": "Server configuration error"}, 500)

    except Exception as e:
        logging.error(f"Error: {e}")
        return _json_response({"error": "Unexpected error"}, 500)