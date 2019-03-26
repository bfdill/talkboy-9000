import * as winston from 'winston'

export const transports = [
  new winston.transports.Console({
    level: 'silly',
    format: winston.format.prettyPrint()
  })
]

export const logger = winston.createLogger({
  transports,
  defaultMeta: {
    module: 'default'
  }
})

export const createModuleLogger = (module: string) =>
  winston.createLogger({
    transports,
    defaultMeta: { module },
    levels: winston.config.npm.levels
  })
