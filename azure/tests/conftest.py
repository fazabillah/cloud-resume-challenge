import pytest
import os
import sys

# Add function to path so we can import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "function"))


@pytest.fixture
def mock_env(monkeypatch):
    """Set mock environment variables for CosmosDB."""
    monkeypatch.setenv("COSMOSDB_ENDPOINT", "https://test.cosmos.azure.com:443/")
    monkeypatch.setenv("COSMOSDB_KEY", "dGVzdC1rZXk=")  # base64 "test-key"
    monkeypatch.setenv("COSMOSDB_DATABASE_NAME", "testDb")
    monkeypatch.setenv("COSMOSDB_CONTAINER_NAME", "testContainer")
    monkeypatch.setenv("COSMOSDB_PARTITION_KEY", "global")
    monkeypatch.setenv("MAX_RETRIES", "3")


@pytest.fixture
def mock_container(mocker):
    """Mock CosmosDB container and its methods."""
    # Mock the CosmosClient class
    mock_client_class = mocker.patch("function_app.CosmosClient")

    # Create mock chain: client -> database -> container
    mock_client = mocker.MagicMock()
    mock_database = mocker.MagicMock()
    mock_container = mocker.MagicMock()

    mock_client_class.return_value = mock_client
    mock_client.get_database_client.return_value = mock_database
    mock_database.get_container_client.return_value = mock_container

    return mock_container