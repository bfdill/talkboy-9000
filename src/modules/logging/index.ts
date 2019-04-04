import * as winston from 'winston'
import * as winstonDailyRotateFile from 'winston-daily-rotate-file'

export * from '../../middleware'

export const getDefaultTransports = () => [
  new winston.transports.Console({
    level: 'silly',
    format: winston.format.simple(),
    silent: true
  }),
  new winstonDailyRotateFile({
    level: 'silly',
    format: winston.format.prettyPrint(),
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  })
]

export const createLogger = (meta: any) =>
  winston.createLogger({
    transports: getDefaultTransports(),
    defaultMeta: meta,
    levels: winston.config.npm.levels,
    exitOnError: false
  })
