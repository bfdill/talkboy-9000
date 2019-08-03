import { ISoundService, Sound } from '..'

export interface IMockSoundService extends ISoundService {
  setGetBySoundId: (result: any) => void
  setGetSounds: (result: any) => void
  setIsPathValid: (result: boolean) => void
  getBySoundIdMock: () => jest.Mock
  getSoundsMock: (result: any) => jest.Mock
  IsPathValidMock: (result: boolean) => jest.Mock
}

export const getMockSoundService = (): IMockSoundService => {
  const getBySoundId = jest.fn()
  const getSounds = jest.fn()
  const isPathValid = jest.fn()

  return {
    getBySoundId,
    getSounds,
    isPathValid,
    getBySoundIdMock: getBySoundId,
    getSoundsMock: getSounds,
    IsPathValidMock: isPathValid,
    setGetBySoundId: (result: Sound | undefined) =>
      getBySoundId.mockReturnValue(result),
    setGetSounds: (result: Sound[]) => getSounds.mockReturnValue(result),
    setIsPathValid: (result: boolean) => isPathValid.mockReturnValue(result)
  } as any
}
