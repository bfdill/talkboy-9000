import * as winstonTransport from 'winston-transport'

export interface IWinstonJestTransport extends winstonTransport {
  readonly mock: jest.Mock
}

export class WinstonJestTransport extends winstonTransport implements IWinstonJestTransport {
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
