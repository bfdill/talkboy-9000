import * as koaRouter from 'koa-router'
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes'
import { ISoundService, soundService } from '../../modules/sounds'
import { IPlayerService, PlayerService } from '../../modules/player'
import { randomIntFromInterval } from '../../utils'
import { ApplicationState, IApplicationContext } from '../../types'
import { createLogger } from '../../modules/logging'
import winston = require('winston')

export const getPlayerControllerLogger = () =>
  createLogger({
    controller: {
      name: 'PlayerController'
    }
  })

export interface IPlayerController {
  playSound: (context: IApplicationContext) => PromiseLike<void>
  playRando: (context: IApplicationContext) => PromiseLike<void>
}

export class PlayerController implements IPlayerController {
  private static instance: IPlayerController | undefined

  constructor(
    protected readonly playerService: IPlayerService,
    protected readonly soundService: ISoundService,
    protected readonly logger: winston.Logger
  ) {}

  playSound = async (context: IApplicationContext) => {
    const { soundId } = context.params
    this.logger.info({
      ...context.state,
      message: `soundId(${soundId})`,
      method: 'playSound'
    })

    if (typeof soundId !== 'string') {
      this.logger.error({
        ...context.state,
        soundId,
        message: 'soundId !== string',
        method: 'playSound'
      })
      context.body = { soundId }
      context.status = BAD_REQUEST
      return
    }

    const sound = this.soundService.getBySoundId(soundId)

    if (sound === undefined) {
      this.logger.error({
        ...context.state,
        soundId,
        message: 'sound === undefined'
      })
      context.body = { soundId }
      context.status = NOT_FOUND
      return
    }

    this.logger.debug({
      ...context.state,
      sound,
      soundId,
      message: 'playSound()'
    })

    await this.playerService.playFile(sound.filename, context.state)

    context.body = { sound }
    context.status = OK
  }

  playRando = async (context: IApplicationContext) => {
    this.logger.info({
      method: 'playRando'
    })
    const sounds = this.soundService.getSounds()

    if (sounds.length === 0) {
      this.logger.error({
        message: 'sounds.length === 0',
        method: 'playRando'
      })
      context.status = NOT_FOUND
      return
    }

    this.logger.silly({
      soundLength: sounds.length,
      method: 'playRando',
      message: 'sounds length'
    })

    const sound = sounds[randomIntFromInterval(0, sounds.length - 1)]

    this.logger.debug({
      sound,
      message: 'selected sound',
      method: 'playRando'
    })

    await this.playerService.playFile(sound.filename, context.state)

    context.body = { sound }
    context.status = OK
  }

  static getInstance(): IPlayerController {
    if (this.instance !== undefined) return this.instance

    this.instance = new PlayerController(
      PlayerService.getInstance(),
      soundService,
      getPlayerControllerLogger()
    )

    return this.instance
  }
}

export const getPlayerRouter = () =>
  new koaRouter<ApplicationState, IApplicationContext>()
    .get('/rando', PlayerController.getInstance().playRando)
    .get('/:soundId', PlayerController.getInstance().playSound)
