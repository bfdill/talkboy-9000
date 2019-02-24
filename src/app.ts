import * as Koa from 'koa'
import * as helmet from 'koa-helmet'
import * as bodyParser from 'koa-body'
import * as koaRouter from 'koa-router'
import * as winston from 'winston'
import { transports } from './modules/logging'
import { inspect } from 'util'
import { healthCheckRoutes } from './controllers/healthcheck'

const app = new Koa()
const api = new koaRouter()
  .use('/healthcheck', healthCheckRoutes.routes())

const appLogger = winston.createLogger({
  transports,
  defaultMeta: {
    module: 'app',
  }
})

app.on('error', err => {
  appLogger.error(inspect(err))
})

app
  .use(helmet())
  .use(bodyParser())
  .use(api.routes())
  .use(api.allowedMethods())
  .listen(3000, () => appLogger.info({
    message: 'listening on 3000'
  }))
