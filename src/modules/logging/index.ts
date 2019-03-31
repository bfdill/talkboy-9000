import * as winston from 'winston'

export * from './middleware'

export const getDefaultTransports = () => [
  new winston.transports.Console({
    level: 'silly',
    format: winston.format.prettyPrint()
  })
]

export const createLogger = (meta: any) =>
  winston.createLogger({
    transports: getDefaultTransports(),
    defaultMeta: meta,
    levels: winston.config.npm.levels,
    exitOnError: false
  })
