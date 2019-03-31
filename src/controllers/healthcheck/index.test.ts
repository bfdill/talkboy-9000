import {
  getHealthcheckRouter,
  Healthcheck,
  IHealthcheck,
  getHealthcheckLogger
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
  const healthcheck: IHealthcheck = new Healthcheck(jestLogger.logger)
  const testState: ApplicationState = { correlationId: 'abc123' }
  const testContext: IApplicationContext = { state: testState } as any

  test('getHealthcheckLogger', () => {
    snapshotExistingLogger(getHealthcheckLogger())
  })

  test('singleton works', () => {
    const expected = Healthcheck.getInstance()
    const actual = Healthcheck.getInstance()

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
