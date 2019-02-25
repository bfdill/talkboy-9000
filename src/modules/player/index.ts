import * as playSound from 'play-sound'
import * as winston from 'winston'
import { inspect } from 'util'
import { soundService, ISoundService } from '../sounds'
import { createModuleLogger } from '../logging'

const playerServiceLogger = createModuleLogger('PlayerService')
const opts: any = {}
const player = playSound(opts)

export const errorHandler = (error?: any) => {
  if (error === undefined || error === null) return

  // :( womp womp
  playerServiceLogger.error(JSON.stringify(inspect(error)))

  throw error
}

export interface IPlayerService {
  playFile: (filename: string) => PromiseLike<void>
}

export class PlayerService implements IPlayerService {
  constructor(protected readonly soundService: ISoundService, protected readonly logger: winston.Logger) { }

  playFile = (filename: string): PromiseLike<void> => {
    this.logger.info(`filename: ${filename}`)

    if (!this.soundService.isPathValid(filename)) {
      const message = `filename is not valid: ${filename}`
      this.logger.error(message)
      return Promise.reject(message)
    }

    // after i fill out the types i'll make this DI
    player.play(filename, errorHandler)

    return Promise.resolve()
  }
}

export const playerService = new PlayerService(soundService, playerServiceLogger)
