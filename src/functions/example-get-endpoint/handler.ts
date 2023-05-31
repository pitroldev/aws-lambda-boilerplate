import { type APIGatewayEvent } from 'aws-lambda'

import middy from '@middy/core'

interface APIExampleResponse {
  statusCode: number
  body: string
  headers: Record<string, string>
}

async function exampleGetEndpoint(
  event: APIGatewayEvent
): Promise<APIExampleResponse> {
  return {
    statusCode: 200,
    body: JSON.stringify(event, null, 2),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

export const main = middy(exampleGetEndpoint)
