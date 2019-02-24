import * as playSound from 'play-sound'
import * as path from 'path'
import * as winston from 'winston'
import { inspect } from 'util'

const logger = winston.createLogger({
  defaultMeta: {
    module: 'player'
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})
const opts: any = {}
const player = playSound(opts)
const VALID_PATH_PREFIX = path.resolve(process.cwd()) + path.sep

export const audioPathPrefix = path.join(process.cwd(), 'audio')
export const dohFilename = path.join(audioPathPrefix, '/doh.mp3')

export const errorHandler = (error?: any) => {
  if (error === undefined || error === null) return

  logger.error(JSON.stringify(inspect(error)))

  throw error
}

export const isPathValid = (filename: string): boolean => {
  const absCandidate = path.resolve(filename) + path.sep

  return absCandidate.substring(0, VALID_PATH_PREFIX.length) === VALID_PATH_PREFIX
}

const playFile = (filename: string) => {
  logger.info(`filename: ${filename}`)

  if (!isPathValid(filename)) {
    logger.error('filename is not valid')
    return
  }

  const handle = player.play(filename, errorHandler)
  logger.info(inspect(handle))
}

export {
  playFile
}
