import { type SQSEvent, type SQSRecord } from 'aws-lambda'

import middy from '@middy/core'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import eventNormalizerMiddleware from '@middy/event-normalizer'

const processMessage = async (message: SQSRecord): Promise<void> => {
  console.log(`[${message.messageId}] Processing message`)
  console.log(`[${message.messageId}] Message body: ${message.body}`)

  console.log(
    `[${message.messageId}] Message attributes: ${JSON.stringify(
      message.attributes
    )}`
  )

  await Promise.resolve()
}

const exampleSQSMessageHandler = async (
  event: SQSEvent
): Promise<Array<PromiseSettledResult<SQSRecord>>> => {
  const messages = event.Records

  return await Promise.allSettled(
    messages.map(async (message) => {
      await processMessage(message)

      return message
    })
  )
}

export const main = middy(exampleSQSMessageHandler)
  .use(eventNormalizerMiddleware())
  .use(
    sqsBatch({
      logger(reason, record) {
        console.log({ reason, record })
      }
    })
  )
