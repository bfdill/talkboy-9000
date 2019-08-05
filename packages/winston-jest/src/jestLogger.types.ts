import * as winston from 'winston'
import { WinstonJestTransport } from './winstonJestTransport'

export interface IJestLogger {
  callsMatchSnapshot: () => void
  logger: winston.Logger
  transport: WinstonJestTransport
}
