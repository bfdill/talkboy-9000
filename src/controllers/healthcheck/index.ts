import * as KoaRouter from 'koa-router'
import { OK } from 'http-status-codes'
import { ApplicationState, IApplicationContext } from '../../types'
import winston = require('winston')
import { createLogger } from '../../modules/logging'

export const getHealthcheckLogger = () =>
  createLogger({
    controller: {
      name: 'healthcheck'
    }
  })

export interface IHealthcheck {
  health: (context: IApplicationContext) => PromiseLike<void>
}

export class Healthcheck implements IHealthcheck {
  private static instance: IHealthcheck | undefined

  constructor(protected logger: winston.Logger) {}

  health = async (context: IApplicationContext) => {
    context.body = { healthy: true }
    context.status = OK

    this.logger.silly('success')
  }

  static getInstance(): IHealthcheck {
    if (this.instance !== undefined) return this.instance

    this.instance = new Healthcheck(getHealthcheckLogger())

    return this.instance
  }
}

export const getHealthcheckRouter = () =>
  new KoaRouter<ApplicationState, IApplicationContext>().get(
    '/',
    Healthcheck.getInstance().health
  )
