import * as Koa from 'koa'
import * as KoaHelmet from 'koa-helmet'
import * as KoaBody from 'koa-body'
import * as KoaRouter from 'koa-router'
import * as cors from '@koa/cors'
import * as winston from 'winston'
import { createLogger } from '@talkboy-9000/logging'
import { getHealthcheckRouter } from './controllers/healthcheck'
import { getPlayerRouter } from './controllers/player'
import { getSoundsRouter } from './controllers/sounds'
import {
  ApplicationRouter,
  ApplicationKoa,
  ApplicationState,
  IApplication,
  IApplicationContext
} from './types'
import { ISystemMiddleware, SystemMiddleware } from './middleware'

export const configureRouter = (router: ApplicationRouter) =>
  router
    .use('/healthcheck', getHealthcheckRouter().routes())
    .use('/player', getPlayerRouter().routes())
    .use('/sounds', getSoundsRouter().routes())

export const getAppLogger = () =>
  createLogger({
    app: {
      // uhh, got config
      name: 'talkboy-9000',
      version: '2.3.6'
    }
  })
export const getAppRouter = () =>
  configureRouter(new KoaRouter<ApplicationState, IApplicationContext>())

export class App implements IApplication {
  private static instance: IApplication | undefined

  constructor(
    protected readonly koa: ApplicationKoa,
    protected readonly router: ApplicationRouter,
    protected readonly logger: winston.Logger,
    protected readonly systemMiddleware: ISystemMiddleware
  ) {}

  protected setup = (
    koa: ApplicationKoa,
    router: ApplicationRouter,
    logger: winston.Logger,
    systemMiddleware: ISystemMiddleware
  ) => {
    koa.on('error', err => {
      logger.error(err)
    })

    koa
      .use(cors())
      .use(KoaHelmet())
      .use(KoaBody())
      .use(systemMiddleware.middleware)
      .use(router.routes())
      .use(router.allowedMethods())
  }

  listen = (port: number) => {
    this.logger.info({ listen: port })
    this.setup(this.koa, this.router, this.logger, this.systemMiddleware)

    return this.koa.listen(port)
  }

  static getInstance(): IApplication {
    if (this.instance !== undefined) return this.instance

    const logger = getAppLogger()

    this.instance = new App(
      new Koa<ApplicationState, IApplicationContext>(),
      getAppRouter(),
      logger,
      new SystemMiddleware(logger)
    )

    return this.instance
  }
}
