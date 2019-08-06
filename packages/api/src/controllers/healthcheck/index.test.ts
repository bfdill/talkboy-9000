import {
  getHealthcheckRouter,
  HealthcheckController,
  IHealthcheckController
} from '.'
import { IApplicationContext } from '../../types'
import { OK } from 'http-status-codes'
import { getJestLogger, IJestLogger } from '@talkboy-9000/winston-jest'
import { mockApplicationState } from '../../__mocks__/applicationState'

describe('controllers -> healthcheck', () => {
  const jestLogger: IJestLogger = getJestLogger()
  const testContext: IApplicationContext = {
    state: mockApplicationState,
    logger: jestLogger.logger
  } as any
  const healthcheckController: IHealthcheckController = new HealthcheckController()

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  test('singleton works', () => {
    const expected = HealthcheckController.getInstance()
    const actual = HealthcheckController.getInstance()

    expect(actual).toBe(expected)
  })

  test('healthy, so healthy!', async () => {
    await healthcheckController.health(testContext)

    expect(testContext.body).toEqual({ healthy: true })
    expect(testContext.status).toEqual(OK)
    jestLogger.callsMatchSnapshot()
  })

  test('getHealthcheckRouter', () => {
    expect(getHealthcheckRouter()).toMatchSnapshot()
  })
})
