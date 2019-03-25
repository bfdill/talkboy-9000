import koaRouter = require('koa-router')
import { healthcheck } from '.'

describe('controllers -> healthcheck', () => {
  test('healthy, so healthy!', async () => {
    const ctx: koaRouter.RouterContext = {} as any
    await healthcheck(ctx)
    expect(ctx.body).toEqual({ healthy: true })
  })
})
