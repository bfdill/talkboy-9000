import * as Koa from 'koa'

import { KoaApp, router } from './app'
import { logger } from './modules/logging'

const koaApp = new KoaApp(new Koa(), router, logger)
