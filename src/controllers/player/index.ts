import * as koaRouter from 'koa-router'
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes'
import { ISoundService, soundService } from '../../modules/sounds'
import { IPlayerService, PlayerService } from '../../modules/player'
import { randomIntFromInterval } from '../../utils'
import { ApplicationState, IApplicationContext } from '../../types'

export interface IPlayerController {
  playSound: (context: IApplicationContext) => PromiseLike<void>
  playRando: (context: IApplicationContext) => PromiseLike<void>
}

export class PlayerController implements IPlayerController {
  private static instance: IPlayerController | undefined

  constructor(
    protected readonly playerService: IPlayerService,
    protected readonly soundService: ISoundService
  ) {}

  playSound = async (context: IApplicationContext) => {
    const logger = context.logger.child({
      controller: {
        name: 'PlayerController',
        method: 'playSound'
      }
    })
    const { soundId } = context.params
    logger.info({
      message: `soundId(${soundId})`
    })

    if (typeof soundId !== 'string') {
      logger.error({
        soundId,
        message: 'soundId !== string'
      })
      context.body = { soundId }
      context.status = BAD_REQUEST
      return
    }

    const sound = this.soundService.getBySoundId(soundId)

    if (sound === undefined) {
      logger.error({
        soundId,
        message: 'sound === undefined'
      })
      context.body = { soundId }
      context.status = NOT_FOUND
      return
    }

    logger.debug({
      sound,
      soundId,
      message: 'playSound()'
    })

    await this.playerService.playFile(sound.filename, logger)

    context.body = { sound }
    context.status = OK
  }

  playRando = async (context: IApplicationContext) => {
    const logger = context.logger.child({
      controller: {
        name: 'PlayerController',
        method: 'playRando'
      }
    })

    logger.info({
      message: 'playRando()'
    })
    const sounds = this.soundService.getSounds()

    if (sounds.length === 0) {
      logger.error({
        message: 'playRando().sounds.length === 0'
      })
      context.status = NOT_FOUND
      return
    }

    logger.silly({
      soundLength: sounds.length,
      message: 'sounds length'
    })

    const sound = sounds[randomIntFromInterval(0, sounds.length - 1)]

    logger.debug({
      sound,
      message: 'selected sound'
    })

    await this.playerService.playFile(sound.filename, logger)

    context.body = { sound }
    context.status = OK
  }

  static getInstance(): IPlayerController {
    if (this.instance !== undefined) return this.instance

    this.instance = new PlayerController(
      PlayerService.getInstance(),
      soundService
    )

    return this.instance
  }
}

export const getPlayerRouter = () =>
  new koaRouter<ApplicationState, IApplicationContext>()
    .get('/rando', PlayerController.getInstance().playRando)
    .get('/:soundId', PlayerController.getInstance().playSound)
