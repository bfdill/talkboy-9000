import * as sane from 'sane'
import { join } from 'path'
import { getJestLogger, IJestLogger } from '@talkboy-9000/winston-jest'
import { SoundService } from './sounds'
import { ISoundService } from './sounds.types'

describe('modules -> sounds', () => {
  const PATH_TO_SOUNDS = '/tmp/fakeaf'
  const saneOnMock = jest.fn()
  const saneWatcherMock = {
    on: saneOnMock
  }
  const saneFunctionMock = (_: string, _1?: sane.Options): sane.Watcher => {
    return saneWatcherMock as any
  }
  const jestLogger: IJestLogger = getJestLogger()
  let soundService: ISoundService
  let baseSoundService: SoundService

  beforeEach(() => {
    saneOnMock.mockReturnValue(saneWatcherMock)
    soundService = new SoundService(
      PATH_TO_SOUNDS,
      saneFunctionMock as any,
      jestLogger.logger
    )
    baseSoundService = soundService as SoundService
  })

  describe('addSound', () => {
    test('id = ordinal position by filename alpha', () => {
      expect(soundService.getSounds(jestLogger.logger)).toHaveLength(0)
      baseSoundService.addSound('/tmp/fake_sound_0.mp3')

      expect(soundService.getSounds(jestLogger.logger)).toHaveLength(1)
      expect(soundService.getSounds(jestLogger.logger)).toMatchSnapshot()

      baseSoundService.addSound('/tmp/a_fake_sound_0.mp3')

      expect(soundService.getSounds(jestLogger.logger)).toHaveLength(2)
      expect(soundService.getSounds(jestLogger.logger)).toMatchSnapshot()

      jestLogger.callsMatchSnapshot()
    })
  })

  describe('createWatch', () => {
    test('wires add and delete on instantiation', () => {
      saneOnMock.mock.calls.forEach(call => {
        expect(call).toMatchSnapshot()
      })

      jestLogger.callsMatchSnapshot()
    })

    test('add, adds', () => {
      const addSoundSpy = jest.spyOn(baseSoundService, 'addSound')
      const fn = saneOnMock.mock.calls[0][1]
      fn('add test')
      expect(addSoundSpy).toHaveBeenCalledWith('add test')
      jestLogger.callsMatchSnapshot()
    })

    test('delete, removes', () => {
      const removeSoundSpy = jest.spyOn(baseSoundService, 'removeSound')
      const fn = saneOnMock.mock.calls[1][1]
      fn('remove test')
      expect(removeSoundSpy).toHaveBeenCalledWith('remove test')
      jestLogger.callsMatchSnapshot()
    })
  })

  describe('getBySoundId', () => {
    test.each<any>([undefined, null, '', '0', 'dog'])(
      "getBySoundId('%s')",
      (soundId: string) => {
        baseSoundService.addSound('/tmp/fake_sound_0.mp3')
        jestLogger.transport.mock.mockReset()

        expect(
          soundService.getBySoundId(soundId, jestLogger.logger)
        ).toMatchSnapshot()
        jestLogger.callsMatchSnapshot()
      }
    )
  })

  describe('getSounds', () => {
    test('no sounds', () => {
      expect(soundService.getSounds(jestLogger.logger)).toHaveLength(0)

      jestLogger.callsMatchSnapshot()
    })

    test('two sounds', () => {
      expect(soundService.getSounds(jestLogger.logger)).toHaveLength(0)

      baseSoundService.addSound('/tmp/fake_sound_0.mp3')
      baseSoundService.addSound('/tmp/a_fake_sound.mp3')
      jestLogger.transport.mock.mockReset()

      const sounds = soundService.getSounds(jestLogger.logger)
      expect(sounds).toHaveLength(2)
      expect(sounds).toMatchSnapshot()

      jestLogger.callsMatchSnapshot()
    })
  })

  describe('isPathValid', () => {
    test.each<[string, boolean]>([
      ['/tmp/invalid_af', false],
      [join(PATH_TO_SOUNDS, 'too_legit'), true]
    ])('validity test', (filename: string, expected) => {
      const actual = soundService.isPathValid(filename, jestLogger.logger)

      expect(actual).toEqual(expected)
    })
  })

  describe('removeSound', () => {
    beforeEach(() => {
      baseSoundService.addSound('a')
      baseSoundService.addSound('b')
      baseSoundService.addSound('c')
      jestLogger.transport.mock.mockReset()
    })

    test('unknown file, no action', () => {
      const expected = baseSoundService.getSounds(jestLogger.logger)
      jestLogger.transport.mock.mockReset()

      baseSoundService.removeSound('f')
      jestLogger.callsMatchSnapshot()

      const actual = baseSoundService.getSounds(jestLogger.logger)
      expect(actual).toEqual(expected)
      expect(actual).toHaveLength(3)
    })

    test.each(['a', 'b', 'c'])(
      'removes file and re-sorts remaining items',
      (filename: string) => {
        baseSoundService.removeSound(filename)
        jestLogger.callsMatchSnapshot()

        expect(baseSoundService.getSounds(jestLogger.logger)).toMatchSnapshot()
      }
    )
  })
})
