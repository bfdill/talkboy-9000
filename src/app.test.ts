import * as Koa from 'koa'
import * as koaRouter from 'koa-router'
import * as winston from 'winston'
import { KoaApp, configureRouter } from './app'
import { inspect } from 'util'
import { getJestLogger } from './modules/winston-jest/index.test'

describe('app', () => {
  test('has expected exports', () => {
    expect(Object.keys(require('./app'))).toMatchSnapshot()
  })

  test('configureRouter', () => {
    const fakeRouter: koaRouter = {} as any
    const mockUse = jest.fn().mockReturnValue(fakeRouter)
    fakeRouter.use = mockUse

    configureRouter(fakeRouter)

    mockUse.mock.calls.forEach(call => {
      expect(call).toMatchSnapshot()
    })
  })

  describe('KoaApp', () => {
    const mockKoaUse = jest.fn()
    const mockKoa: Koa = {
      listen: jest.fn(),
      on: jest.fn(),
      use: mockKoaUse
    } as any
    const mockRouter: koaRouter = {
      allowedMethods: jest.fn(),
      routes: jest.fn()
    } as any

    const jestLogger = getJestLogger()

    const getSut = (
      koa: Koa = mockKoa,
      router: koaRouter = mockRouter,
      logger: winston.Logger = jestLogger.logger
    ) => new KoaApp(koa, router, logger)
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
      expect.assertions(4)
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
