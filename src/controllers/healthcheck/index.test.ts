import { healthcheck, getHealthcheckRouter } from '.'
import { IApplicationContext } from '../../types'
import { OK } from 'http-status-codes'
import { getJestLogger } from '../../modules/winston-jest/index.test'

describe('controllers -> healthcheck', () => {
  test('healthy, so healthy!', async () => {
    const jestLogger = getJestLogger()
    const context: IApplicationContext = {
      logger: jestLogger.logger
    } as any
    await healthcheck(context)
    expect(context.body).toEqual({ healthy: true })
    expect(context.status).toEqual(OK)
    jestLogger.callsMatchSnapshot()
  })

  test('getHealthcheckRouter', () => {
    expect(getHealthcheckRouter()).toMatchSnapshot()
  })
})
