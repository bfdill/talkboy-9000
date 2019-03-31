import * as KoaRouter from 'koa-router'
import { OK } from 'http-status-codes'
import { ApplicationState, IApplicationContext } from '../../types'

export const healthcheck = async (context: IApplicationContext) => {
  const logger = context.logger.child({ controller: 'healthcheck' })

  context.body = { healthy: true }
  context.status = OK

  logger.silly('success')
}

export const getHealthcheckRouter = () =>
  new KoaRouter<ApplicationState, IApplicationContext>().get('/', healthcheck)
