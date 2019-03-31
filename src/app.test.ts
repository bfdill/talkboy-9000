import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'
import * as winston from 'winston'
import { inspect } from 'util'

import {
  IApplicationContext,
  ApplicationState,
  ApplicationRouter,
  ApplicationKoa
} from './types'
import { App, configureRouter, getAppLogger, getAppRouter } from './app'
import { getJestLogger } from './modules/winston-jest/index.test'
import { ILoggingMiddleware, LoggingMiddleware } from './modules/logging'

describe('app', () => {
  test('has expected exports', () => {
    expect(Object.keys(require('./app'))).toMatchSnapshot()
  })

  test('configureRouter', () => {
    const fakeRouter: ApplicationRouter = {} as any
    const mockUse = jest.fn().mockReturnValue(fakeRouter)
    fakeRouter.use = mockUse

    configureRouter(fakeRouter)

    mockUse.mock.calls.forEach(call => {
      expect(call).toMatchSnapshot()
    })
  })

  test('getAppLogger', () => {
    const logger = getAppLogger()

    expect(logger).toBeDefined()
  })

  test('getAppRouter', () => {
    const router = getAppRouter()

    expect(router).toBeDefined()
    expect(router).toMatchSnapshot()
  })

  describe('App', () => {
    const mockKoaUse = jest.fn()
    const mockKoa: ApplicationKoa = {
      listen: jest.fn(),
      on: jest.fn(),
      use: mockKoaUse
    } as any
    const mockRouter: ApplicationRouter = {
      allowedMethods: jest.fn(),
      routes: jest.fn()
    } as any
    const jestLogger = getJestLogger()
    const getSut = (
      koa: ApplicationKoa = mockKoa,
      router: ApplicationRouter = mockRouter,
      logger: winston.Logger = jestLogger.logger,
      loggerMiddleware: ILoggingMiddleware = new LoggingMiddleware()
    ) => new App(koa, router, logger, loggerMiddleware)

    const TEST_PORT = 12345

    beforeEach(() => {
      mockKoaUse.mockReturnValue(mockKoa)

      const sut = getSut()
      sut.listen(TEST_PORT)
    })

    test('listen logs', () => {
      jestLogger.callsMatchSnapshot()
    })

    test('koa.use matches snapshot', () => {
      expect.assertions(5)
      mockKoaUse.mock.calls.forEach(call => {
        // this is like super meh 🦐
        expect(inspect(call)).toMatchSnapshot()
      })
    })

    test('calls routes', () => {
      expect(mockRouter.routes).toHaveBeenCalled()
    })

    test('calls allowedMethods', () => {
      expect(mockRouter.allowedMethods).toHaveBeenCalled()
    })

    test('on error is registered and logs an error', () => {
      const koaOn = (<jest.Mock>mockKoa.on).mock.calls[0]
      const error = new Error('can has error')

      expect(koaOn[0]).toEqual('error')
      koaOn[1](error)
      jestLogger.callsMatchSnapshot()
    })
  })
})
