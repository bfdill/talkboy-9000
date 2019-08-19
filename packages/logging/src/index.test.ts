import * as logging from './'
import * as winstonTransport from 'winston-transport'

import { WinstonJestTransport } from '@talkboy-9000/winston-jest'

const transportsTest = (transports: winstonTransport[]) => {
  test('expected length', () => {
    expect(transports).toHaveLength(4)
  })

  test('snapshot', () => {
    transports.forEach(t => expect(t.constructor.name).toMatchSnapshot())
  })
}

describe('logging', () => {
  describe('transports', () => {
    const transports = logging.getDefaultTransports()

    transportsTest(transports)
  })

  describe('createLogger', () => {
    const logger = logging.createLogger({ testMeta: true })

    transportsTest(logger.transports)

    test('no log meta no base meta?', () => {
      const wjt = new WinstonJestTransport()

      logger.clear()
      logger.add(wjt)
      logger.log('error', 'hai')

      wjt.callsMatchSnapshot()
    })

    test('logs meta as expected', () => {
      const wjt = new WinstonJestTransport()

      logger.clear()
      logger.add(wjt)
      logger.log('info', 'hai', { metaNeedsMeta: ':( :(' })

      wjt.callsMatchSnapshot()
    })
  })
})
