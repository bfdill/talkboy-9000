import { Server } from 'http'
import * as Koa from 'koa'
import * as helmet from 'koa-helmet'
import * as bodyParser from 'koa-body'
import * as koaRouter from 'koa-router'
import * as winston from 'winston'
import { createModuleLogger } from './modules/logging'
import { healthCheckRouter } from './controllers/healthcheck'
import { playerRouter } from './controllers/player'
import { soundsRouter } from './controllers/sounds'

export interface IKoaApp {
  listen: (port: number) => Server
}

export const configureRouter = (koaRouter: koaRouter) =>
  koaRouter
    .use('/healthcheck', healthCheckRouter.routes())
    .use('/player', playerRouter.routes())
    .use('/sounds', soundsRouter.routes())

export class KoaApp implements IKoaApp {
  constructor(
    protected koa: Koa,
    protected router: koaRouter,
    protected logger: winston.Logger
  ) {}

  protected setup = (koa: Koa, router: koaRouter, logger: winston.Logger) => {
    koa.on('error', err => {
      logger.error(err)
    })

    koa
      .use(helmet())
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods())
  }

  listen = (port: number) => {
    this.logger.info(`listen(${port})`)
    this.setup(this.koa, this.router, this.logger)

    return this.koa.listen(port)
  }
}

export const router = configureRouter(new koaRouter())
export const logger = createModuleLogger('app')
