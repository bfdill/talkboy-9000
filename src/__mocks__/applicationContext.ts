import { mockApplicationState } from './applicationState'
import { IApplicationContext } from '../types'
import { getJestLogger } from '../modules/winston-jest/index.test'

export const getMockApplicationContext = (): IApplicationContext =>
  ({
    state: mockApplicationState
  } as any)
