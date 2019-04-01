import * as KoaRouter from 'koa-router'
import { OK } from 'http-status-codes'
import { ApplicationState, IApplicationContext } from '../../types'
import winston = require('winston')
import { createLogger } from '../../modules/logging'

export const getHealthcheckControllerLogger = () =>
  createLogger({
    controller: {
      name: 'HealthcheckController'
    }
  })

export interface IHealthcheckController {
  health: (context: IApplicationContext) => PromiseLike<void>
}

export class HealthcheckController implements IHealthcheckController {
  private static instance: IHealthcheckController | undefined

  constructor(protected logger: winston.Logger) {}

  health = async (context: IApplicationContext) => {
    context.body = { healthy: true }
    context.status = OK

    this.logger.silly('success', context.state)
  }

  static getInstance(): IHealthcheckController {
    if (this.instance !== undefined) return this.instance

    this.instance = new HealthcheckController(getHealthcheckControllerLogger())

    return this.instance
  }
}

export const getHealthcheckRouter = () =>
  new KoaRouter<ApplicationState, IApplicationContext>().get(
    '/',
    HealthcheckController.getInstance().health
  )
