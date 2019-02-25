import * as koaRouter from 'koa-router'
import { NOT_FOUND } from 'http-status-codes'
import { createModuleLogger } from '../../modules/logging'
import winston = require('winston')
import { ISoundService, soundService } from '../../modules/sounds'
import { IPlayerService, playerService } from '../../modules/player'
import { randomIntFromInterval } from '../../utils';

const playerControllerLogger = createModuleLogger('PlayerController')

interface IPlayerController {
  playSong: (ctx: koaRouter.RouterContext) => PromiseLike<void>
  playRando: (ctx: koaRouter.RouterContext) => PromiseLike<void>
}

class PlayerController implements IPlayerController {
  constructor(
    protected readonly playerService: IPlayerService,
    protected readonly soundService: ISoundService,
    protected readonly logger: winston.Logger
  ) { }

  playSong = async (ctx: koaRouter.RouterContext) => {
    const { soundId } = ctx.params

    const sound = this.soundService.getBySoundId(soundId)

    if (sound === undefined) {
      this.logger.error({
        soundId,
        message: 'playSong().sound === undefined'
      })
      ctx.status = NOT_FOUND
      ctx.body = { soundId }
      return
    }

    this.logger.debug({
      sound,
      soundId,
      message: 'playSong()'
    })
    this.playerService.playFile(sound.filename)
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

    const soundIndex = randomIntFromInterval(0, sounds.length - 1)
    const sound = sounds[soundIndex]
    this.logger.debug({
      sound,
      soundIndex,
      message: 'playRando()'
    })
    this.playerService.playFile(sound.filename)
  }
}

const controllerInstance = new PlayerController(playerService, soundService, playerControllerLogger)

export const playerRouter = new koaRouter()
  .get('/rando', controllerInstance.playRando)
  .get('/:soundId', controllerInstance.playSong)
