import * as koaRouter from 'koa-router'
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes'
import { createModuleLogger } from '../../modules/logging'
import winston = require('winston')
import { ISoundService, soundService } from '../../modules/sounds'
import { IPlayerService, playerService } from '../../modules/player'
import { randomIntFromInterval } from '../../utils'

const playerControllerLogger = createModuleLogger('PlayerController')

export interface IPlayerController {
  playSound: (ctx: koaRouter.RouterContext) => PromiseLike<void>
  playRando: (ctx: koaRouter.RouterContext) => PromiseLike<void>
}

export class PlayerController implements IPlayerController {
  constructor(
    protected readonly playerService: IPlayerService,
    protected readonly soundService: ISoundService,
    protected readonly logger: winston.Logger
  ) {}

  playSound = async (ctx: koaRouter.RouterContext) => {
    const { soundId } = ctx.params

    if (typeof soundId !== 'string') {
      this.logger.warn({
        soundId,
        message: `playSound().soundId !== string (${soundId})`
      })
      ctx.status = BAD_REQUEST
      ctx.body = { soundId }
      return
    }

    const sound = this.soundService.getBySoundId(soundId)

    if (sound === undefined) {
      this.logger.error({
        soundId,
        message: 'playSound().sound === undefined'
      })
      ctx.status = NOT_FOUND
      ctx.body = { soundId }
      return
    }

    this.logger.debug({
      sound,
      soundId,
      message: 'playSound()'
    })
    await this.playerService.playFile(sound.filename)
    ctx.status = OK
    ctx.body = { sound }
  }

  playRando = async (ctx: koaRouter.RouterContext) => {
    this.logger.info({
      message: 'playRando()'
    })
    const sounds = this.soundService.getSounds()

    if (sounds === null) {
      this.logger.error({
        message: 'playRando().sounds === null'
      })
      ctx.status = NOT_FOUND
      return
    }

    const sound =
      sounds.length === 0
        ? sounds[0]
        : sounds[randomIntFromInterval(0, sounds.length - 1)]

    this.logger.debug({
      sound,
      message: 'playRando()'
    })
    await this.playerService.playFile(sound.filename)
    ctx.body = { sound }
  }
}

const controllerInstance = new PlayerController(
  playerService,
  soundService,
  playerControllerLogger
)

export const playerRouter = new koaRouter()
  .get('/rando', controllerInstance.playRando)
  .get('/:soundId', controllerInstance.playSound)
