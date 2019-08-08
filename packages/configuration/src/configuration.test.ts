import { Configuration } from './configuration'

describe('configuration', () => {
  test('PathToSounds contains audio', () => {
    const sut = Configuration.ConfigurationService.getInstance()
    expect(
      sut.getSounds().PathToSounds.indexOf('audio')
    ).toBeGreaterThanOrEqual(0)
  })
})
