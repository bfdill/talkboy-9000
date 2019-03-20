// this file has 'test' in its' name because it can only be loaded in a context
// where jest exists.  once jest exists, it expects a test to be in a 'test' file
// so, yeah, that's a thing and i'm not really digging into this at all
import * as winstonTransport from 'winston-transport'

export interface IWinstonJestTransport extends winstonTransport {
  readonly mock: jest.Mock
}

export class WinstonJestTransport extends winstonTransport
  implements IWinstonJestTransport {
  public readonly mock: jest.Mock = jest.fn()

  constructor(opts?: winstonTransport.TransportStreamOptions) {
    super(opts)
  }

  log = (info: any, next: () => void): any => {
    this.mock(info)
    next()
  }

  logv = (info: any, next: () => void): any => {
    this.mock(info)
    next()
  }
}

describe('modules -> winston-jest', () => {
  test('log hits the mock', () => {
    const l = new WinstonJestTransport()
    l.log('hi', () => {})
    expect(l.mock).toHaveBeenCalledWith('hi')
  })
})
