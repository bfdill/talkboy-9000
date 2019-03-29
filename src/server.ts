import * as Koa from 'koa'

import { KoaApp, router, logger } from './app'

export const koaApp = new KoaApp(new Koa(), router, logger)

koaApp.listen(3000)
