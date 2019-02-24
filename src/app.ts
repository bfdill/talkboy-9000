import * as Koa from 'koa'
import * as helmet from 'koa-helmet'
import * as bodyParser from 'koa-body'
import * as Router from 'koa-router'
import { logger } from './modules/logging'

const app = new Koa()
const router = new Router()

router.get('/', (ctx: Router.RouterContext) => {
  ctx.body = 'online'
})

app
  .use(helmet())
  .use(bodyParser())
  .use(router.routes())
  .listen(3000, () => logger.info({
    message: 'listening on 3000'
  }))
