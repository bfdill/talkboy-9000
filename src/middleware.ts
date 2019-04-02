import * as compose from 'koa-compose'
import * as winston from 'winston'
import * as uuid from 'uuid/v4'
import { IApplicationContext, ApplicationMiddleware } from './types'

export interface ISystemMiddleware {
  addLoggerToContext: ApplicationMiddleware
  middleware: ApplicationMiddleware
  requestLogger: ApplicationMiddleware
  setInitialState: ApplicationMiddleware
}

export class SystemMiddleware implements ISystemMiddleware {
  constructor(protected readonly logger: winston.Logger) {}

  addLoggerToContext = async (
    context: IApplicationContext,
    next: () => Promise<void>
  ) => {
    context.logger = this.logger
    await next()
  }

  requestLogger = async (
    context: IApplicationContext,
    next: () => Promise<void>
  ) => {
    const start = Date.now()
    let error: any = undefined

    try {
      await next()
    } catch (e) {
      error = e
    }

    const end = Date.now()
    const duration = end - start

    context.logger
      .child({
        middleware: {
          name: 'request logger'
        }
      })
      .log(error === undefined ? 'info' : 'error', 'request', {
        start,
        end,
        duration,
        error
      })
  }

  setInitialState = async (
    context: IApplicationContext,
    next: () => Promise<void>
  ) => {
    context.state = {
      correlationId: uuid()
    }
    context.res.setHeader('x-correlation-id', context.state.correlationId)

    await next()
  }

  middleware = compose<IApplicationContext>([
    this.addLoggerToContext,
    this.setInitialState,
    this.requestLogger
  ])
}
