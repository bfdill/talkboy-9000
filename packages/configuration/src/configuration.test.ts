import { ConfigurationService } from './configuration'

describe('configuration', () => {
  test('PathToSounds contains audio', () => {
    const sut = ConfigurationService.getInstance()

    expect(
      sut.getSounds().PathToSounds.indexOf('audio')
    ).toBeGreaterThanOrEqual(0)
  })
})
