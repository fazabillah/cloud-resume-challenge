import json
import pytest
from unittest.mock import patch
import sys
import os

# Add src to path so we can import the lambda
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "counter"))


class TestLambdaHandler:
    """Tests for the Lambda view counter function."""

    def test_returns_200_on_success(self, dynamodb_table):
        """Handler should return 200 status code on successful increment."""
        # Import inside test so mock is active
        from app import lambda_handler

        # Act
        response = lambda_handler({}, {})

        # Assert
        assert response["statusCode"] == 200

    def test_increments_count(self, dynamodb_table):
        """Handler should increment count on each call."""
        from app import lambda_handler

        # First call
        response1 = lambda_handler({}, {})
        body1 = json.loads(response1["body"])
        count1 = body1["count"]

        # Second call - need to reimport to reset module state
        # Actually, we need to reload the module to pick up new table
        import importlib
        import app
        importlib.reload(app)

        response2 = app.lambda_handler({}, {})
        body2 = json.loads(response2["body"])
        count2 = body2["count"]

        # Assert count increased
        assert count2 == count1 + 1

    def test_response_has_cors_headers(self, dynamodb_table):
        """Response should include CORS headers."""
        from app import lambda_handler

        response = lambda_handler({}, {})

        headers = response["headers"]
        assert headers["Access-Control-Allow-Origin"] == "*"
        assert "GET" in headers["Access-Control-Allow-Methods"]

    def test_response_body_format(self, dynamodb_table):
        """Response body should have count and message."""
        from app import lambda_handler

        response = lambda_handler({}, {})
        body = json.loads(response["body"])

        assert "count" in body
        assert isinstance(body["count"], int)
        assert "message" in body

    def test_returns_500_on_error(self, dynamodb_table, mocker):
        """Handler should return 500 when DynamoDB fails."""
        from app import lambda_handler

        # Mock table.update_item to raise an exception
        mocker.patch(
            "app.table.update_item",
            side_effect=Exception("DynamoDB connection failed")
        )

        response = lambda_handler({}, {})

        assert response["statusCode"] == 500
        body = json.loads(response["body"])
        assert "error" in body