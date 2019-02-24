import * as winston from 'winston'

const transports = [
  new winston.transports.Console({
    format: winston.format.simple()
  })
]

const logger = winston.createLogger({
  transports,
  defaultMeta: {
    module: 'default'
  },
  format: winston.format.json()
})

export {
  logger,
  transports
}
