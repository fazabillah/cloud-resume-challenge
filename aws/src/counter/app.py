import json
import boto3
import os
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """
    Lambda function to track view count.

    GET /count - Returns and increments view count
    """

    try:
        # The counter ID (single row for entire website)
        counter_id = 'website-views'

        # Increment counter atomically
        response = table.update_item(
            Key={'id': counter_id},
            UpdateExpression='SET #count = if_not_exists(#count, :start) + :increment',
            ExpressionAttributeNames={
                '#count': 'count'
            },
            ExpressionAttributeValues={
                ':start': 0,
                ':increment': 1
            },
            ReturnValues='UPDATED_NEW'
        )

        # Get the updated count
        count = int(response['Attributes']['count'])

        # Return response with CORS headers
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'count': count,
                'message': 'View count updated successfully'
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to update view count',
                'details': str(e)
            })
        }