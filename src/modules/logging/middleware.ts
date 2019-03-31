import * as uuid from 'uuid/v4'
import { IApplicationContext, ApplicationMiddleware } from '../../types'

export interface ILoggingMiddleware {
  middleware: ApplicationMiddleware
}

export class LoggingMiddleware implements ILoggingMiddleware {
  middleware = (context: IApplicationContext, next: () => Promise<void>) => {
    const correlationId = uuid()
    const start = Date.now()
    let error: any = undefined

    context.state = {
      ...context.state,
      correlationId
    }

    try {
      next()
    } catch (e) {
      error = e
    }

    const end = Date.now()
    const duration = end - start

    context.logger.log(error === undefined ? 'info' : 'error', 'request', {
      start,
      end,
      duration,
      error
    })
  }
}
