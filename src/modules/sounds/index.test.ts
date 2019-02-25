import { logger } from '../logging'
import { soundService } from '.'

describe('modules -> sounds', () => {
  test('sound service returns sounds', () => {
    const ss = soundService

    logger.info(`known sounds: ${ss.getSounds()}`)
  })
})
