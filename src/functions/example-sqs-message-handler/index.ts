import type { AWS } from '@serverless/typescript'

import { handlerPath } from '@/libs/handler-resolver'

export default {
  name: 'example-sqs-message-handler',
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: process.env.AWS_SQS_QUEUE_ARN,
        enabled: true,
        batchSize: 1
      }
    }
  ]
} as AWS['functions'][keyof AWS['functions']]
