import * as KoaRouter from 'koa-router'
import { NOT_FOUND, OK } from 'http-status-codes'
import { ISoundService, SoundService } from '@talkboy-9000/sounds'

import { IApplicationContext, ApplicationState } from '../../types'

export interface ISoundsController {
  get: (ctx: IApplicationContext) => void
}

export class SoundsController implements ISoundsController {
  private static instance: ISoundsController | undefined

  constructor(protected readonly soundService: ISoundService) {}

  get = async (context: IApplicationContext) => {
    const logger = context.logger.child({
      controller: {
        name: 'SoundsController',
        method: 'get'
      }
    })
    const sounds = this.soundService.getSounds(logger)

    context.body = { sounds }

    if (sounds === null) {
      logger.warn('no sounds from service')
      context.status = NOT_FOUND
      return
    }

    logger.info({
      soundsLength: sounds.length
    })
    context.status = OK
  }

  static getInstance(): ISoundsController {
    if (this.instance !== undefined) return this.instance

    this.instance = new SoundsController(SoundService.getInstance())

    return this.instance
  }
}

export const getSoundsRouter = () =>
  new KoaRouter<ApplicationState, IApplicationContext>().get(
    '/',
    SoundsController.getInstance().get
  )
