import * as logging from './'
describe('logging', () => {
  test('transports', () => {
    const transports = logging.getDefaultTransports()

    expect(transports).toMatchSnapshot()
  })

  describe('createLogger', () => {
    test('snapshot', () => {
      expect(logging.createLogger({})).toMatchSnapshot()
    })

    test('b', () => {
      const b = logging.createLogger({})
      expect(b.transports).toMatchSnapshot()
    })

    test('c', () => {
      const c = logging.createLogger({})
      c.log('info', 'c')
    })
  })
})
