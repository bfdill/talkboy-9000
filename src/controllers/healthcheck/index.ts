import * as koaRouter from 'koa-router'

export const healthcheck = async (ctx: koaRouter.RouterContext) => {
  ctx.body = { healthy: true }
}

export const healthCheckRouter = new koaRouter().get('/', healthcheck)
