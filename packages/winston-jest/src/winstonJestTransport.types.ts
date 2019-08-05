import * as winstonTransport from 'winston-transport'

export interface IWinstonJestTransport extends winstonTransport {
  readonly mock: jest.Mock
  callsMatchSnapshot: () => void
}
