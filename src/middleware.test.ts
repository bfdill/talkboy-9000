import {
  getJestLogger,
  snapshotExistingLogger,
  IJestLogger
} from './modules/winston-jest/index.test'
import { SystemMiddleware, ISystemMiddleware } from './middleware'
import { IApplicationContext } from './types'
import { getMockApplicationContext } from './__mocks__/applicationContext'
import { inspect } from 'util'

const snapshotLogEntryFailWhaleMethod = (loggedCall: any) => {
  expect(inspect(loggedCall.middleware)).toMatchSnapshot()
  expect(loggedCall.start).toEqual(expect.any(Number))
  expect(loggedCall.end).toEqual(expect.any(Number))
  expect(loggedCall.duration).toEqual(expect.any(Number))
  expect(loggedCall.error).toMatchSnapshot()
  expect(loggedCall.level).toMatchSnapshot()
  expect(loggedCall.message).toMatchSnapshot()
}

describe('middleware', () => {
  let jestLogger: IJestLogger
  let applicationContext: IApplicationContext
  let systemMiddleware: ISystemMiddleware

  beforeEach(() => {
    jestLogger = getJestLogger()
    applicationContext = getMockApplicationContext()
    applicationContext.logger = jestLogger.logger
    systemMiddleware = new SystemMiddleware(jestLogger.logger)
  })

  test('addLoggerToContext', async () => {
    const testLogger = getJestLogger()
    const testContext = getMockApplicationContext()
    const testMiddleware = new SystemMiddleware(testLogger.logger)

    await testMiddleware.addLoggerToContext(testContext, () =>
      Promise.resolve()
    )

    snapshotExistingLogger(testLogger.logger)
  })

  describe('requestLogger', () => {
    test('await next', async () => {
      const next = jest.fn()
      next.mockImplementation(() => Promise.resolve())
      await systemMiddleware.requestLogger(applicationContext, next)
      expect(next).toHaveBeenCalled()

      expect(jestLogger.transport.mock.mock.calls).toHaveLength(1)
      const loggedCall = jestLogger.transport.mock.mock.calls[0][0]
      snapshotLogEntryFailWhaleMethod(loggedCall)
      jestLogger.transport.mock.mockReset()
    })

    test('doh error - muh bad', async () => {
      const next = jest.fn()
      next.mockRejectedValue('muh Bad')
      await systemMiddleware
        .requestLogger(applicationContext, next)
        .catch((reason: any) => {
          expect(reason).toMatchSnapshot()
        })

      expect(jestLogger.transport.mock.mock.calls).toHaveLength(1)
      const loggedCall = jestLogger.transport.mock.mock.calls[0][0]
      snapshotLogEntryFailWhaleMethod(loggedCall)
      jestLogger.transport.mock.mockReset()
    })
  })

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
    jestLogger.callsMatchSnapshot()
  })
})
