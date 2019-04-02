import * as KoaRouter from 'koa-router'
import { OK } from 'http-status-codes'
import { ApplicationState, IApplicationContext } from '../../types'

export interface IHealthcheckController {
  health: (context: IApplicationContext) => PromiseLike<void>
}

export class HealthcheckController implements IHealthcheckController {
  private static instance: IHealthcheckController | undefined

  health = async (context: IApplicationContext) => {
    context.body = { healthy: true }
    context.status = OK

    context.logger
      .child({
        controller: {
          name: 'HealthcheckController'
        }
      })
      .silly('success', context.state)
  }

  static getInstance(): IHealthcheckController {
    if (this.instance !== undefined) return this.instance

    this.instance = new HealthcheckController()

    return this.instance
  }
}

export const getHealthcheckRouter = () =>
  new KoaRouter<ApplicationState, IApplicationContext>().get(
    '/',
    HealthcheckController.getInstance().health
  )
