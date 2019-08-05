import { WinstonJestTransport } from './winstonJestTransport'

describe('WinstonJestTransport', () => {
  test('log hits the mock', () => {
    const l = new WinstonJestTransport()
    l.log('hi', () => {})
    expect(l.mock).toHaveBeenCalledWith('hi')
  })
})
