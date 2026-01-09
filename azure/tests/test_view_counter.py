import pytest
import json
from unittest.mock import MagicMock
from azure.cosmos.exceptions import CosmosResourceNotFoundError, CosmosAccessConditionFailedError


class TestJsonResponse:
    """Tests for _json_response helper function."""

    def test_json_response_format(self, mock_env):
        """Response should have correct mimetype and body."""
        from function_app import _json_response

        response = _json_response({"count": 42})

        assert response.status_code == 200
        assert response.mimetype == "application/json"
        body = json.loads(response.get_body())
        assert body["count"] == 42

    def test_json_response_custom_status(self, mock_env):
        """Response should support custom status codes."""
        from function_app import _json_response

        response = _json_response({"error": "test"}, status_code=500)

        assert response.status_code == 500


class TestGetContainer:
    """Tests for _get_container function."""

    def test_raises_on_missing_endpoint(self, monkeypatch):
        """Should raise ValueError if COSMOSDB_ENDPOINT is missing."""
        monkeypatch.delenv("COSMOSDB_ENDPOINT", raising=False)
        monkeypatch.delenv("COSMOSDB_KEY", raising=False)

        # Need to reload module to pick up missing env vars
        import importlib
        import function_app
        importlib.reload(function_app)

        with pytest.raises(ValueError, match="Missing COSMOSDB"):
            function_app._get_container()


class TestEnsureCounterExists:
    """Tests for _ensure_counter_exists function."""

    def test_returns_existing_item(self, mock_env, mock_container):
        """Should return existing counter if found."""
        from function_app import _ensure_counter_exists

        # Setup mock to return existing item
        mock_container.read_item.return_value = {"id": "global", "count": 10}

        result = _ensure_counter_exists(mock_container)

        assert result["count"] == 10
        mock_container.create_item.assert_not_called()

    def test_creates_new_item_if_not_found(self, mock_env, mock_container):
        """Should create new counter if not found."""
        from function_app import _ensure_counter_exists

        # Setup mock to raise not found, then succeed
        mock_container.read_item.side_effect = CosmosResourceNotFoundError()
        mock_container.create_item.return_value = None

        result = _ensure_counter_exists(mock_container)

        assert result["count"] == 0
        mock_container.create_item.assert_called_once()


class TestIncrementCount:
    """Tests for increment_count function."""

    def test_increments_successfully(self, mock_env, mock_container, mocker):
        """Should increment count and return new value."""
        # Mock _get_container to return our mock_container
        mocker.patch("function_app._get_container", return_value=mock_container)

        from function_app import increment_count

        # Setup mock
        mock_container.read_item.return_value = {
            "id": "global",
            "count": 5,
            "_etag": "test-etag"
        }
        mock_container.replace_item.return_value = None

        result = increment_count()

        assert result["count"] == 6

    def test_retries_on_conflict(self, mock_env, mock_container, mocker):
        """Should retry when ETag conflict occurs."""
        # Mock _get_container to return our mock_container
        mocker.patch("function_app._get_container", return_value=mock_container)

        from function_app import increment_count

        # First read succeeds
        mock_container.read_item.return_value = {
            "id": "global",
            "count": 5,
            "_etag": "test-etag"
        }

        # First replace fails with conflict, second succeeds
        mock_container.replace_item.side_effect = [
            CosmosAccessConditionFailedError(),
            None  # Success on retry
        ]

        result = increment_count()

        assert result["count"] == 6
        assert mock_container.replace_item.call_count == 2


class TestViewCounterEndpoint:
    """Tests for view_counter HTTP endpoint."""

    def test_returns_200_on_success(self, mock_env, mock_container, mocker):
        """Endpoint should return 200 with count."""
        from function_app import view_counter

        # Mock increment_count to avoid full CosmosDB setup
        mocker.patch("function_app.increment_count", return_value={"count": 42})

        # Create mock request
        mock_request = MagicMock()
        mock_request.method = "GET"

        response = view_counter(mock_request)

        assert response.status_code == 200
        body = json.loads(response.get_body())
        assert body["count"] == 42

    def test_returns_500_on_error(self, mock_env, mocker):
        """Endpoint should return 500 on unexpected error."""
        from function_app import view_counter

        # Mock increment_count to raise exception
        mocker.patch(
            "function_app.increment_count",
            side_effect=Exception("Database error")
        )

        mock_request = MagicMock()
        mock_request.method = "POST"

        response = view_counter(mock_request)

        assert response.status_code == 500
        body = json.loads(response.get_body())
        assert "error" in body