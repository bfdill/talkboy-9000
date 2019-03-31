import * as koaRouter from 'koa-router'
import { NOT_FOUND } from 'http-status-codes'
import { createLogger } from '../../modules/logging'
import winston = require('winston')
import { ISoundService, soundService } from '../../modules/sounds'

export const soundsControllerLogger = createLogger('SoundsController')

interface ISoundsController {
  get: (ctx: koaRouter.RouterContext) => void
}

export class SoundsController implements ISoundsController {
  constructor(
    protected readonly soundService: ISoundService,
    protected readonly logger: winston.Logger
  ) {}

  get = async (ctx: koaRouter.RouterContext) => {
    const sounds = this.soundService.getSounds()

    if (sounds === null) {
      ctx.status = NOT_FOUND
      ctx.body = { sounds }
      return
    }

    ctx.body = sounds
  }
}

const controllerInstance = new SoundsController(
  soundService,
  soundsControllerLogger
)

export const soundsRouter = new koaRouter().get('/', controllerInstance.get)
