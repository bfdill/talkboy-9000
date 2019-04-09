// this file has 'test' in its' name because it can only be loaded in a context
// where jest exists.  once jest exists, it expects a test to be in a 'test' file
// so, yeah, that's a thing and i'm not really digging into this at all
import * as winston from 'winston'
import * as winstonTransport from 'winston-transport'

const timestampMatcher = {
  duration: expect.any(Number),
  end: expect.any(Number),
  start: expect.any(Number)
}

export interface IWinstonJestTransport extends winstonTransport {
  readonly mock: jest.Mock
  callsMatchSnapshot: () => void
}

export class WinstonJestTransport extends winstonTransport
  implements IWinstonJestTransport {
  public readonly mock: jest.Mock = jest.fn()

  constructor(opts?: winstonTransport.TransportStreamOptions) {
    super(opts)
  }

  log = (info: any, next: () => void): any => {
    this.mock(info)
    next()
  }

  logv = (info: any, next: () => void): any => {
    this.mock(info)
    next()
  }

  callsMatchSnapshot = () =>
    this.mock.mock.calls.forEach(call => expect(call).toMatchSnapshot())
}

export interface IJestLogger {
  callsMatchSnapshot: () => void
  logger: winston.Logger
  transport: WinstonJestTransport
}

export const snapshotExistingLogger = (logger: winston.Logger) => {
  const transport = new WinstonJestTransport()
  logger.clear()
  logger.add(transport)
  logger.info('✅test works✅')
  transport.callsMatchSnapshot()
}

export const getJestLogger = (): IJestLogger => {
  const transport: WinstonJestTransport = new WinstonJestTransport()
  return {
    transport,
    callsMatchSnapshot: () => transport.callsMatchSnapshot(),
    logger: winston.createLogger({
      level: 'silly',
      levels: winston.config.npm.levels,
      transports: [transport]
    })
  }
}

describe('modules -> winston-jest', () => {
  test('required test', () => {})
})
