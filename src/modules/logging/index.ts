import * as winston from 'winston'

export const transports = [
  // new winston.transports.Console({
  //   level: 'silly',
  //   format: winston.format.prettyPrint()
  // }),
  new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
  new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
  new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
  new winston.transports.File({
    filename: 'logs/verbose.log',
    level: 'verbose'
  }),
  new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
  new winston.transports.File({ filename: 'logs/silly.log', level: 'silly' })
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
