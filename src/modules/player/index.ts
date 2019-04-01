// import * as playSound from 'play-sound'
import { createPlayer, IPlayer } from './types'
import { soundService, ISoundService } from '../sounds'
import { createLogger } from '../logging'
import { ApplicationState } from '../../types'
import winston = require('winston')

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

export const getPlayerServiceLogger = () =>
  createLogger({
    service: 'PlayerService'
  })

export interface IPlayerService {
  playFile: (filename: string, state: ApplicationState) => PromiseLike<void>
}

export class PlayerService implements IPlayerService {
  static instance: IPlayerService | undefined

  constructor(
    protected readonly player: IPlayer,
    protected readonly soundService: ISoundService,
    protected readonly logger: winston.Logger
  ) {}

  playFile = (filename: string, state: ApplicationState): PromiseLike<void> => {
    const method = 'playFile'

    this.logger.info({ filename, method, state })

    if (!this.soundService.isPathValid(filename)) {
      const message = 'filename path is invalid'
      this.logger.error({ filename, message, method, state })
      return Promise.reject(message)
    }

    return new Promise((resolve, reject) => {
      const next = (error?: any) => {
        if (error === undefined || error === null) {
          this.logger.debug({
            filename,
            method,
            state,
            message: 'playback success'
          })
          resolve()
          return
        }

        this.logger.debug({
          error,
          filename,
          method,
          state,
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
      soundService,
      getPlayerServiceLogger()
    )

    return this.instance
  }
}
