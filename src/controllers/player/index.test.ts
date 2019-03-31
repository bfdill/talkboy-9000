import { PlayerController, IPlayerController } from '.'
import { IPlayerService } from '../../modules/player'
import { ISoundService, Sound } from '../../modules/sounds'
import {
  getJestLogger,
  IJestLogger
} from '../../modules/winston-jest/index.test'
import { IApplicationContext } from '../../types'

describe('controllers -> player', () => {
  const playerService: IPlayerService = {
    playFile: jest.fn()
  } as any
  const mockGetBySoundId = jest.fn()
  const mockGetSounds = jest.fn()
  const soundService: ISoundService = {
    getBySoundId: mockGetBySoundId,
    getSounds: mockGetSounds
  } as any
  const sound: Sound = {
    basename: 'mommy shark',
    filename: 'daddy shark',
    id: 'baby_shark'
  }
  let jestLogger: IJestLogger
  let playerController: IPlayerController
  const contextBuilder = (soundId?: any): IApplicationContext =>
    ({
      params: { soundId },
      logger: jestLogger.logger
    } as any)

  beforeEach(() => {
    mockGetSounds.mockReturnValue([])
    jestLogger = getJestLogger()
    playerController = new PlayerController(playerService, soundService)
  })

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  describe('playSound', () => {
    test.each([undefined, null, false, true, 1])(
      'bad request on non-string',
      async (soundId: any) => {
        expect.hasAssertions()
        const context = contextBuilder(soundId)

        await playerController.playSound(context)

        expect(context.body).toMatchSnapshot()
        expect(context.status).toMatchSnapshot()
        jestLogger.callsMatchSnapshot()
      }
    )

    test('not found on unknown song', async () => {
      expect.hasAssertions()

      const context = contextBuilder('unknown')

      await playerController.playSound(context)

      expect(context).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.hasAssertions()

      const context = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)

      await playerController.playSound(context)

      expect(context).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(
        sound.filename,
        jestLogger.logger
      )
      jestLogger.callsMatchSnapshot()
    })
  })

  describe('playRando', () => {
    test('not found when no sounds', async () => {
      expect.hasAssertions()

      const context = contextBuilder()

      await playerController.playRando(context)

      expect(context.status).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.hasAssertions()

      const context = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)
      mockGetSounds.mockReturnValue([sound])

      await playerController.playRando(context)

      expect(context.body).toMatchSnapshot()
      expect(context.status).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(
        sound.filename,
        jestLogger.logger
      )
      jestLogger.callsMatchSnapshot()
    })
  })
})
