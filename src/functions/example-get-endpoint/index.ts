import { handlerPath } from '@/libs/handler-resolver'

export default {
  name: 'example-get-endpoint',
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/'
      }
    }
  ]
}
