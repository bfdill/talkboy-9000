// import * as playSound from 'play-sound'
import * as winston from 'winston'
import { soundService, ISoundService } from '../sounds'
import { createModuleLogger } from '../logging'
import { createPlayer, IPlayer } from './types'

const playerServiceLogger = createModuleLogger('PlayerService')

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

export interface IPlayerService {
  playFile: (filename: string) => PromiseLike<void>
}

export class PlayerService implements IPlayerService {
  constructor(
    protected readonly player: IPlayer,
    protected readonly soundService: ISoundService,
    protected readonly logger: winston.Logger
  ) {}

  playFile = (filename: string): PromiseLike<void> => {
    this.logger.info(`filename: ${filename}`)

    if (!this.soundService.isPathValid(filename)) {
      const message = `filename is not valid: ${filename}`
      this.logger.error(message)
      return Promise.reject(message)
    }

    return new Promise((resolve, reject) => {
      const next = (error?: any) => {
        if (error === undefined || error === null) {
          this.logger.debug(`playback success: ${filename}`)
          resolve()
          return
        }

        this.logger.error(`playback failure: ${filename}`, { error })
        reject(error)
      }

      this.player.play(filename, next)
    })
  }
}

export const playerService = new PlayerService(
  createPlayer(),
  soundService,
  playerServiceLogger
)
