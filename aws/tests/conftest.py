import pytest
import boto3
import os
from moto import mock_aws


@pytest.fixture
def aws_credentials():
    """Mock AWS credentials for moto."""
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"
    os.environ["AWS_DEFAULT_REGION"] = "us-east-1"


@pytest.fixture
def dynamodb_table(aws_credentials):
    """Create a mock DynamoDB table for testing."""
    with mock_aws():
        # Set table name environment variable (required by app.py)
        os.environ["TABLE_NAME"] = "test-counter-table"

        # Create DynamoDB resource
        dynamodb = boto3.resource("dynamodb", region_name="us-east-1")

        # Create the table with same schema as production
        table = dynamodb.create_table(
            TableName="test-counter-table",
            KeySchema=[
                {"AttributeName": "id", "KeyType": "HASH"}  # Partition key
            ],
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "S"}  # String type
            ],
            BillingMode="PAY_PER_REQUEST"
        )

        # Wait for table to be created
        table.meta.client.get_waiter("table_exists").wait(
            TableName="test-counter-table"
        )

        yield table