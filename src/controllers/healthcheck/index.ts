import * as koaRouter from 'koa-router'

export const healthcheck = (ctx: koaRouter.RouterContext) => {
  ctx.body = { healthy: true }
}

export const healthCheckRoutes = new koaRouter().get('/', healthcheck)
