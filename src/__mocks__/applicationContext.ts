import { mockApplicationState } from './applicationState'
import { IApplicationContext } from '../types'

export const getMockApplicationContext = (): IApplicationContext =>
  ({
    state: mockApplicationState
  } as any)
