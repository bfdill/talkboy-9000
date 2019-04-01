import {
  getHealthcheckRouter,
  HealthcheckController,
  IHealthcheckController,
  getHealthcheckControllerLogger
} from '.'
import { IApplicationContext, ApplicationState } from '../../types'
import { OK } from 'http-status-codes'
import {
  getJestLogger,
  IJestLogger,
  snapshotExistingLogger
} from '../../modules/winston-jest/index.test'

describe('controllers -> healthcheck', () => {
  const jestLogger: IJestLogger = getJestLogger()
  const healthcheck: IHealthcheckController = new HealthcheckController(
    jestLogger.logger
  )
  const testState: ApplicationState = { correlationId: 'abc123' }
  const testContext: IApplicationContext = { state: testState } as any

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  test('getHealthcheckLogger', () => {
    snapshotExistingLogger(getHealthcheckControllerLogger())
  })

  test('singleton works', () => {
    const expected = HealthcheckController.getInstance()
    const actual = HealthcheckController.getInstance()

    expect(actual).toBe(expected)
  })

  test('healthy, so healthy!', async () => {
    await healthcheck.health(testContext)

    expect(testContext.body).toEqual({ healthy: true })
    expect(testContext.status).toEqual(OK)
    jestLogger.callsMatchSnapshot()
  })

  test('getHealthcheckRouter', () => {
    expect(getHealthcheckRouter()).toMatchSnapshot()
  })
})
