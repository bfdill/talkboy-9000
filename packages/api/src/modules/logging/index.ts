import * as winston from 'winston'
import * as winstonTransport from 'winston-transport'
import * as winstonDailyRotateFile from 'winston-daily-rotate-file'

export * from '../../middleware'

const format = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.prettyPrint()
)

export const getDefaultTransports = ():
  | winstonTransport
  | winstonTransport[] => [
  new winston.transports.Console({
    format,
    level: 'info'
  }),
  new winstonDailyRotateFile({
    format,
    level: 'info',
    filename: 'logs/%DATE%.info.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d'
  }),
  new winstonDailyRotateFile({
    format,
    level: 'debug',
    filename: 'logs/%DATE%.debug.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '2d'
  }),
  new winstonDailyRotateFile({
    format,
    level: 'silly',
    filename: 'logs/%DATE%.silly.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '2d'
  })
]

export const createLogger = (meta: any) =>
  winston.createLogger({
    transports: getDefaultTransports(),
    defaultMeta: meta,
    levels: winston.config.npm.levels,
    exitOnError: false
  })
