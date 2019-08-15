import { ConfigurationService } from './configuration'

describe('configuration', () => {
  describe('logging', () => {
    test('path contains logs', () => {
      const sut = ConfigurationService.getInstance()

      expect(sut.getLogging().path.indexOf('logs')).toBeGreaterThanOrEqual(0)
    })
  })

  describe('sounds', () => {
    test('path contains audio', () => {
      const sut = ConfigurationService.getInstance()

      expect(sut.getSounds().path.indexOf('audio')).toBeGreaterThanOrEqual(0)
    })
  })
})
