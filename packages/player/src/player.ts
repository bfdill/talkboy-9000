// import * as playSound from 'play-sound'
import * as winston from 'winston'
import { createPlayer, IPlayer } from './types'
import { IPlayerService } from './player.types'

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

export class PlayerService implements IPlayerService {
  static instance: IPlayerService | undefined

  constructor(
    protected readonly player: IPlayer,
    protected readonly soundService: ISoundService
  ) {}

  playFile = (
    filename: string,
    parentLogger: winston.Logger
  ): PromiseLike<void> => {
    const logger = parentLogger.child({
      service: {
        name: 'PlayerService',
        method: 'playFile'
      }
    })

    logger.info({ filename })

    if (!this.soundService.isPathValid(filename, logger)) {
      const message = 'filename path is invalid'
      logger.error({ filename, message })
      return Promise.reject(message)
    }

    return new Promise((resolve, reject) => {
      const next = (error?: any) => {
        if (error === undefined || error === null) {
          logger.debug({
            filename,
            message: 'playback success'
          })
          resolve()
          return
        }

        logger.debug({
          error,
          filename,
          message: 'playback failure'
        })
        reject(error)
      }

      this.player.play(filename, next)
    })
  }

  static getInstance() {
    if (this.instance !== undefined) return this.instance

    this.instance = new PlayerService(
      createPlayer(),
      SoundService.getInstance()
    )

    return this.instance
  }
}
