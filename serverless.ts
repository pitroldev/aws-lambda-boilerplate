import dotenv from 'dotenv'

import type { AWS } from '@serverless/typescript'

import exampleSQSMessageHandler from '@/functions/example-sqs-message-handler'
import exampleGetEndpoint from '@/functions/example-get-endpoint'
dotenv.config()

const functions = { exampleSQSMessageHandler, exampleGetEndpoint }

const { AWS_REGION, AWS_SQS_QUEUE_ARN, DEV_QUEUE_NAME, NODE_ENV } =
  process.env as Record<string, string>

const serverlessConfiguration: AWS = {
  service: 'NAME_OF_SERVICE_HERE',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-offline-sqs'
  ],
  provider: {
    name: 'aws',
    region: 'us-east-2',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    timeout: 60,
    environment: {
      AWS_SQS_QUEUE_ARN
    }
  },

  functions,
  package: { individually: true },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    'serverless-offline-sqs': {
      autoCreate: true,
      apiVersion: '2012-11-05',
      endpoint: 'http://0.0.0.0:9324',
      region: AWS_REGION,
      accessKeyId: 'root',
      secretAccessKey: 'root',
      skipCacheInvalidation: false
    }
  }
}

if (NODE_ENV === 'development') {
  Object.assign(serverlessConfiguration, {
    resources: {
      Resources: {
        MyQueue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: DEV_QUEUE_NAME,
            VisibilityTimeout: 60,
            MessageRetentionPeriod: 345600
          }
        }
      }
    }
  })
}

module.exports = serverlessConfiguration
