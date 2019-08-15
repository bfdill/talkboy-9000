import * as logging from './'
import { WinstonJestTransport } from '@talkboy-9000/winston-jest'
// import { inspectAndLog } from '@talkboy-9000/utils'

describe('logging', () => {
  describe('transports', () => {
    const transports = logging.getDefaultTransports()

    test('expected length', () => {
      expect(transports).toHaveLength(4)
    })

    test('snapshot', () => {
      expect(transports).toMatchSnapshot()
    })
  })

  describe('createLogger', () => {
    test('c', () => {
      const wjt = new WinstonJestTransport()
      const l = logging.createLogger({})

      l.clear()
      l.add(wjt)
      l.log('info', 'c')

      wjt.callsMatchSnapshot()
    })
  })
})
