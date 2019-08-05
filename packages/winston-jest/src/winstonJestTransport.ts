import * as winstonTransport from 'winston-transport'
import { IWinstonJestTransport } from './winstonJestTransport.types'

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

  callsMatchSnapshot = () =>
    this.mock.mock.calls.forEach(call => expect(call).toMatchSnapshot())
}
