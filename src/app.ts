import * as Koa from 'koa'
import * as helmet from 'koa-helmet'
import * as bodyParser from 'koa-body'
import * as koaRouter from 'koa-router'
import { createModuleLogger } from './modules/logging'
import { inspect } from 'util'
import { healthCheckRouter } from './controllers/healthcheck'
import { playerRouter } from './controllers/player'
import { soundsRouter } from './controllers/sounds'

const app = new Koa()
const api = new koaRouter()
  .use('/healthcheck', healthCheckRouter.routes())
  .use('/player', playerRouter.routes())
  .use('/sounds', soundsRouter.routes())

const appLogger = createModuleLogger('app')

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
