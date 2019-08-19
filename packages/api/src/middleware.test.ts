import {
  getJestLogger,
  snapshotExistingLogger
} from '@talkboy-9000/winston-jest'
import { SystemMiddleware } from './middleware'
import { IApplicationContext } from './types'
import { getMockApplicationContext } from './__mocks__/applicationContext'

describe('middleware', () => {
  const jestLogger = getJestLogger()
  const applicationContext = getMockApplicationContext()
  const systemMiddleware = new SystemMiddleware(jestLogger.logger)

  test('addLoggerToContext', async () => {
    await systemMiddleware.addLoggerToContext(applicationContext, () =>
      Promise.resolve()
    )

    snapshotExistingLogger(applicationContext.logger)
  })

  test('requestLogger', async () => {})

  test('setInitialState', async () => {
    const setHeader = jest.fn()
    const context: IApplicationContext = {
      res: { setHeader }
    } as any

    await systemMiddleware.setInitialState(context, () => Promise.resolve())

    expect(context.state).toBeDefined()
    expect(context.state.correlationId).toBeDefined()
    expect(setHeader).toBeCalledWith(
      'x-correlation-id',
      context.state.correlationId
    )
  })
})
