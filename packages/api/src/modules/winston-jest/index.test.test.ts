import { WinstonJestTransport, IJestLogger, getJestLogger } from './index.test'

describe('modules -> winston-jest', () => {
  describe('WinstonJestTransport', () => {
    test('log hits the mock', () => {
      const l = new WinstonJestTransport()
      l.log('hi', () => {})
      expect(l.mock).toHaveBeenCalledWith('hi')
    })
  })

  describe('getJestLogger', () => {
    let sut: IJestLogger

    beforeEach(() => {
      sut = getJestLogger()
    })

    test('transport', () => {
      expect(sut.transport).toBeDefined()
      expect(sut.transport instanceof WinstonJestTransport).toBeTruthy()
    })

    test('logger', () => {
      expect(sut.logger).toBeDefined()
      // meh, tmi
      expect(sut.logger.transports[0]).toBe(sut.transport)
    })

    test('callsMatchSnapshot', () => {
      expect(sut.callsMatchSnapshot).toBeDefined()

      sut.logger.log('error', 'call 1')
      sut.logger.log('warn', 'call 2')
      sut.logger.log('info', 'call 3')
      sut.logger.log('verbose', 'call 4')
      sut.logger.log('debug', 'call 5')
      sut.logger.log('silly', 'call 6')

      sut.callsMatchSnapshot()
    })
  })
})
