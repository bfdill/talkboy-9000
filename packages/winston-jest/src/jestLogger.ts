import * as winston from 'winston'
import { IJestLogger } from './jestLogger.types'
import { WinstonJestTransport } from './winstonJestTransport'

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
